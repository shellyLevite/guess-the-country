import { FastifyInstance } from "fastify";
import prisma from "../db";

type CountryBody = {
  name: string;
  clue1: string;
  clue2: string;
  clue3: string;
};

/** Parses a route param as an integer; returns null if the value is not a valid number. */
function parseId(raw: string): number | null {
  const id = parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

/** Validates that all country fields are present and non-blank. Returns an error message or null. */
function validateBody({ name, clue1, clue2, clue3 }: CountryBody): string | null {
  if (!name?.trim() || !clue1?.trim() || !clue2?.trim() || !clue3?.trim()) {
    return "All fields are required and must not be empty.";
  }
  return null;
}

export async function adminRoutes(app: FastifyInstance) {
  // GET /api/admin/countries — list all countries sorted alphabetically
  app.get("/api/admin/countries", async (_request, reply) => {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    return reply.send(countries);
  });

  // POST /api/admin/countries — create a new country
  app.post<{ Body: CountryBody }>("/api/admin/countries", async (request, reply) => {
    const validationError = validateBody(request.body);
    if (validationError) {
      return reply.status(400).send({ error: validationError });
    }

    const { name, clue1, clue2, clue3 } = request.body;
    try {
      const country = await prisma.country.create({
        data: {
          name: name.trim(),
          clue1: clue1.trim(),
          clue2: clue2.trim(),
          clue3: clue3.trim(),
        },
      });
      return reply.status(201).send(country);
    } catch {
      return reply.status(409).send({ error: "A country with that name already exists." });
    }
  });

  // PUT /api/admin/countries/:id — update an existing country's name and clues
  app.put<{ Params: { id: string }; Body: CountryBody }>(
    "/api/admin/countries/:id",
    async (request, reply) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid country ID." });
      }

      const validationError = validateBody(request.body);
      if (validationError) {
        return reply.status(400).send({ error: validationError });
      }

      const { name, clue1, clue2, clue3 } = request.body;
      try {
        const country = await prisma.country.update({
          where: { id },
          data: {
            name: name.trim(),
            clue1: clue1.trim(),
            clue2: clue2.trim(),
            clue3: clue3.trim(),
          },
        });
        return reply.send(country);
      } catch {
        return reply.status(404).send({ error: "Country not found." });
      }
    }
  );

  // DELETE /api/admin/countries/:id — remove a country from the database
  app.delete<{ Params: { id: string } }>(
    "/api/admin/countries/:id",
    async (request, reply) => {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid country ID." });
      }

      try {
        await prisma.country.delete({ where: { id } });
        return reply.status(204).send();
      } catch {
        return reply.status(404).send({ error: "Country not found." });
      }
    }
  );
}
