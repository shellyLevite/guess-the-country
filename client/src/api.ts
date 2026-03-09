// In dev, VITE_API_URL is empty — Vite proxy forwards /api → localhost:3000
// In production, VITE_API_URL is set to the Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const API = {
  country: `${BASE_URL}/api/country`,
  guess: `${BASE_URL}/api/guess`,
};
