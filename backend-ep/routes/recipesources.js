const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all recipe sources
router.get('/', async (req, res) => {
  try {
    const recipeSources = await prisma.recipeSource.findMany({
      include: { recipes: true }, // Optional: include related recipes
    });
    res.json(recipeSources);
  } catch (error) {
    console.error('Error fetching recipe sources:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET a single recipe source by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipeSource = await prisma.recipeSource.findUnique({
      where: { rsid: Number(id) },
      include: { recipes: true },
    });

    if (!recipeSource) {
      return res.status(404).json({ error: 'Recipe source not found' });
    }

    res.json(recipeSource);
  } catch (error) {
    console.error('Error fetching recipe source:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new recipe source
router.post('/', async (req, res) => {
  const { source_name } = req.body;

  try {
    const recipeSource = await prisma.recipeSource.create({
      data: { source_name },
    });

    res.status(201).json(recipeSource);
  } catch (error) {
    console.error('Error creating recipe source:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
