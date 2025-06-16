import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /api/recipes
export const addRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      sourceUrl,
      timeTakenTotal,
      rating,
      servingCount,
      costPerServing,
      timeOfDay,
      cid,
      rsid,
    } = req.body;

    if (
      !title || !sourceUrl || !timeTakenTotal || !rating ||
      !servingCount || !costPerServing || !timeOfDay || !cid || !rsid
    ) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        sourceUrl,
        timeTakenTotal,
        rating,
        servingCount,
        costPerServing,
        timeOfDay,
        cid,
        rsid,
      },
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes
export const getAllRecipes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes/:rid
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rid } = req.params;

    const recipe = await prisma.recipe.findUnique({ where: { rid } });
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes/search?name=chicken
export const searchRecipesByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;

    if (typeof name !== "string") {
      res.status(400).json({ error: "Invalid name parameter" });
      return;
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        title: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error searching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes/rating?min=4
export const getRecipesByRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const minRating = parseInt(req.query.min as string);

    if (isNaN(minRating)) {
      res.status(400).json({ error: "Invalid min rating" });
      return;
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        rating: {
          gte: minRating,
        },
      },
    });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error filtering recipes by rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/recipes/:rid
export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rid } = req.params;

    const recipe = await prisma.recipe.findUnique({ where: { rid } });
    if (!recipe) res.status(404).json({ error: "Recipe not found" });

    await prisma.recipe.delete({ where: { rid } });

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
