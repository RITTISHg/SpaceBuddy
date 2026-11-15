# 🚀 SPACEBUDDY

### Train like an astronaut. Survive on the Moon and Mars.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://space-buddy-dusky.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-57%20passing-brightgreen.svg)](tests/)

**NASA Space Apps Challenge 2026 · "Build a Junior Astronaut Mission Trainer" · Team ELECTRONS_07**

**SpaceBuddy** is an interactive, browser-based space academy designed for young explorers (ages 8–14). Featuring 8 STEM training missions and the flagship **Outpost Survival** 3D game, SpaceBuddy turns complex space science into hands-on survival challenges.

🌐 **Live Application:** [https://space-buddy-dusky.vercel.app/](https://space-buddy-dusky.vercel.app/)  
📦 **GitHub Repository:** [https://github.com/RITTISHg/SpaceBuddy](https://github.com/RITTISHg/SpaceBuddy)

---

## 🌕 The Big Idea

> *"Learning is easier when you have to save the crew."*

Instead of memorizing textbook facts about electrolysis, solar irradiance, or radiation shielding, players manage them in real time. Every critical decision teaches real-world space science through cause and effect.

---

## 🎮 Outpost Survival (3D Game)

Choose between the **Moon** and **Mars**, land your crew of 4 astronauts, and survive up to **20 sols** (space days) against dynamic planetary hazards.

| You Manage | You Face | You Do |
|---|---|---|
| 🫧 **Oxygen** (O₂) | 🌪️ **Dust Storms** (Mars solar loss) | ⛏️ **Mine Resources** (ice, regolith, metal) |
| ⚡ **Energy** (Battery/kWh) | ☢️ **Solar Flares** (X-ray storms) | 🏗️ **Construct 6 Base Machines** |
| 🍎 **Food** (Greenhouse crops) | ☄️ **Meteorite Hull Breaches** | 🔧 **Repair Damaged Equipment** |
| 💧 **Water** (Life support cycle) | ⚡ **System Brownouts & Faults** | 🏃 **Walk & Jump in Low Gravity** |
| 🌡️ **Temperature** (Heating load) | 🥶 **Extreme Heat & Cold Cycles** | 🎯 **Complete Sol Objectives** |
| 🛡️ **Radiation** (Shielding mSv) | 🌙 **Lunar Night (14-day cycles)** | 🧑‍🚀 **Monitor Suit Life Support** |

### Buildable Base Machines
- ☀️ **Solar Arrays:** Generate power during daylight sols (severely reduced in storms and lunar night).
- 🔋 **Battery Banks:** Store excess energy to survive night cycles and cold snaps.
- 🫧 **Life Support System:** Recycles water and runs electrolysis to generate breathable oxygen.
- 🌱 **Hydroponic Greenhouse:** Uses water and energy over 8 sols to harvest fresh food crops.
- 🛡️ **Regolith Radiation Shield:** Hardens the habitat against cosmic rays and solar flares.
- 🏥 **Medical Bay:** Restores crew health and treats radiation sickness.

### Controls
- **Movement:** `W` `A` `S` `D` or Arrow keys
- **Camera:** Click & drag mouse to rotate · Scroll wheel to zoom
- **Actions:** `Space` to jump in low gravity · Hold `E` to mine, deliver resources, or repair
- **Building:** Keys `1` through `6` to construct machines
- **Pause:** `P` to pause/resume
- **Mobile Support:** On-screen virtual joystick and touch action buttons automatically appear on touchscreens.

---

## 🧰 The Space Academy

Complete 8 interactive training missions to earn XP, unlock astronaut ranks, and qualify for the official mission certificate:

1. 🌌 **Zero Gravity:** Master Newton’s laws of motion and object handling in microgravity.
2. 🚜 **Moon Rover:** Drive across cratered lunar terrain while conserving energy and handling low traction.
3. 🚀 **Rocket Builder:** Configure thrust, stages, and fuel ratios to reach orbit safely.
4. 🪐 **Planet Explorer:** Take a full 3D interactive tour of the Solar System with real astronomical data.
5. 🆘 **Space Survival:** Make quick tactical decisions during orbital depressurization and life support emergencies.
6. 🧭 **Celestial Navigation:** Learn star charts, constellation bearings, and orbital rendezvous paths.
7. 📡 **Mission Control:** Monitor real telemetry feeds and coordinate crisis responses.
8. 🏆 **Printable Certificate:** Celebrate achievements with a custom, downloadable astronaut completion certificate.

---

## 📡 Live NASA & Space Weather Integration

SpaceBuddy connects directly to live NASA and NOAA feeds to bring real astronomical data into the classroom:

- 📷 **Astronomy Picture of the Day (APOD):** Daily cosmic features directly from NASA's planetary API with automatic fallback to NASA's high-resolution Image Archive.
- ☀️ **Real-Time Solar Weather:** Live X-ray flare monitoring from NOAA's GOES satellites and NASA DONKI, connecting real solar flare data to in-game radiation mechanics.
- 🔴 **Curiosity Rover Imagery:** The latest Martian surface captures streamed directly from Mars rovers.
- 🛡️ **Secure Architecture:** Backend proxy keeps keys safe on the server side, with client-side failover ensuring data is always accessible.

---

## 🤖 Cosmo: The Talking Space Guide

- Powered by **Google Gemini AI** with real-time mission context awareness.
- Children can ask Cosmo questions in **English**, **Tamil (தமிழ்)**, or **Hindi (हिन्दी)**.
- Includes a child-safe built-in encyclopedia with 40+ instant fallback topics (Moon, Mars, gravity, rockets, Veggie system, radiation, and game mechanics) for offline or low-connectivity environments.

---

## 📸 Curated NASA Image Gallery

SpaceBuddy features a built-in gallery with **64 high-resolution NASA photographs** across 8 educational categories:

- 🧑‍🚀 **Astronauts:** Spacewalk preparations, EVA suits, and neutral buoyancy training.
- 🛰️ **International Space Station:** Cupola views, robotic arms, and orbital laboratory modules.
- 🔴 **Mars Exploration:** Jezero Crater panoramas, rock strata, and rover perspectives.
- 🌕 **Moon & Apollo:** Historic Apollo landing sites, lunar regolith footprints, and orbital photography.
- 🚜 **Rovers & Helicopters:** Perseverance rover route maps and Ingenuity aerial flights.
- 🪐 **Solar System:** Comparative planetary sizes, gas giants, and exoplanet concepts.
- ☀️ **Solar Weather:** Extreme ultraviolet imagery from NASA's Solar Dynamics Observatory (SDO).
- 🚀 **Spacecraft & Launchers:** SLS rockets, Orion capsules, and Artemis program milestones.

Full image sources, dates, and credits are cataloged in `public/gallery/nasa_junior_astronaut_gallery/CREDITS_AND_IMAGE_SOURCES.json`.

---

## ▶️ Local Setup & Development

### Prerequisites
- **Node.js 18+** installed ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node)

### Installation

```bash
# Clone the repository
git clone https://github.com/RITTISHg/SpaceBuddy.git
cd SpaceBuddy

# Install dependencies
npm install

# Start development servers (frontend on :3000, backend proxy on :8787)
npm run dev
```

Open your browser to: **http://localhost:3000**

### Environment Configuration (Optional)

Copy `.env.example` to `.env` to configure custom API keys (the app works out of the box with free public demo keys):

```env
NASA_API_KEY=your_free_nasa_key      # Free from https://api.nasa.gov/
GEMINI_API_KEY=your_gemini_key       # Optional: enables AI-powered Cosmo guide
PORT=8787
```

### Automated Testing

Run the comprehensive unit and integration test suite:

```bash
npm test
```

*Results: 38/38 frontend tests passing · 19/19 backend API tests passing · 57/57 total.*

### Production Build

```bash
npm run build
```

---

## 🌐 Cloud Deployment (Vercel)

SpaceBuddy is optimized for instant deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Vercel automatically detects `vercel.json`:
   - Builds frontend with Vite to `dist/`.
   - Routes `/api/*` requests to serverless functions in `api/`.
4. (Optional) Set `NASA_API_KEY` and `GEMINI_API_KEY` in Vercel Project Settings > Environment Variables.

---

## 🗂️ Project Map

```
SpaceBuddy/
├── api/                       # Vercel Serverless Function entry points
│   ├── health.js              # System health & API availability
│   ├── cosmo.js               # AI guide proxy
│   ├── gallery.js             # Photo gallery service
│   ├── leaderboard.js         # Top astronauts scoring
│   ├── progress.js            # Anonymous progress synchronization
│   └── nasa/                  # NASA proxy endpoints (apod, donki, mars)
├── backend/
│   └── server.js              # Standalone Node.js server (HTTP, API router, rate limiting)
├── docs/
│   ├── API.md                 # REST API specification & security details
│   ├── SIMULATION.md          # Mathematical life-support & survival simulation model
│   └── TESTING.md             # Automated test architecture & test scenarios
├── public/
│   └── gallery/               # 64 curated NASA photos + manifest.json
├── src/
│   └── index.html             # Single-page web app, UI styling, and Three.js 3D engine
├── tests/
│   ├── run-tests.cjs          # Headless frontend & simulation test runner
│   └── api-tests.cjs          # Backend proxy, rate limiting & security test runner
├── package.json               # Scripts, engines, and project dependencies
├── vercel.json                # Vercel serverless routing & build configuration
└── vite.config.js             # Vite development server & build bundler
```

---

## 🔬 Space Science & Educational Pedagogy

SpaceBuddy simplifies authentic space exploration principles for young learners:
- **In-Situ Resource Utilization (ISRU):** Harvesting local water ice and regolith instead of hauling all supplies from Earth.
- **Electrolysis:** Splitting water molecules into hydrogen and oxygen for life support.
- **Thermal Equilibrium:** Managing extreme temperature deltas without thick atmospheric insulation.
- **Radiation Protection:** Using dense regolith shields to stop high-energy solar protons and galactic cosmic rays.
- **Microgravity & Low Gravity:** Exploring physiological effects of Moon gravity (0.166g) vs Mars gravity (0.376g).

**Educational Data Sources:**
- NASA Open Data Portal (`api.nasa.gov`)
- NASA Image and Video Library (`images-api.nasa.gov`)
- NOAA Space Weather Prediction Center (`services.swpc.noaa.gov`)
- NASA Solar System Exploration & Mars Fact Sheets

---

## 🔒 Privacy & Safety

- **No Personal Accounts:** Players use randomized, anonymous astronaut callsigns.
- **No Ads or Tracking:** Zero third-party trackers, zero advertising cookies.
- **Child-Safe AI:** Cosmo answers are strictly filtered, capped at 3 short sentences, and restricted to educational space topics.
- **Local-First Storage:** Mission progress is stored locally in the student's browser (`localStorage`).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

*Built with passion by **Team ELECTRONS_07** for the next generation of space explorers.* 🌌  
*NASA Space Apps Challenge 2026*
