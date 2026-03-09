# AI Usage

## Tools Used

- **GitHub Copilot** (Claude Sonnet 4.6) via VS Code

---

## Development Process

### Prompt 1 — Project Planning
**Prompt given:**
> "Build a small application where users try to guess a country based on clues. Plan the implementation in steps."

**What AI did:**
Generated the full step-by-step plan including tech stack options, folder structure, commit strategy, and API design.

**What I decided:**
Chose Fastify over Express (AI presented alternatives), and React + Vite over plain HTML for the frontend.

---

### Prompt 2 — Project Setup
**Prompt given:**
> "Step 1 - initialize git, create folder structure, set up Fastify + TypeScript"

**What AI did:**
- Created `server/package.json` with Fastify and TypeScript dependencies
- Created `server/tsconfig.json`
- Created `.gitignore`
- Installed Node.js via `winget` (it was not installed)
- Ran `npm install` and made the initial git commit

**What I modified:**
Nothing — accepted as generated.

---

### Prompt 3 — Country Dataset
**Prompt given:**
> "Add the country dataset"

**What AI did:**
Generated `server/src/data/countries.json` with 10 countries, each having a name and 3 clues.

**What I modified:**
Nothing — accepted as generated.

---

### Prompt 4 — Fastify Server + Guess Validation
**Prompt given:**
> "Add Fastify server with GET /api/country and POST /api/guess routes, with guess validation logic"

**What AI did:**
- Created `server/src/index.ts` — Fastify app with CORS registered
- Created `server/src/routes/country.ts` — random country selection, in-memory state, normalization logic
- Created `server/src/types.ts` — TypeScript `Country` interface

**What I modified:**
Nothing — accepted as generated.

---

### Prompt 5 — React + Vite Frontend
**Prompt given:**
> "Add React + Vite frontend with ClueCard and GuessForm components, connect to the backend API via Vite proxy"

**What AI did:**
- Scaffolded the Vite React TypeScript app
- Created `client/src/components/ClueCard.tsx`
- Created `client/src/components/GuessForm.tsx`
- Rewrote `client/src/App.tsx` with game state logic (`loading`, `playing`, `correct`, `wrong`)
- Rewrote `client/src/App.css` with clean dark-theme styling
- Configured `vite.config.ts` to proxy `/api` to `localhost:3000`

**What I modified:**
Nothing — accepted as generated.

---

## AI Configuration

A `.claude.md` file was included in the repository to guide GitHub Copilot's behavior during development.

### Rules set:
- Always use TypeScript (no plain JS)
- Use Fastify for the backend, React + Vite for the frontend
- Keep components small and focused
- Use `async/await`, never callbacks
- Commit after each logical step with a meaningful message

### How it helped:
The configuration ensured consistent code style across all generated files and prevented the AI from suggesting plain JavaScript or switching frameworks mid-project.
