import { FastifyInstance } from "fastify";
import prisma from "../db";
import type { Country } from "../generated/prisma/client";

// In-memory store for the current country (single-player)
let currentCountry: Country | null = null;

function normalizeGuess(input: string): string {
  return input.trim().toLowerCase();
}

export async function countryRoutes(app: FastifyInstance) {
  // GET /api/country — picks a random country from DB and returns its clues
  app.get("/api/country", async (_request, reply) => {
    const count = await prisma.country.count();

    if (count === 0) {
      return reply.status(503).send({ error: "No countries in database." });
    }

    const skip = Math.floor(Math.random() * count);
    currentCountry = await prisma.country.findFirst({ skip });

    return reply.send({
      clues: [currentCountry!.clue1, currentCountry!.clue2, currentCountry!.clue3],
    });
  });

  // POST /api/guess — validates the user's guess against the current country
  app.post<{
    Body: { guess: string };
  }>("/api/guess", async (request, reply) => {
    const { guess } = request.body;

    if (!guess || typeof guess !== "string") {
      return reply.status(400).send({ error: "A guess is required." });
    }

    if (!currentCountry) {
      return reply.status(400).send({ error: "No active country. Start a new game first." });
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
