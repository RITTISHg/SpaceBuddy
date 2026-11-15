// Backend tests: starts mock NASA + mock Gemini servers and the real backend, then checks every endpoint.
const http = require('http'), { spawn } = require('child_process'), path = require('path'), os = require('os'), fs = require('fs');
const R = []; const ok = (c, n) => R.push((c ? 'PASS ' : 'FAIL ') + n);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const seen = { nasaKeys: [], gemini: null };
const mock = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'); let b = '';
  req.on('data', d => b += d); req.on('end', () => {
    const j = o => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (u.pathname.startsWith('/planetary/apod')) { seen.nasaKeys.push(u.searchParams.get('api_key')); return j({ title: 'Test <Nebula>', date: '2026-01-01', media_type: 'image', url: 'https://apod.nasa.gov/x.jpg', explanation: 'e' }); }
    if (u.pathname.startsWith('/DONKI/FLR')) return j([{ peakTime: '2026-01-02T01:00Z', classType: 'M1.2', activeRegionNum: 1 }, { peakTime: '2026-01-03T01:00Z', classType: 'X2.0' }]);
    if (u.pathname.includes('latest_photos')) return j({ latest_photos: [{ img_src: 'http://mars.nasa.gov/a.jpg', earth_date: '2026-01-01', camera: { full_name: 'Mast' } }, { img_src: 'javascript:alert(1)', earth_date: 'x' }] });
    if (u.pathname.includes(':generateContent')) { seen.gemini = { key: req.headers['x-goog-api-key'], body: JSON.parse(b) }; return j({ candidates: [{ content: { parts: [{ text: '**Gravity** pulls things down!' }] } }] }); }
    res.writeHead(404); res.end();
  });
});
function start(port, env) {
  const data = path.join(os.tmpdir(), 'sb-' + port + '.json'); try { fs.unlinkSync(data); } catch {}
  const p = spawn('node', [path.join(__dirname, '..', 'backend', 'server.js')], { env: { ...process.env, PORT: port, DATA_FILE: data, ...env }, stdio: 'ignore' });
  return p;
}
async function waitUp(port) { for (let i = 0; i < 50; i++) { try { await fetch(`http://localhost:${port}/api/health`); return; } catch { await sleep(100); } } throw new Error('server did not start'); }
(async () => {
  await new Promise(r => mock.listen(18788, r));
  const base = 'http://localhost:18787', post = (p, b, port = 18787) => fetch(`http://localhost:${port}${p}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  const s1 = start(18787, { NASA_BASE: 'http://localhost:18788', NASA_API_KEY: 'SECRETKEY123', GEMINI_API_KEY: 'GKEY', GEMINI_BASE: 'http://localhost:18788', CORS_ORIGIN: 'https://example.org' });
  const s2 = start(18789, { NASA_BASE: 'http://localhost:18788', GEMINI_API_KEY: '' });
  try {
    await waitUp(18787); await waitUp(18789);
    let r = await fetch(base + '/api/health'), j = await r.json();
    ok(j.ok && j.ai === true && !JSON.stringify(j).includes('SECRETKEY123'), 'health endpoint works and does not leak keys');
    ok(r.headers.get('access-control-allow-origin') === 'https://example.org', 'CORS origin follows CORS_ORIGIN');
    r = await fetch(base + '/api/nasa/apod'); j = await r.json();
    ok(r.status === 200 && j.title.includes('Nebula') && j.url.startsWith('https://'), 'APOD proxy returns simplified data');
    ok(seen.nasaKeys[0] === 'SECRETKEY123' && !JSON.stringify(j).includes('SECRETKEY123'), 'NASA key is sent upstream only, never returned to the browser');
    r = await fetch(base + '/api/nasa/donki'); j = await r.json();
    ok(j.flares.length === 2 && j.flares[0].cls === 'X2.0', 'DONKI flares are simplified, newest first');
    r = await fetch(base + '/api/nasa/mars'); j = await r.json();
    ok(j.photos.length === 1 && j.photos[0].img.startsWith('https://'), 'Mars photos upgraded to https and unsafe URLs dropped');
    r = await post('/api/progress', { id: 'abc', name: 'x', xp: 5, done: [] }); ok(r.status === 400, 'progress rejects invalid player id');
    r = await post('/api/progress', { id: 'player-0001', name: '<b>Nova</b>', xp: 99999, done: ['zero', 'rover', 'bogus', 'zero'] }); j = await r.json();
    ok(r.status === 200 && j.stars === 2 && j.xp === 300, 'progress ignores unknown missions and caps XP to what was earned');
    await post('/api/progress', { id: 'player-0002', name: 'Luna', xp: 100, done: ['zero'] });
    j = await (await fetch(base + '/api/leaderboard')).json();
    ok(j.top[0].xp >= j.top[1].xp && j.top.every(p => !/[<>]/.test(p.name)), 'leaderboard is sorted and names are sanitised');
    j = await (await fetch(base + '/api/progress?id=player-0002')).json(); ok(j.name === 'Luna', 'saved progress can be loaded back');
    r = await post('/api/cosmo', { q: 'What is gravity?', lang: 'ta', ctx: { sim: { world: 'moon', day: 4, o2: 30 } } }); j = await r.json();
    ok(j.source === 'ai' && j.answer === 'Gravity pulls things down!' && seen.gemini.key === 'GKEY', 'Cosmo AI proxy works, strips markdown, key sent in header only');
    ok(/Tamil/.test(JSON.stringify(seen.gemini.body)) && /oxygen 30/.test(JSON.stringify(seen.gemini.body)) && /children/.test(JSON.stringify(seen.gemini.body)), 'Cosmo prompt includes language, game state and child-safety system prompt');
    j = await (await post('/api/cosmo', { q: 'hi' }, 18789)).json(); ok(j.source === 'fallback' && j.answer === null, 'Cosmo falls back cleanly when no AI key is configured');
    r = await post('/api/cosmo', { q: '' }); ok(r.status === 400, 'Cosmo rejects an empty question');
    r = await fetch(base + '/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'x'.repeat(20000) }); ok(r.status === 413, 'oversized request bodies are rejected');
    r = await fetch(base + '/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' }); ok(r.status === 400, 'malformed JSON is rejected');
    r = await fetch(base + '/..%2f.env'); const txt = await r.text(); ok(r.status !== 200 || !/NASA_|KEY=/.test(txt), 'static server blocks path traversal to .env');
    r = await fetch(base + '/api/nope'); ok(r.status === 404, 'unknown API routes return 404');
    let last = 0; for (let i = 0; i < 12; i++) last = (await post('/api/cosmo', { q: 'moon' })).status; ok(last === 429, 'Cosmo is rate limited (10 per minute per client)');
  } catch (e) { ok(false, 'API test run crashed: ' + e.message); }
  s1.kill(); s2.kill(); mock.close();
  R.forEach(x => console.log(x));
  const failed = R.filter(x => x.startsWith('FAIL')).length;
  console.log(`\nBackend: ${R.length - failed}/${R.length} passed`); process.exit(failed ? 1 : 0);
})();
