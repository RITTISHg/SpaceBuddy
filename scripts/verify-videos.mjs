// Checks every YouTube ID in the VIDEOS list of src/index.html using YouTube's public oEmbed endpoint.
// Usage: npm run verify-videos   (needs internet access)
import fs from 'node:fs';
const html = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
const block = html.match(/const VIDEOS=\[([\s\S]*?)\];/)[1];
const vids = [...block.matchAll(/\{id:'([^']+)',t:'([^']*)'\}/g)].map(m => ({ id: m[1], t: m[2] }));
let bad = 0;
for (const v of vids) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + v.id)}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' (missing, private, or embedding disabled)');
    const j = await r.json();
    const nasa = /nasa/i.test(j.author_name);
    if (!nasa) bad++;
    console.log(`${nasa ? 'OK  ' : 'CHECK'} ${v.id}  "${j.title}"  by ${j.author_name}${nasa ? '' : '  <-- not a NASA channel'}`);
  } catch (e) { bad++; console.log(`FAIL ${v.id}  (${v.t}): ${e.message}`); }
}
console.log(bad ? `\n${bad} of ${vids.length} need attention: replace or remove them in src/index.html.` : `\nAll ${vids.length} videos exist and are on NASA channels.`);
process.exit(bad ? 1 : 0);
