import { FastifyInstance } from "fastify";
import { Country } from "../types";
import countriesData from "../data/countries.json";

const countries: Country[] = countriesData as Country[];

// In-memory store for the current country per "session"
// For simplicity, one global current country (single-player)
let currentCountry: Country = getRandomCountry();

function getRandomCountry(): Country {
  const index = Math.floor(Math.random() * countries.length);
  return countries[index];
}

function normalizeGuess(input: string): string {
  return input.trim().toLowerCase();
}

export async function countryRoutes(app: FastifyInstance) {
  // GET /api/country — returns a new random country's clues (no name revealed)
  app.get("/api/country", async (_request, reply) => {
    currentCountry = getRandomCountry();
    return reply.send({
      clues: currentCountry.clues,
    });
  });

  // POST /api/guess — validates the user's guess
  app.post<{
    Body: { guess: string };
  }>("/api/guess", async (request, reply) => {
    const { guess } = request.body;

    if (!guess || typeof guess !== "string") {
      return reply.status(400).send({ error: "A guess is required." });
    }

    const normalizedGuess = normalizeGuess(guess);
    const normalizedAnswer = normalizeGuess(currentCountry.name);
    const correct = normalizedGuess === normalizedAnswer;

    return reply.send({
      correct,
      answer: currentCountry.name,
    });
  });
}
