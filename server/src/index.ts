import Fastify from "fastify";
import cors from "@fastify/cors";
import { countryRoutes } from "./routes/country";

const app = Fastify({ logger: true });

async function start() {
  // In production ALLOWED_ORIGIN is the Vercel frontend URL
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
  if (process.env.ALLOWED_ORIGIN) {
    allowedOrigins.push(process.env.ALLOWED_ORIGIN);
  }

  await app.register(cors, {
    origin: allowedOrigins,
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
