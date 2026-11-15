# Testing Results

Run everything with `npm test` (no browser needed). Two suites run:

| Suite | File | Tests |
|---|---|---|
| Frontend and simulation | `tests/run-tests.cjs` | 38 |
| Backend API | `tests/api-tests.cjs` | 19 |
| **Total** | | **57 / 57 passing** |

## Frontend and simulation (38)

Simulation: energy balance, brownout, greenhouse harvest, water failure, storm radiation (shelter vs continue, shields), oxygen failure, mission end, lunar-night sunlight, medical bay healing, seeded random numbers. App: i18n (English plus Tamil fallback), video list well-formed, quiz data, random events and medbay defined, all 16 Academy screens render (including the new Live NASA screen), 3D falls back safely without WebGL, the Overview renders for a running mission, and a full Moon and a full Mars mission play to an end.

## Backend (19)

Health endpoint and key secrecy; CORS; APOD, DONKI and Mars proxies (data simplified, https only, unsafe URLs dropped); the NASA key is sent upstream but never returned; progress validation (bad id, unknown missions, XP cap); name sanitising; leaderboard order; progress round-trip; Cosmo AI proxy (markdown stripped, key in header only, prompt carries language, game state and child-safety rules); Cosmo fallback with no key; empty question; oversized and malformed bodies; path traversal blocked; unknown routes; rate limiting.

The NASA and Gemini services are replaced by local mock servers in these tests. **They have not been run against the real NASA or Gemini services from the test environment**, so do a live check after deploying (open the Live NASA screen and ask Cosmo a question).

## Defects found in the uploaded v2.0 and fixed

| Defect | Effect | Fix |
|---|---|---|
| Unescaped apostrophes in five Learning Centre strings and one extra `}` in the supply-cache event | JavaScript syntax error: **the whole app would not start (blank page)** | Fixed |
| `preview()` copied state with JSON and lost the random-number function | Overview crashed as soon as a mission started | Preview now supplies a neutral generator |
| Test runner used `require` in a project marked `"type": "module"` | `npm test` crashed immediately | Runner renamed to `.cjs`; tests extended |

## Balance playthroughs (scripted policies, 300 missions each, random events on)

| World | Policy | Win rate | Avg. final health (wins) |
|---|---|---|---|
| Moon | First option at every event, no building | 100 % | 78 |
| Moon | Worst option at every event | 0 % | - |
| Moon | Planned (greenhouse, batteries, medical bay, shield) | 100 % | 100 |
| Mars | First option, no building | 9 % | 39 |
| Mars | Worst option at every event | 0 % | - |
| Mars | Planned | 96 % | 98 |

Reading: choices matter (worst choices always fail) and Mars is clearly harder. The Moon is forgiving: sensible event choices alone win, so it works as an easy "Cadet" level. A harder Moon difficulty is a good future addition.

In addition, 600 fully random playthroughs (random choices and builds in both worlds) ran without any error.

## Manual checklist (still to do in real browsers)

- [ ] Phone (360 px) and laptop (1280 px): every station playable; touch controls work.
- [ ] Zero Gravity, Rover and Navigation with touch and with the keyboard (Rover and Navigation support arrow keys).
- [ ] 3D Earth and Planet Explorer on a mid-range phone; 2D fallback with WebGL disabled.
- [ ] Tamil and Hindi: text fits, fonts render, speech works where the browser has a voice.
- [ ] Run `npm run verify-videos` on a machine with internet and replace any failing video.
- [ ] Live NASA screen and Cosmo against the deployed backend.
- [ ] Lighthouse accessibility and performance check.
