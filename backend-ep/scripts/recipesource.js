// scripts/srecipesource.js
// Create a new recipe source entry in the database using Prisma

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const source = await prisma.recipeSource.create({
    data: {
      source_name: 'Sample Blog' // Customize the source name
    },
  });

  console.log('✅ Recipe source created:', source);
}

main()
  .catch((e) => {
    console.error('❌ Error creating recipe source:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
