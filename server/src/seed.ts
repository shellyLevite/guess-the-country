import "dotenv/config";
import prisma from "./db";
import countries from "./data/countries.json";

async function seed() {
  console.log("Seeding countries...");

  for (const country of countries) {
    await prisma.country.upsert({
      where: { name: country.name },
      update: {},
      create: {
        name: country.name,
        clue1: country.clues[0],
        clue2: country.clues[1],
        clue3: country.clues[2],
      },
    });
  }

  console.log(`Seeded ${countries.length} countries.`);
  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
