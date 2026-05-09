import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants/categories";

export async function seedCategories() {
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

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });
}
