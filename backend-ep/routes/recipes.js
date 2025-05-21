const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all recipes
router.get('/', async (req, res) => {
  const recipes = await prisma.recipe.findMany();
  res.json(recipes);
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

// POST a new recipe
router.post('/', async (req, res) => {
  const { title, sourceUrl, rating } = req.body;
  const recipe = await prisma.recipe.create({
    data: { title, sourceUrl, rating },
  });
  res.json(recipe);
});

module.exports = router;
