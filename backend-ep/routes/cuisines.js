// routes/cuisines.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET all cuisines
router.get('/', async (req, res) => {
  try {
    const cuisines = await prisma.cuisine.findMany({
      include: {
        recipes: true, // Optional: include related recipes
      },
    });
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET a single cuisine by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cuisine = await prisma.cuisine.findUnique({
      where: { cid: Number(id) },
      include: { recipes: true },
    });

    if (!cuisine) {
      return res.status(404).json({ error: 'Cuisine not found' });
    }

    res.json(cuisine);
  } catch (error) {
    console.error('Error fetching cuisine:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new cuisine
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const cuisine = await prisma.cuisine.create({
      data: { name },
    });

    res.status(201).json(cuisine);
  } catch (error) {
    console.error('Error creating cuisine:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
