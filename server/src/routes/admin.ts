import { FastifyInstance } from "fastify";
import prisma from "../db";

export async function adminRoutes(app: FastifyInstance) {
  // GET all countries
  app.get("/api/admin/countries", async (_request, reply) => {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    return reply.send(countries);
  });

  // POST — add a new country
  app.post<{
    Body: { name: string; clue1: string; clue2: string; clue3: string };
  }>("/api/admin/countries", async (request, reply) => {
    const { name, clue1, clue2, clue3 } = request.body;

    if (!name || !clue1 || !clue2 || !clue3) {
      return reply.status(400).send({ error: "All fields are required." });
    }

    try {
      const country = await prisma.country.create({
        data: { name, clue1, clue2, clue3 },
      });
      return reply.status(201).send(country);
    } catch {
      return reply.status(409).send({ error: "Country already exists." });
    }
  });

  // PUT — update a country's name and clues
  app.put<{
    Params: { id: string };
    Body: { name: string; clue1: string; clue2: string; clue3: string };
  }>("/api/admin/countries/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    const { name, clue1, clue2, clue3 } = request.body;

    if (!name || !clue1 || !clue2 || !clue3) {
      return reply.status(400).send({ error: "All fields are required." });
    }

    const country = await prisma.country.update({
      where: { id },
      data: { name, clue1, clue2, clue3 },
    });
    return reply.send(country);
  });

  // DELETE — remove a country
  app.delete<{
    Params: { id: string };
  }>("/api/admin/countries/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    await prisma.country.delete({ where: { id } });
    return reply.status(204).send();
  });
}
