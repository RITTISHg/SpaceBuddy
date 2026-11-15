// SPACEBUDDY backend - zero-dependency Node.js (>=18) server.
// NASA API proxy (key stays server-side), player progress + leaderboard, Cosmo AI proxy, optional static hosting.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dir, '..');
// Tiny .env loader (no dependency). Real environment variables win.
try {
  for (const l of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env is fine */ }

const E = process.env;
const PORT = Number(E.PORT) || 8787;
const NASA_KEY = E.NASA_API_KEY || E.NASA_OPEN_API || 'DEMO_KEY';
const NASA_BASE = E.NASA_BASE || 'https://api.nasa.gov';
const GEMINI_KEY = E.GEMINI_API_KEY || '';
const GEMINI_MODEL = E.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_BASE = E.GEMINI_BASE || 'https://generativelanguage.googleapis.com';
const ORIGIN = E.CORS_ORIGIN || '*';
const DATA_FILE = E.DATA_FILE || (process.env.VERCEL ? path.join('/tmp', 'data.json') : path.join(__dir, 'data.json'));
const MISSIONS = ['zero', 'rover', 'rocket', 'planets', 'outpost', 'survive', 'nav', 'radio'];
const MAX_XP_PER_MISSION = 150; // 100 + 50 daily bonus

/* ---------- storage (JSON file, atomic write) ---------- */
let db = { players: {} };
try { db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { /* new db */ }
function persist() {
  try { fs.writeFileSync(DATA_FILE + '.tmp', JSON.stringify(db)); fs.renameSync(DATA_FILE + '.tmp', DATA_FILE); } catch (e) { console.error('persist failed', e.message); }
}

/* ---------- helpers ---------- */
const hits = new Map();
function limited(ip, bucket, max) {
  const k = bucket + ip, now = Date.now(), h = hits.get(k);
  if (!h || now - h.t > 60000) { hits.set(k, { n: 1, t: now }); return false; }
  return ++h.n > max;
}
setInterval(() => { const now = Date.now(); for (const [k, h] of hits) if (now - h.t > 60000) hits.delete(k); }, 60000).unref();
const cache = new Map();
let keyWarned = false;
async function nasa(p, ttl = 3600000) {
  const c = cache.get(p);
  if (c && Date.now() - c.t < ttl) return c.v;
  const call = key => fetch(`${NASA_BASE}${p}${p.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(3000) });
  let r = await call(NASA_KEY);
  // 401/403 usually means the key is invalid or not yet activated; 429 means the key's hourly limit is used up.
  // Retry once with NASA's shared DEMO_KEY so the app still shows live data.
  if ((r.status === 401 || r.status === 403 || r.status === 429) && NASA_KEY !== 'DEMO_KEY') {
    if (!keyWarned) { keyWarned = true; console.warn(`NASA rejected your key (HTTP ${r.status}). Check NASA_API_KEY in .env (request one at https://api.nasa.gov/). Falling back to DEMO_KEY.`); }
    r = await call('DEMO_KEY');
  }
  if (!r.ok) throw new Error('NASA responded ' + r.status);
  const v = await r.json();
  cache.set(p, { t: Date.now(), v });
  return v;
}
const imgCache = new Map();
async function nasaImages(q, ttl = 3600000) {
  const c = imgCache.get(q);
  if (c && Date.now() - c.t < ttl) return c.v;
  const r = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error('NASA Images responded ' + r.status);
  const items = ((await r.json()).collection?.items || []).filter(i => i.links?.[0]?.href && i.data?.[0]);
  imgCache.set(q, { t: Date.now(), v: items });
  return items;
}
const nasaItem = i => ({ title: String(i.data[0].title || '').slice(0, 200), date: String(i.data[0].date_created || '').slice(0, 10), explanation: String(i.data[0].description || '').slice(0, 600), url: httpsUrl(String(i.links[0].href).replace(/^http:/, 'https:')) });
const send = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
};
function body(req, max = 10000) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.reject(Object.assign(new Error('bad json'), { code: 400 })); }
  }
  return new Promise((ok, bad) => {
    let s = '', over = false;
    req.on('data', d => { if (over) return; s += d; if (s.length > max) { over = true; s = ''; bad(Object.assign(new Error('too large'), { code: 413 })); } });
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { bad(Object.assign(new Error('bad json'), { code: 400 })); } });
  });
}
const cleanName = n => String(n || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 16) || 'Astronaut';
const httpsUrl = u => (typeof u === 'string' && /^https:\/\//.test(u) ? u : '');

/* ---------- Cosmo AI ---------- */
const SYS = 'You are Cosmo, a friendly space guide robot for children aged 8 to 14 inside a NASA-inspired learning game. ' +
  'Answer in at most 3 short, simple sentences. Be accurate, encouraging and age-appropriate. Never give medical, personal or unsafe advice. ' +
  'If the question is not about space, science or the game, gently steer back to space. Do not use markdown. Do not ask for personal information.';
const LANG = { en: 'English', ta: 'Tamil', hi: 'Hindi' };
async function cosmo(q, lang, ctx) {
  if (!GEMINI_KEY) return null;
  const c = ctx && typeof ctx === 'object' ? ctx : {};
  const state = c.sim ? `Game state: world ${String(c.sim.world).slice(0, 6)}, sol ${+c.sim.day || 0}, oxygen ${+c.sim.o2 || 0} kg, water ${+c.sim.water || 0} L, food ${+c.sim.food || 0} kg, battery ${+c.sim.bat || 0} kWh, health ${+c.sim.health || 0}%.` : 'No mission is running.';
  const prompt = `${state}\nReply in ${LANG[lang] || 'English'}.\nChild asks: ${q}`;
  const r = await fetch(`${GEMINI_BASE}/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: SYS }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 160, temperature: 0.6 } }),
    signal: AbortSignal.timeout(8000)
  });
  if (!r.ok) throw new Error('AI responded ' + r.status);
  const j = await r.json();
  const t = j?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').replace(/[*_`#]/g, '').trim();
  return t ? t.slice(0, 400) : null;
}

/* ---------- static hosting (optional single-service deploy) ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.ico': 'image/x-icon' };
const WEB = fs.existsSync(path.join(ROOT, 'dist')) ? path.join(ROOT, 'dist') : path.join(ROOT, 'src');
function serveStatic(req, res) {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const base = p.startsWith('/gallery/') ? path.join(ROOT, 'public') : WEB;
  const f = path.normalize(path.join(base, p));
  if (!f.startsWith(base + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(f).pipe(res);
}

/* ---------- routes ---------- */
export async function handleRequest(req, res) {
  const rawPath = req.headers?.['x-matched-path'] || req.url || '/';
  const u = new URL(rawPath.startsWith('/') ? rawPath : '/' + rawPath, 'http://x'), ip = req.socket?.remoteAddress || req.headers?.['x-forwarded-for'] || '?';
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (!u.pathname.startsWith('/api/')) return req.method === 'GET' ? serveStatic(req, res) : send(res, 405, { error: 'method not allowed' });
  try {
    if (limited(ip, 'all', 120)) return send(res, 429, { error: 'slow down' });
    const route = req.method + ' ' + u.pathname;
    if (route === 'GET /api/health') return send(res, 200, { ok: true, ai: !!GEMINI_KEY, nasaKey: NASA_KEY !== 'DEMO_KEY' });

    if (route === 'GET /api/nasa/apod') {
      try {
        const a = await nasa('/planetary/apod');
        return send(res, 200, { title: String(a.title || '').slice(0, 200), date: a.date, media: a.media_type === 'image' ? 'image' : 'other', url: httpsUrl(a.url), explanation: String(a.explanation || '').slice(0, 600), credit: 'NASA APOD' });
      } catch {
        const items = await nasaImages('astronomy nebula galaxy');
        const it = items[Math.floor(Date.now() / 864e5) % Math.max(1, items.length)];
        return send(res, 200, { ...nasaItem(it), media: 'image', credit: 'NASA Image Library' });
      }
    }
    if (route === 'GET /api/nasa/donki') {
      try {
        const end = new Date(), start = new Date(Date.now() - 30 * 864e5), d = x => x.toISOString().slice(0, 10);
        const f = await nasa(`/DONKI/FLR?startDate=${d(start)}&endDate=${d(end)}`, 1800000);
        const flares = (Array.isArray(f) ? f : []).slice(-5).reverse().map(x => ({ time: String(x.peakTime || x.beginTime || ''), cls: String(x.classType || '?').slice(0, 6), region: x.activeRegionNum || null }));
        return send(res, 200, { flares, credit: 'NASA DONKI' });
      } catch {
        const r = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json', { signal: AbortSignal.timeout(6000) });
        if (!r.ok) throw new Error('NOAA responded ' + r.status);
        const f = await r.json();
        const flares = (Array.isArray(f) ? f : []).filter(x => x.max_class).slice(-5).reverse().map(x => ({ time: String(x.max_time || x.begin_time || ''), cls: String(x.max_class).slice(0, 6), region: x.active_region || null }));
        return send(res, 200, { flares, credit: 'NOAA Space Weather' });
      }
    }
    if (route === 'GET /api/nasa/mars') {
      try {
        const m = await nasa('/mars-photos/api/v1/rovers/curiosity/latest_photos');
        const list = (m && Array.isArray(m.latest_photos) ? m.latest_photos : []).filter(p => p.img_src && !/^javascript:/i.test(p.img_src));
        const photos = list.slice(0, 4).map(p => ({
          img: httpsUrl(String(p.img_src).replace(/^http:/, 'https:')),
          date: String(p.earth_date || ''),
          camera: String(p.camera?.full_name || 'Curiosity').slice(0, 60)
        })).filter(p => p.img);
        if (!photos.length) throw new Error('no photos');
        return send(res, 200, { rover: 'Curiosity', photos, credit: 'NASA Mars Rover Photos' });
      } catch {
        const items = await nasaImages('curiosity rover mars surface');
        const off = Math.floor(Date.now() / 864e5) % Math.max(1, items.length - 4);
        const photos = items.slice(off, off + 4).map(i => { const n = nasaItem(i); return { img: n.url, date: n.date, camera: n.title.slice(0, 60) }; });
        return send(res, 200, { rover: 'Curiosity', photos, credit: 'NASA Image Library' });
      }
    }
    if (route === 'GET /api/gallery') {
      const mf = path.join(ROOT, 'public', 'gallery', 'manifest.json');
      if (fs.existsSync(mf)) {
        try { return send(res, 200, JSON.parse(fs.readFileSync(mf, 'utf8'))); } catch {}
      }
      const dir = path.join(ROOT, 'public', 'gallery');
      const files = [];
      const scan = (d, rel = '') => {
        if (!fs.existsSync(d)) return;
        for (const f of fs.readdirSync(d)) {
          const full = path.join(d, f), sub = rel ? rel + '/' + f : f;
          if (fs.statSync(full).isDirectory()) scan(full, sub);
          else if (/\.(jpe?g|png|webp|gif|avif)$/i.test(f)) files.push(sub);
        }
      };
      scan(dir);
      return send(res, 200, files.sort());
    }

    if (route === 'POST /api/progress') {
      if (limited(ip, 'prog', 30)) return send(res, 429, { error: 'slow down' });
      const b = await body(req);
      if (!/^[A-Za-z0-9-]{8,64}$/.test(String(b.id || ''))) return send(res, 400, { error: 'bad id' });
      const done = [...new Set((Array.isArray(b.done) ? b.done : []).filter(x => MISSIONS.includes(x)))];
      const xp = Math.max(0, Math.min(Math.floor(Number(b.xp) || 0), done.length * MAX_XP_PER_MISSION));
      db.players[b.id] = { name: cleanName(b.name), xp, done, updated: Date.now() };
      persist();
      return send(res, 200, { ok: true, xp, stars: done.length });
    }
    if (route === 'GET /api/progress') {
      const p = db.players[u.searchParams.get('id')];
      return p ? send(res, 200, p) : send(res, 404, { error: 'not found' });
    }
    if (route === 'GET /api/leaderboard') {
      const top = Object.values(db.players).sort((a, b) => b.xp - a.xp || a.updated - b.updated).slice(0, 10).map(p => ({ name: p.name, xp: p.xp, stars: p.done.length }));
      return send(res, 200, { top });
    }
    if (route === 'POST /api/cosmo') {
      if (limited(ip, 'ai', 10)) return send(res, 429, { error: 'Cosmo needs a short rest' });
      const b = await body(req, 4000);
      const q = String(b.q || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      if (!q) return send(res, 400, { error: 'empty question' });
      const answer = await cosmo(q, LANG[b.lang] ? b.lang : 'en', b.ctx).catch(e => { console.error('cosmo:', e.message); return null; });
      return send(res, 200, answer ? { answer, source: 'ai' } : { answer: null, source: 'fallback' });
    }
    return send(res, 404, { error: 'unknown route' });
  } catch (e) {
    if (e.code === 413 || e.code === 400) { res.on('finish', () => req.destroy()); return send(res, e.code, { error: e.message }); }
    console.error(e.message);
    return send(res, 502, { error: 'upstream unavailable' });
  }
}
const server = http.createServer(handleRequest);
if (!process.env.VERCEL) {
  server.listen(PORT, () => console.log(`SPACEBUDDY backend on http://localhost:${PORT} (AI ${GEMINI_KEY ? 'on' : 'off - local fallback'}, NASA key ${NASA_KEY === 'DEMO_KEY' ? 'DEMO_KEY' : 'set'})`));
}
export default handleRequest;
export { server };
