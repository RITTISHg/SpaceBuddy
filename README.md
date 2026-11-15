# 🚀 SPACEBUDDY

### Train like an astronaut. Survive on the Moon and Mars.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-space--buddy--dusky.vercel.app-blue?style=flat&logo=vercel)](https://space-buddy-dusky.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SpaceBuddy-black?style=flat&logo=github)](https://github.com/RITTISHg/SpaceBuddy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**NASA Space Apps Challenge 2026 · "Build a Junior Astronaut Mission Trainer" · Team ELECTRONS_07**

SpaceBuddy is an interactive mission training platform designed for students aged 8–14. At the center of SpaceBuddy is **Outpost Survival**—a real-time 3D planetary base simulation where cadets take command of a base on the Moon or Mars and keep their crew alive. 

Supporting the outpost mission is a full preparatory academy, an AI flight assistant, live NASA data feeds, and an authentic mission image library.

🌐 **Play Online:** [https://space-buddy-dusky.vercel.app/](https://space-buddy-dusky.vercel.app/)

---

## 🎮 The Main Mission: Outpost Survival (3D)

> *"Learning is easier when you have to save the crew."*

**Outpost Survival** is the core experience of SpaceBuddy. Rather than passively reading about space science, cadets are dropped directly onto the surface of the **Moon** or **Mars** to manage life support, mine resources, construct machinery, and protect a crew of 4 astronauts through **20 sols** (space days).

```
   [Mine Resources] ──> [Build Base Machines] ──> [Balance Life Support] ──> [Survive Hazards]
  (Ice, Regolith, Metal)   (Power, O2, Food, Shield)    (6 Vital Crew Gauges)     (Flares, Storms, Leaks)
```

### Vital Systems to Balance

Cadets must balance 6 interrelated life-support gauges. Every mistake teaches an authentic lesson:

| System | What It Represents | How Cadets Manage It |
|---|---|---|
| 🫧 **Oxygen** | Breathable air reserve | Run water electrolysis; fix hull breaches before air vents out |
| ⚡ **Energy** | Station power grid | Build solar panels for daylight; store power in batteries for night |
| 🍎 **Food** | Crew nutrition | Build hydroponic greenhouses and nurture crops across 8 sols |
| 💧 **Water** | Hydration & electrolysis | Mine surface water ice; run filtration and reclamation loops |
| 🌡️ **Temperature** | Habitat climate control | Balance heavy heating loads during freezing nights and cold snaps |
| 🛡️ **Radiation** | Cosmic & solar exposure | Construct regolith shields; retreat inside during solar storms |
| 🧑‍🚀 **Suit Oxygen** | EVA life support | Return to base before your spacesuit runs out of air while mining |

### Planetary Hazards
- 🌪️ **Dust Storms (Mars):** Blot out the sun and cut solar power output by 75%.
- ☢️ **Solar Flares:** Sudden bursts of high-energy radiation that force astronauts inside shelter.
- ☄️ **Meteorite Impacts:** Hull punctures that cause rapid oxygen loss until repaired.
- 🥶 **Temperature Swings & Lunar Night:** 14-day nights on the Moon that test battery reserves.
- ⚡ **Brownouts:** Power shortages that drop life support systems to emergency levels.

### Controls
- **Move:** `W` `A` `S` `D` or Arrow keys (with authentic low-gravity jumping on `Space`)
- **Camera:** Click and drag mouse to rotate view · Scroll wheel to zoom
- **Interact:** Hold `E` to mine ice/regolith, deposit minerals, and repair machines
- **Build:** Number keys `1` to `6` to construct base buildings
- **Pause:** `P`
- **Mobile:** Touch buttons and on-screen controls appear automatically on phones and tablets.

---

## 🧰 Mission Support & Training Features

To prepare cadets for commanding Outpost Survival and connect their gameplay to the real world, SpaceBuddy provides four integrated support systems:

### 1. 🎓 Pre-Flight Training Academy
Eight focused mini-simulations teach cadets the foundational physics and mission principles they need to succeed on the Outpost:
- **Zero Gravity:** Practice maneuvering and object handling in microgravity using Newton’s laws.
- **Moon Rover:** Drive across cratered terrain, managing vehicle battery and low lunar traction.
- **Rocket Builder:** Balance thrust, fuel stages, and weight to reach orbit.
- **Planet Explorer:** 3D tour comparing gravity, atmosphere, and temperatures across the Solar System.
- **Space Survival:** Quick-decision triage scenarios during spacecraft emergencies.
- **Celestial Navigation:** Learn constellation bearings and orbital rendezvous paths.
- **Mission Control:** Monitor live telemetry and respond to system warnings.
- **Printable Certificate:** Cadets earn XP and rank up from Cadet to Commander to print their graduation certificate.

### 2. 🤖 Cosmo: The AI Flight Assistant
- A friendly, onboard robot guide powered by Google Gemini (with multilingual support in **English**, **Tamil**, and **Hindi**).
- Responds directly to what is happening inside the Outpost simulation (crew health, sol count, resources).
- Includes an instant, child-safe offline fallback answering 40+ core space science questions.

### 3. 📡 Live NASA & NOAA Mission Feeds
- **Astronomy Picture of the Day:** Fresh daily cosmic imagery directly from NASA.
- **Real-Time Solar Weather:** Live GOES satellite X-ray flare data from NOAA and NASA DONKI, showing cadets the real solar storms that inspired the game’s radiation hazards.
- **Curiosity Rover Photos:** Real photos taken on the surface of Mars by NASA rovers.

### 4. 📸 NASA Junior Astronaut Photo Gallery
- A curated archive of 64 high-resolution NASA mission photos across 8 topics: Astronauts, ISS, Mars, Moon, Rovers, Solar System, Solar Weather, and Spacecraft.
- Includes complete metadata, captions, and educational sources.

---

## ▶️ Quickstart

### Play in Your Browser
Visit the live site: **[https://space-buddy-dusky.vercel.app/](https://space-buddy-dusky.vercel.app/)**

### Run Locally (Node.js 18+)

```bash
# Clone the repository
git clone https://github.com/RITTISHg/SpaceBuddy.git
cd SpaceBuddy

# Install dependencies and start
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔬 Authentic Science

SpaceBuddy models genuine aerospace engineering and planetary science principles:
- **ISRU (In-Situ Resource Utilization):** Harvesting local water ice and regolith instead of hauling all supplies from Earth.
- **Electrolysis:** Splitting water molecules into hydrogen and breathable oxygen.
- **Regolith Shielding:** Using planetary soil to protect against galactic cosmic radiation.
- **Realistic Gravity:** Low gravity physics tuned for the Moon (0.166g) and Mars (0.376g).

---

## 🔒 Privacy & Safety

- **No Accounts Required:** Progress is saved only in the player’s browser (`localStorage`).
- **Zero Tracking:** No personal data collection, cookies, or external advertisements.
- **Child-Safe:** Content is curated for kids aged 8–14 with safe AI guardrails.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

*Built by **Team ELECTRONS_07** for the NASA Space Apps Challenge 2026.* 🌌
