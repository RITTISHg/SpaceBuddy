# 🚀 SPACEBUDDY · Junior Astronaut Mission Trainer

**NASA Space Apps Challenge 2026 – "Build a Junior Astronaut Mission Trainer"** · Team ELECTRONS_07

A space-academy game where children train as astronauts through eight missions. The centrepiece is a Moon/Mars **outpost simulation** in which power, life support, water, food, radiation and crew health depend on each other, with scheduled and random emergencies and decisions that have consequences.

## Features

- **8 missions:** Zero Gravity, Moon Rover, Rocket Builder, 3D Planet Explorer, Outpost Survival (Moon and Mars), Space Survival, Navigation, Mission Control.
- **Outpost simulation:** solar, batteries, life support, greenhouse, radiation shields, medical bay; 20-sol missions; live gauges and trend charts; 4 scheduled and 5 random events; crew morale and health recovery; mission report with lessons learned. Equations: [`docs/SIMULATION.md`](docs/SIMULATION.md).
- **Learning:** Learning Centre with sources, quiz, "why did that happen" explanations, NASA fact gallery, embedded NASA videos.
- **Live NASA data (via the backend):** Astronomy Picture of the Day, recent solar flares (DONKI), fresh Curiosity photos.
- **Cosmo, the space guide:** voice and subtitles; 40+ built-in topics; real AI answers with game context when a Gemini key is configured on the server.
- **Three languages:** English, Tamil, Hindi (core interface; see limitations).
- **Rewards:** XP, ranks, daily challenge, certificate, anonymous leaderboard.
- **Child-friendly and accessible:** large buttons, animations and sound (mutable), 3D with 2D fallback, reduced-motion support, skip link, live-region announcements, keyboard play for the Rover and Navigation games.

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env      # add your NASA key (and optionally a Gemini key)
npm run server            # backend on http://localhost:8787
npm run dev               # frontend on http://localhost:3000 (proxies /api to the backend)
npm test                  # 57 automated tests
```

The frontend also works without the backend: Live NASA, leaderboard and AI Cosmo simply show a friendly "unavailable" message and Cosmo answers locally.

## Deploy

**Option A – one service (simplest), e.g. Render or Railway:** build command `npm install && npm run build`, start command `npm start`. The backend serves the built app and the API from one URL. Set environment variables from `.env.example`.

**Option B – Vercel (frontend) + Render (backend):** `vercel.json` is included. Put your backend URL in `<meta name="api-base" content="https://...">` in `src/index.html`, and set `CORS_ORIGIN` on the backend to your Vercel URL.

After deploying, paste the live URL here: **_add your public URL_**.

## Repository layout

```
src/index.html        Frontend (HTML, CSS and JavaScript in one file)
backend/server.js     Backend: NASA proxy, progress, leaderboard, Cosmo AI proxy, static hosting
docs/SIMULATION.md    Mathematical model, assumptions, dependencies
docs/API.md           Backend endpoints, limits, privacy
docs/TESTING.md       Test coverage, defects fixed, balance results, manual checklist
tests/                run-tests.cjs (frontend and simulation), api-tests.cjs (backend)
scripts/verify-videos.mjs   Checks that the NASA video IDs exist
```

## Challenge deliverables

| # | Deliverable | Where |
|---|---|---|
| 1-2 | Web app; Moon mission with Mars mode | `src/index.html` |
| 3-4 | Outpost construction; resource dashboard | Outpost Survival |
| 5 | Simulation engine | `step()`, `flows()`; `docs/SIMULATION.md` |
| 6-7 | Emergency events and decisions | Event pop-ups |
| 8 | Learning Centre and quizzes | Learn tab and Academy |
| 9 | Results and reports | Mission report |
| 10 | Child-friendly interface | Whole app |
| 11 | Source code, frontend and backend | This repository |
| 12 | Simulation documentation | `docs/SIMULATION.md` |
| 13 | NASA data integration | Live NASA screen (APOD, DONKI, Mars photos), references below |
| 14 | Live deployment | *add after deploying* |
| 15 | Testing results | `docs/TESTING.md`, `npm test` |

## NASA resources

NASA Open APIs (APOD, DONKI, Mars Rover Photos): https://api.nasa.gov/ · DONKI: https://ccmc.gsfc.nasa.gov/tools/DONKI/ · ECLSS: https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/ · Space Radiation: https://www.nasa.gov/hrp/hazard-space-radiation/ · Deep Space Habitation: https://www.nasa.gov/humans-in-space/deep-space-habitation-overview/ · Moon Base Systems: https://www.nasa.gov/moonbase-systems/ · Growing Plants in Space: https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/ · Veggie: https://science.nasa.gov/mission/veggie/ · Mars dust storms: https://science.nasa.gov/resource/mars-report-dust-storms-on-mars/ · Space Apps challenge page: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

The simulation's structure follows these sources, but its numeric constants are simplified teaching values (see `docs/SIMULATION.md`). Not affiliated with or endorsed by NASA.

## Security

Never commit `.env`. API keys are used only by the backend. If a key has been shared in a chat, email or screenshot, request a new one at https://api.nasa.gov/ and discard the old one.

## Known limitations

- NASA video IDs in `VIDEOS` have not been verified in the build environment. Run `npm run verify-videos` and fix any failure before submitting.
- Live NASA, AI Cosmo and the leaderboard were tested against mock servers only; check them once against the real services after deployment.
- Tamil and Hindi cover the core interface; many game descriptions and all quiz text are English. Translations were machine-generated and should be reviewed by native speakers.
- The leaderboard is anonymous and client-reported, so it cannot be made cheat-proof. The JSON file store resets on hosts with an ephemeral disk.
- Games run in 2D except the 3D Earth and Planet Explorer. Touch and 3D behaviour still needs checking on real devices.
- The Moon mission is forgiving (a sensible player wins easily); Mars is the challenge level.

## AI disclosure

Parts of this project's code, tests and documentation were produced with AI assistants (including Claude by Anthropic). Team ELECTRONS_07 should edit this paragraph so it accurately describes what the team wrote, reviewed and tested itself.

## License

MIT – see `LICENSE`.

## v2.2 – Phase 1 (foundation) changes

- **NASA videos:** now streamed as real mp4 files from the official NASA Image and Video Library (`images-api.nasa.gov`, no key needed) with a loading spinner, retry button and a link to the NASA library if a video cannot load. Replaces the YouTube embeds that showed "Video unavailable". `npm run verify-videos` targets the old IDs and is obsolete.
- **NASA key errors:** if NASA answers 401/403/429 for your key, the server logs a clear warning and retries once with `DEMO_KEY`. A 403 means the key in `.env` is invalid or not yet activated: request one at https://api.nasa.gov/.
- **Shell:** ⛶ full-screen button in the header (Fullscreen API), no sideways overflow, Cosmo can be minimised (🤖 button, minimised by default on phones) so it no longer covers game content, and a random NASA fact appears when a game starts.

## v2.3 – Phase 2 (games)

- **Planet Explorer (3D):** one full-screen stage with a lit Sun (glow, shadows), the selected planet centred, procedural planet textures with bump maps, atmospheres, Earth clouds, Saturn's rings (with shadows), moons that orbit, axial tilts, and NASA fact-sheet data. Drag to orbit, scroll or pinch to zoom, ☀ looks toward the Sun, ⟳ toggles auto-orbit, ⛶ goes full screen. Visit 4 planets to earn the star.
- **Moon Rover (3D):** detailed six-wheel rover with suspension (each wheel follows the terrain, body pitches and rolls), spinning wheels, craters, hills, boulders (collisions), lunar-gravity dust particles, shadows, an Earth in the sky and five NASA-fact discovery beacons. Keyboard (arrows/WASD, Space brakes) and on-screen pads.
- Browsers without WebGL fall back to the original 2D versions.

## v2.4 – Phase 3 (remaining five games)

- **Zero Gravity (3D):** an ISS cabin with an Earth window. Drag and flick six objects (they tumble and bounce), then switch to Earth gravity to compare. 8 flicks earn the star.
- **Rocket Builder (3D):** attach four parts that drop onto the pad, then count down and launch. Engine flame and smoke, the sky fades from blue to black and stars appear as you climb to orbit.
- **Navigation (3D):** fly through an asteroid field toward a growing Earth using pointer, touch or arrow keys/WASD. 3 shields, camera shake on impact, progress bar.
- **Space Survival (animated):** habitat scene with oxygen, temperature and radio gauges. The difficulty ramps up and random events (meteoroid, solar flare, heater fault) hit you. Keys 1-4 trigger the controls.
- **Mission Control (animated):** Houston console with radar sweep, telemetry waveform and mission clock; same voice-command quiz.
- All of them run in the full-screen stage (⛶). Zero Gravity, Rocket Builder and Navigation fall back to the original 2D versions without WebGL.
