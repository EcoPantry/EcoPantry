const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all recipes
router.get('/', async (req, res) => {
  const recipes = await prisma.recipe.findMany();
  res.json(recipes);
});

// POST a new recipe
router.post('/', async (req, res) => {
  const {
    title,
    sourceUrl,
    timeTakenTotal,
    rating,
    servingCount,
    costPerServing,
    cid,
    timeOfDay,
    rsid
  } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        source_url: sourceUrl,
        time_taken_total: timeTakenTotal,
        rating,
        serving_count: servingCount,
        cost_per_serving: costPerServing,
        cid,
        time_of_day: timeOfDay,
        rsid
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET a single recipe by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
  });
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

module.exports = router;
