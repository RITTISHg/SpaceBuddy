# Simulation Documentation

This document describes the mathematical model behind the **Outpost Survival** station (`step()`, `flows()`, `preview()` and the event table in `src/index.html`).

> **Honesty note.** The model is a transparent, rule-based *teaching* model. Its structure (generation, storage, life support, radiation, crops) follows the NASA references in the README, but the numeric constants are simplified game values chosen for balance. They are **not** mission-accurate NASA figures.

## 1. Time step and mission length

| Item | Value |
|---|---|
| One turn | 1 mission day ("sol") |
| Mission length | `DUR = 20` sols |
| Crew | 4 |
| Build points (BP) | start 60, +8 per sol |

## 2. State variables

| Symbol | Meaning | Start | Unit |
|---|---|---|---|
| `bat` | battery energy | 40 | kWh |
| `o2` | oxygen reserve | 40 | kg |
| `water` | clean water | 100 | L |
| `food` | stored food | 38 | kg |
| `rad` | accumulated radiation dose | 0 | mSv (game scale) |
| `health` | crew health | 100 | % |
| `crop` | greenhouse growth progress | 0 | sols |
| `b.solar / bat / ls / gh / shield` | buildings | Moon 3/1/1/0/0, Mars 4/1/1/0/0 | count |

Gauge scales: oxygen 120 kg, water 150 L, food 60 kg, battery = `bat / (60 × batteries)`, radiation limit 45 mSv.

## 3. Environment

| Parameter | Moon | Mars |
|---|---|---|
| Sunlight factor `sun` | 1.0 on sols where `(day-1) mod 14 < 10`, otherwise **0.1** (lunar night) | 0.65 |
| Extra heating load | 0 kWh | 5 kWh |
| Background radiation `bg` | 0.5 mSv/sol | 0.3 mSv/sol |
| Dust/storm event | Dust on panels (sol 17) | Dust storm (sol 5), dust (sol 16) |

During a storm (`storm > 0`) sunlight is multiplied by 0.25.

## 4. Equations (per sol)

**Power** (energy per sol, so "kW × 1 day ≈ kWh" is simplified into kWh/sol)

```
sun   = env_sun(day) × (storm > 0 ? 0.25 : 1)
gen   = solar × 18 × sun × (1 − dust) + (backup_on and fuel > 0 ? 15 : 0)
dem   = 20 + 15 × ls + heat + 10 × eload + gh × (5 + 7 × light) + 8 × medbay
e     = bat + gen − dem
brown = (e < 0);  if brown: e = 0
bat'  = min(e, 60 × batteries)
```
`eload` (extra equipment) and `light` (greenhouse lighting) are player sliders in 0–1. A battery stores 60 kWh. Energy (kWh, stored) and power (rate) are kept separate in the explanations shown to the player.

**Power shortage consequence**

```
pf = brown ? 0.4 : 1          # life support runs at 40 % in a brownout
ls_eff = lsBroken ? 0 : pf
```

**Water**

```
wu  = crew × 3.5 × wuse                  # wuse in 0.6–1.0 (rationing)
gu  = (gh > 0 and not brown) ? gh × 6 : 0
rec = (wu + gu) × 0.85 × ls_eff × min(1, ls)
water' = clamp(water + rec − wu − gu, 0, 600)
```
Water recycling recovers up to 85 % of use when life support is powered and working.

**Oxygen** (depends on water through electrolysis)

```
og  = ls × 4.2 × ls_eff × (water > 5 ? 1 : 0.5)
o2' = clamp(o2 + og − crew × 0.84, 0, 200)
```

**Food and crops**

```
if gh > 0 and not brown and water > 0: crop += 1
if crop ≥ 8: food += gh × 14; crop = 0     # harvest after 8 sols
food' = max(0, food − crew × 0.62)
```
The greenhouse is *not* modelled as an air-revitalisation system (consistent with the accuracy note in the project brief).

**Radiation** (an exposure model, not a consumable stock)

```
rad += bg × (1 − 0.25 × min(shield, 3))          # persistent background
solar storm dose (event only):
  shelter  : +1.5
  wait     : +8  × (1 − 0.35 × min(shield, 2))
  continue : +22 × (1 − 0.35 × min(shield, 2))   # and +6 BP
```

**Crew health and morale** (health can now recover)

