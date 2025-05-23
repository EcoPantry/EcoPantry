// scripts/cuisine.js
// Create a new cuisine entry in the database using Prisma


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cuisine = await prisma.cuisine.create({
    data: {
      name: 'Japanese' // Change this to whatever cuisine you want
    },
  });

  console.log('Cuisine created:', cuisine);
}

main()
  .catch((e) => {
    console.error('rror creating cuisine:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
