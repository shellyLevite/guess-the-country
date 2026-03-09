# 🌍 Guess The Country

A small web application where users try to guess a country based on three clues.

## How It Works

- The app displays **three clues** about a mystery country
- The user types their guess and submits it
- The app responds with **Correct!** or **Wrong. The correct answer is X.**
- Click **New Game** to play again with a different country

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | [Fastify](https://fastify.dev/) + TypeScript |
| Frontend | [React](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript |
| Data | Hardcoded JSON (10 countries) |

## Project Structure

```
Project44/
├── server/               # Fastify backend
│   ├── src/
│   │   ├── index.ts      # Server entry point
│   │   ├── types.ts      # Shared types
│   │   ├── routes/
│   │   │   └── country.ts  # GET /api/country, POST /api/guess
│   │   └── data/
│   │       └── countries.json
│   ├── package.json
│   └── tsconfig.json
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ClueCard.tsx
│   │   │   └── GuessForm.tsx
│   │   └── main.tsx
│   └── vite.config.ts    # Proxies /api → backend
├── .gitignore
├── README.md
└── AI_USAGE.md
```

## Requirements

- [Node.js](https://nodejs.org/) v18+

## Installation & Running

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Start the backend

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:3000`

### 3. Start the frontend (in a separate terminal)

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/country` | Returns 3 clues for a new random country |
| `POST` | `/api/guess` | Accepts `{ guess: string }`, returns `{ correct: boolean, answer: string }` |
