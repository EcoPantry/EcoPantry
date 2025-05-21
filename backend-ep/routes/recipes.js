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
  const { title, sourceUrl, rating } = req.body;
  const recipe = await prisma.recipe.create({
    data: { title, sourceUrl, rating },
  });
  res.json(recipe);
});

module.exports = router;
