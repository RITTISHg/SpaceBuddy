# Backend API

Zero-dependency Node.js server (`backend/server.js`, Node 18 or newer). Start it with `npm start` (or `npm run server` during development). It also serves the built frontend (`dist/`, or `src/` if you have not built), so one deployment can host the whole app.

| Method and path | Purpose | Notes |
|---|---|---|
| `GET /api/health` | Status | `{ok, ai, nasaKey}`; never returns keys |
| `GET /api/nasa/apod` | Astronomy Picture of the Day | Cached 1 h; only `https://` image URLs are passed on |
| `GET /api/nasa/donki` | Last 5 solar flares (30 days) | NASA DONKI; cached 30 min |
| `GET /api/nasa/mars` | 4 latest Curiosity photos | Photo URLs upgraded to https; unsafe URLs dropped |
| `POST /api/progress` | Save progress `{id, name, xp, done[]}` | `id` 8 to 64 chars `[A-Za-z0-9-]`; name sanitised to 16 letters, digits, spaces; unknown missions ignored; XP capped at 150 per completed mission |
| `GET /api/progress?id=` | Load saved progress | 404 if unknown |
| `GET /api/leaderboard` | Top 10 by XP | name, xp, stars only |
| `POST /api/cosmo` | Ask Cosmo `{q, lang, ctx}` | Uses Gemini when `GEMINI_API_KEY` is set; otherwise returns `{answer:null, source:"fallback"}` and the browser answers locally |

## Security and privacy

- API keys live only in server environment variables (`.env` is git-ignored). The browser never sees them.
- Limits: 120 requests/min per client overall, 30 progress saves/min, 10 Cosmo questions/min; request bodies are capped at 10 KB (4 KB for Cosmo).
- Players are anonymous: a random id stored in the browser, a preset display name, XP and completed missions. No email, no accounts, no tracking.
- The leaderboard cannot be made cheat-proof in a client-side game; the server only checks that scores are plausible.
- Data is stored in `backend/data.json`. On free hosting with an ephemeral disk this resets on redeploy; use a hosted database if you need permanence.

## Configuration

See `.env.example`. For a separate frontend host, set `<meta name="api-base" content="https://your-backend">` in `src/index.html` and set `CORS_ORIGIN` on the server to your frontend URL.
