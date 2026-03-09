import Fastify from "fastify";
import cors from "@fastify/cors";
import { countryRoutes } from "./routes/country";

const app = Fastify({ logger: true });

async function start() {
  // Register CORS so the Vite dev server can reach the API
  await app.register(cors, {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  });

  // Register routes
  await app.register(countryRoutes);

  const port = Number(process.env.PORT) || 3000;
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server running at http://localhost:${port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
