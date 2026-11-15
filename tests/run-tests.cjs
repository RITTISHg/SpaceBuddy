// Frontend + simulation tests (headless, no dependencies). Usage: node tests/run-tests.cjs
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
let js = html.split('<script>')[1].split('</script>')[0].replace(/render\(\);\s*$/, '');
const el = () => ({ getContext: () => ({}), style: {}, appendChild() {}, animate: () => ({}), classList: { add() {} }, setAttribute() {}, remove() {} });
Object.assign(global, {
  document: { getElementById: el, createElement: el, querySelector: () => null, body: { appendChild() {}, animate() {} } },
  innerWidth: 800, innerHeight: 600, addEventListener() {}, matchMedia: () => ({ matches: true }),
  requestAnimationFrame: () => 0, cancelAnimationFrame() {}, confirm: () => true,
  localStorage: { getItem: () => null, setItem() {} },
  navigator: { hardwareConcurrency: 8 },
});
js += `;
const results = runTests().split("\\n");
const ok = (c, n) => results.push((c ? "PASS " : "FAIL ") + n);
const screens = ["welcome","create","hub","zero","rover","rocket","planets","survive","nav","radio","cert","parents","outpost","watch","gallery","nasa"];
for (const s of screens) { P.scr = s; let r; try { r = acad(); } catch (e) { r = e.message; } ok(typeof r === "string" && !/is not|undefined/.test(r.slice(0,40)), "Academy screen renders: " + s); }
ok(gl3() === false, "3D falls back safely when WebGL/Three.js is unavailable");
// Regression: the Overview calls preview(), which clones state; it must not lose the rng and crash
S = init("moon"); let threw = null; try { ovw(); } catch (e) { threw = e; } ok(!threw, "Overview renders for a running mission (preview keeps working)");
// Regression: the whole mission can be played through to the end in both worlds without errors
for (const w of ["moon","mars"]) { let err = null; try { S = init(w); trigger(S); let g = 0; while (!S.over && g++ < 40) { if (S.pending || S.pendRand) { const e = S.pendRand ? RANDEV.find(x=>x.id===S.pendRand) : EV[S.pending]; choose(0); } step(S); } } catch (e) { err = e; } ok(!err && S.over, "Full " + w + " mission plays to an end"); }
// Videos: well-formed list
ok(VIDEOS.length > 0 && VIDEOS.every(v => v.q && v.t), "VIDEOS entries have a NASA library search query and a title");
globalThis.__R = results;`;
(0, eval)(js);
const R = globalThis.__R;
R.forEach(r => console.log(r));
const failed = R.filter(r => r.startsWith('FAIL')).length;
console.log(`\nFrontend: ${R.length - failed}/${R.length} passed`);
process.exit(failed ? 1 : 0);
