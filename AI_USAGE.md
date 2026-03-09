# AI Usage

## Tools Used

- **GitHub Copilot** (Claude Sonnet 4.6) via VS Code

---

## Development Process

### Phase 1 — Planning & Tech Stack Decision

**What I asked for:**
Described the project concept — a country-guessing game with clues — and asked for a step-by-step implementation plan with tech stack options.

**What AI did:**
Proposed several options for the backend framework (Express, Hono, Fastify) and frontend approach, and outlined a phased build plan with folder structure, API design, and commit strategy.

**What I decided:**
- Chose **Fastify** over Express because of its performance and schema-based validation
- Chose **React + Vite** for the frontend instead of plain HTML for better component structure
- Approved the step-by-step commit strategy

---

### Phase 2 — Project Setup & Backend Scaffold

**What I asked for:**
Initialize the git repo, set up the Fastify + TypeScript backend, and create the country dataset.

**What AI did:**
- Created `server/package.json`, `tsconfig.json`, `.gitignore`
- Set up Node.js (installed it via `winget` since it wasn't present)
- Generated `server/src/data/countries.json` with 10 countries, each with 3 clues
- Created the Fastify server entry point with CORS and the initial game routes
- Made the first git commit

**What I modified:**
- Reviewed the 10 countries and their clues, keeping the ones I found appropriate

---

### Phase 3 — Game Logic & API Routes

**What I asked for:**
Add the `GET /api/country` and `POST /api/guess` routes with proper guess validation.

**What AI did:**
- Created `server/src/routes/country.ts` with random country selection, in-memory session state, and answer normalization (trim, lowercase, accent stripping)
- Created `server/src/types.ts` for the `Country` TypeScript interface

**What I decided:**
- Kept the normalization approach (the guess comparison ignores case and whitespace)

---

### Phase 4 — React + Vite Frontend

**What I asked for:**
Scaffold the frontend with a ClueCard component and a GuessForm, connected to the backend via Vite proxy.

**What AI did:**
- Scaffolded the Vite React TypeScript app
- Created `ClueCard.tsx`, `GuessForm.tsx`, `App.tsx`, and the initial `App.css`
- Configured `vite.config.ts` to proxy `/api` requests to `localhost:3000` in development

**What I modified:**
- Adjusted the initial styling to better match the visual direction I had in mind

---

### Phase 5 — Deployment to Render + Vercel

**What I asked for:**
Set up deployment for the backend on Render and the frontend on Vercel.

**What AI did:**
- Created `render.yaml` for the Render web service
- Created `client/vercel.json` with Vite build settings
- Created `client/src/api.ts` to support a `VITE_API_URL` environment variable for production
- Updated CORS to read the allowed origin from an `ALLOWED_ORIGIN` env var
- Debugged and fixed build failures: added `--include=dev` to Render's install command, fixed a TypeScript `verbatimModuleSyntax` error on Vercel requiring `import type`

**What I configured manually:**
- Set `ALLOWED_ORIGIN` in the Render web service environment dashboard
- Set `VITE_API_URL` in the Vercel project settings

---

### Phase 6 — UI Redesign

**What I asked for:**
Complete UI overhaul: modern dark design, no scrolling after a guess, restore the globe emoji in the title, and change the favicon to a globe.

**What AI did:**
- Rewrote `App.css` with a dark glassmorphism card, gradient title text, and animated result banners
- Set `height: 100vh; overflow: hidden` on the page wrapper to eliminate scrolling
- Restored the globe emoji (🌍) with gradient styling only on the text part via a `.title-gradient` span
- Updated `client/index.html` with an inline SVG globe favicon and changed the tab title to "Guess The Country"

**What I modified:**
- Directed specific design choices: the card size, the color palette (purple-blue gradient), and keeping the layout compact enough to never scroll
- Requested numbered badge style for the clue list instead of plain bullets

---

### Phase 7 — PostgreSQL Integration via Prisma

**What I asked for:**
Replace in-memory country storage with a real PostgreSQL database. Specifically asked to use an ORM rather than raw SQL queries.

**What AI did:**
- Installed Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, `pg`, and `dotenv`
- Defined the `Country` model in `prisma/schema.prisma`
- Created `server/src/db.ts` — Prisma client singleton using the `PrismaPg` connection pool adapter
- Created `server/src/seed.ts` to seed all 10 countries via `prisma.country.upsert`
- Rewrote `country.ts` to query from the DB using `prisma.country.findFirst` with a random skip
- Created the initial SQL migration (resolved a PowerShell UTF-8 BOM encoding issue along the way)
- Updated `render.yaml` to run `prisma generate && prisma migrate deploy` and the seed script on each deploy
- Fixed `prisma.config.ts` to validate `DATABASE_URL` at startup

**What I configured manually:**
- Created the PostgreSQL database via Render's dashboard
- Added `DATABASE_URL` to the Render web service environment variables

---

### Phase 8 — Management Tab (Country CRUD)

**What I asked for:**
Add a second tab to the app — a management panel where all countries in the database can be viewed, added, edited, and deleted.

**What AI did:**
- Created `server/src/routes/admin.ts` — full CRUD: `GET`, `POST`, `PUT`, `DELETE` on `/api/admin/countries`
- Updated `server/src/index.ts` to register the admin routes and extend CORS to allow `PUT` and `DELETE`
- Updated `client/src/api.ts` with the `adminCountries` endpoint URL
- Created `client/src/components/Management.tsx` — management UI with a country list, inline edit form per row, add-country form, and delete confirmation
- Updated `client/src/App.tsx` with `activeTab` state, a tab bar (🎮 Game / ⚙️ Manage), and conditional rendering
- Updated `client/src/App.css` with tab bar styles, management list/form styles, and a `page--manage` class for scrollable layout in the management view

**What I decided:**
- Wanted inline editing per row rather than a separate edit page
- Chose to keep the management tab in the same app shell as the game (tabs) rather than a separate route

---

## AI Configuration

A `.claude.md` file was included in the repository to guide GitHub Copilot's behavior throughout development.

### Rules set:
- Always use TypeScript (no plain JS)
- Use Fastify for the backend, React + Vite for the frontend
- Keep components small and focused
- Use `async/await`, never callbacks
- Commit after each logical step with a meaningful message

### How it helped:
The configuration kept code style consistent across all files and phases, prevented framework drift, and enforced the same patterns for error handling, response shapes, and TypeScript generics from start to finish.