```
Δ = 0
brown          → −4
o2 < crew × 3  → −15
water ≤ 0      → −10
food ≤ 0       → −10
rad > 45       → −5   else   rad > 29.7 → −2
medbay > 0 and not brown and health < 100 → +3     # Medical Bay (uses 8 kWh)
morale:  if food > 10 and water > 20 and not brown: morale = min(100, morale + 2)
         else:                                       morale = max(10,  morale − 5)
morale > 70    → +1                                 # rested, motivated crew
health' = clamp(health + Δ, 0, 100)
```
Morale starts at 70 and is also changed by some decisions (for example rationing water costs 10 morale, studying a rock sample gives +15).

## 5. Win / fail rules

- **Fail:** `health ≤ 30` or `o2 ≤ 0`.
- **Win:** the crew survives through sol 20.
- **Score:** `6 × health + min(BP, 60) + 5 × sols survived + 20 × correct quiz answers + morale`.

## 6. System dependencies

```
Solar + Battery ──► Power balance ──► (brownout?) ──► Life support 40 %
                                              │               │
                                              ▼               ├─► Water recovery ↓ ─► Water ↓ ─► Oxygen ↓ (if water ≤ 5)
                                       Greenhouse pauses      └─► Oxygen generation ↓
                                              │
                                              ▼
                                       Food harvest delayed ─► Food ↓
Radiation shield + shelter ──► Dose ↓ ──► Crew health
Brownout, low O₂/water/food, high dose ──► Crew health ↓ ──► Mission fail
```

The chain "less power → battery drains → life support curtailed → less water → less oxygen / crops → less food" from the project brief is therefore explicit in the equations.

## 7. Events

| Sol (Moon / Mars) | Event | Choices and effects |
|---|---|---|
| 6 / 8 | Solar storm | Shelter (+1.5 mSv, −4 BP); wait inside (+8×shield factor); continue (+22×shield factor, +6 BP) |
| 10 / 5 | Lunar night / Mars dust storm | Dim lights (`light = 0.2`); shed extras (`eload = 0`); backup generator (+15 kWh/sol, 3 fuel); do nothing. Storm sets `storm = 4`; night sunlight is 0.1 on sols 11–14 |
| 15 / 13 | Water unit failure | `lsBroken = true` (recycling 0). Repair (−5 BP); ration (`wuse = 0.8`); emergency tank (+60 L); do nothing |
| 17 / 16 | Dust on panels | `dust = 0.3`. Clean (−3 BP) or ignore |

### 7b. Random events

After every sol, if no scheduled event is waiting, each random event below rolls its own probability in list order and the first success is offered to the player. The chance that *some* random event appears in a given sol is about 37 %. The generator is a seeded PRNG (mulberry32) created per mission, so a mission can be replayed in tests. Random events never appear in the Overview preview.

| Event | Prob. | Choice A | Choice B |
|---|---|---|---|
| Micrometeorite impact | 8 % | Patch hull (−4 BP) | Temporary sealant (−5 health) |
| Equipment glitch | 9 % | Full reboot (−6 BP) | Manual override (lose 1 solar array) |
| Interesting rock sample | 12 % | Study it (−10 kWh, +15 morale, +2 health) | Store it (−5 morale) |
| Supply cache found | 8 % | Retrieve (−6 BP; +12 food, +25 water, +10 O₂) | Mark for later (nothing) |
| Communication blackout | 7 % | Boost antenna (−15 kWh, +3 BP) | Wait it out (−3 BP) |

## 8. Build costs

Solar array 10 BP (+18 kWh at full sun), battery 12 BP (+60 kWh storage), life support 20 BP, greenhouse 25 BP (14 kg food per 8 sols, 6 L water/sol, 5–12 kWh/sol), radiation shield 18 BP (−25 % background each, max 3), **medical bay 22 BP** (+3 health per sol while powered and health < 100; uses 8 kWh per sol).

## 9. Assumptions and limitations

1. 1 sol is a simplified mission day; the lunar day/night cycle is compressed to a 14-sol cycle (10 light, 4 dark).
2. Constants (e.g. 0.84 kg O₂ and 3.5 L water per person per sol) are simplified teaching values.
3. Radiation uses a game "mSv" scale with a 45 mSv mission threshold; it is not a medical dose limit.
4. Health is a single explained indicator driven by the listed causes. It can recover through the medical bay and good morale, but it cannot exceed 100.
5. Four events are scheduled (deterministic) and five more are random with seeded probabilities, so missions are both teachable and replayable.
6. The model contains no machine learning; every outcome can be traced to the equations above.
