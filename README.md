# 🚀 SPACEBUDDY

### Train like an astronaut. Survive on the Moon and Mars.

**NASA Space Apps Challenge 2026 · "Build a Junior Astronaut Mission Trainer" · Team ELECTRONS_07**

SpaceBuddy is a browser-based space academy for kids (ages 8–14). Eight short missions teach real space science, and the star of the show is **Outpost Survival**, a full-screen 3D game where you keep a crew alive on another world.

---

## 🌕 The big idea

> Learning is easier when you have to **save the crew**.

Instead of reading about oxygen, radiation or dust storms, players *manage* them, and every mistake teaches a real lesson.

## 🎮 Outpost Survival (3D)

Pick **Moon** or **Mars**, then survive **10 sols** (space days).

| You manage | You face | You do |
|---|---|---|
| 🫧 Oxygen | 🌪️ Dust storms (Mars) | ⛏️ Mine ice, regolith, metal |
| ⚡ Energy | ☢️ Solar flares | 🏗️ Build 6 machines around your base |
| 🍎 Food | ☄️ Meteorite leaks | 🔧 Repair broken equipment |
| 💧 Water | ⚡ Equipment faults | 🏃 Walk, jump in low gravity |
| 🌡️ Temperature | 🥶 Heat and cold swings | 🎯 Complete mission objectives |
| 🛡️ Radiation | 🌙 Day and night cycles | 🧑‍🚀 Watch your suit oxygen |

Hazards get tougher every sol. Each one shows a short science fact.

**Controls:** `W A S D` move · drag mouse to turn the camera · wheel to zoom · `Space` jump · hold `E` to mine / deliver / repair · `1–6` build · `P` pause. Touch buttons appear on phones.

## 🧰 More in the academy

Zero Gravity · Moon Rover · Rocket Builder · Planet Explorer · Space Survival · Navigation · Mission Control, plus:

- 📡 **Live NASA data** (picture of the day, solar flares, Mars photos)
- 📸 **Animated photo gallery** (drop images in `public/gallery/`)
- 🤖 **Cosmo**, a talking space guide
- 🌍 English, Tamil and Hindi
- ⭐ XP, ranks, daily challenge and printable certificate

## ▶️ Run it

Needs **Node.js 18+**.

```bash
npm install
npm run dev        # starts the website (3000) and backend (8787) together
```

Open **http://localhost:3000**

Optional: copy `.env.example` to `.env` and add a free NASA key from https://api.nasa.gov/ (and a Gemini key for AI Cosmo). The app works without them.

```bash
npm test           # automated tests
npm run build      # production build
```

## 🖼️ Add your own photos

Put `.jpg .png .webp` files into `public/gallery/` and refresh the Gallery page. They fade in with animation and open in a full-screen viewer.

## 🗂️ Project map

```
src/index.html      the whole game (HTML + CSS + JS, three.js for 3D)
backend/server.js   NASA data, leaderboard, Cosmo AI, hosting
public/gallery/     your photos
docs/               simulation model, API, testing notes
tests/              automated tests
```

## 🔬 Science used

Real ideas, simplified for kids: electrolysis for oxygen, ice mining (ISRU), plant growth, radiation shielding with regolith, Moon vs Mars gravity, and dust-storm solar loss.

**Data sources:** NASA APIs and Image Library · NOAA Space Weather

## 🔒 Privacy

No accounts, no ads, no tracking. Progress is saved only in the player's browser.

## 📄 License

MIT. See `LICENSE`.

---

*Built by Team ELECTRONS_07 for the next generation of explorers.* 🌌
