const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const recipesRouter = require('./routes/recipes');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipesRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
