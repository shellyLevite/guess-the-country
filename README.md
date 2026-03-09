# 🌍 Guess The Country

A web application where users try to guess a country based on three clues, with a built-in management panel for adding, editing and deleting countries.

🔗 **Live app:** https://guess-the-country-sooty.vercel.app/

## How It Works

- The app displays **three clues** about a mystery country
- The user types their guess and submits it
- The app responds with **Correct!** or shows the right answer
- Click **Play Again** to get a new random country
- Switch to the **⚙️ Manage** tab to add, edit or delete countries

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | [Fastify](https://fastify.dev/) v5 + TypeScript |
| Frontend | [React](https://react.dev/) 18 + [Vite](https://vitejs.dev/) 7 + TypeScript |
| Database | PostgreSQL (hosted on [Render](https://render.com/)) |
| ORM | [Prisma](https://www.prisma.io/) 7 with `@prisma/adapter-pg` |
| Deployment | Backend → Render, Frontend → Vercel |

## Project Structure

```
Project44/
├── server/                      # Fastify backend
│   ├── src/
│   │   ├── index.ts             # Server entry point + CORS
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── seed.ts              # DB seeder (10 countries)
│   │   ├── types.ts             # Shared TypeScript types
│   │   ├── routes/
│   │   │   ├── country.ts       # GET /api/country, POST /api/guess
│   │   │   └── admin.ts         # CRUD /api/admin/countries
│   │   └── data/
│   │       └── countries.json   # Source data for seeding
│   ├── prisma/
│   │   ├── schema.prisma        # Country model
│   │   └── migrations/          # SQL migration files
│   ├── prisma.config.ts         # Prisma 7 config
│   ├── package.json
│   └── tsconfig.json
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx              # App shell with tab switching
│   │   ├── App.css              # Dark glassmorphism styles
│   │   ├── api.ts               # Centralized API URL constants
│   │   └── components/
│   │       ├── ClueCard.tsx     # Displays the 3 clues
│   │       ├── GuessForm.tsx    # Guess input + submit
│   │       └── Management.tsx   # Country CRUD management UI
│   ├── vite.config.ts           # Proxies /api → backend (dev)
│   └── vercel.json              # Vercel deployment config
├── render.yaml                  # Render deployment config
├── .gitignore
├── README.md
└── AI_USAGE.md
```

## Requirements

- [Node.js](https://nodejs.org/) v18+
- A PostgreSQL database (set `DATABASE_URL` in `server/.env`)

## Installation & Running Locally

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@host/dbname"
```

### 3. Run DB migrations & seed

```bash
cd server
npx prisma migrate deploy
npm run seed
```

### 4. Start the backend

```bash
cd server
npm run dev
```

API available at `http://localhost:3000`

### 5. Start the frontend (separate terminal)

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

### Game

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/country` | Returns 3 clues for a random country |
| `POST` | `/api/guess` | `{ guess: string }` → `{ correct: boolean, answer: string }` |

### Admin (Management tab)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/countries` | List all countries |
| `POST` | `/api/admin/countries` | Add a new country |
| `PUT` | `/api/admin/countries/:id` | Update name and clues |
| `DELETE` | `/api/admin/countries/:id` | Delete a country |

## Deployment

- **Backend** is deployed to [Render](https://render.com/) as a web service (root dir: `server/`)
- **Frontend** is deployed to [Vercel](https://vercel.com/) (root dir: `client/`)
- Render build command runs `prisma generate && prisma migrate deploy` automatically
- Required environment variables:
  - Render: `DATABASE_URL`, `ALLOWED_ORIGIN`
  - Vercel: `VITE_API_URL`
