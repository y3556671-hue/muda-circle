import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../lib/constants/categories";

dotenv.config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    CATEGORIES.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          icon: category.icon,
        },
        create: category,
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
