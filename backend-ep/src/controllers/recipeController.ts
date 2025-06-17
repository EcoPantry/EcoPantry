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
      ingredients, // array of { name, quantity, unit, type, category, ingQty, ingType }
      steps, // array of { stepNum, stepDesc }
      tags,
    } = req.body;

    if (
      !title ||
      !sourceUrl ||
      !timeTakenTotal ||
      !rating ||
      !servingCount ||
      !costPerServing ||
      !timeOfDay ||
      !cid ||
      !rsid
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const recipe = await prisma.recipe.create({
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
        includesSections: {
          create: [
            {
              sectionName: "Main Ingredients",
              includes: {
                create: ingredients.map((ing: any) => ({
                  ingQty: ing.ingQty,
                  ingType: ing.ingType,
                  ingredient: {
                    connectOrCreate: {
                      where: { name: ing.name },
                      create: {
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        type: ing.type,
                        category: ing.category,
                      },
                    },
                  },
                })),
              },
            },
          ],
        },
        stepsSections: {
          create: [
            {
              sectionName: "Instructions",
              steps: {
                create: steps.map((step: any) => ({
                  stepNum: step.stepNum,
                  stepDesc: step.stepDesc,
                })),
              },
            },
          ],
        },
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { tagName },
                create: { tagName },
              },
            },
          })),
        },
      },
      include: {
        includesSections: {
          include: { includes: { include: { ingredient: true } } },
        },
        stepsSections: { include: { steps: true } },
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("Error adding full recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes
export const getAllRecipes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/recipes/:rid
export const getRecipeById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const searchRecipesByName = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const getRecipesByRating = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const deleteRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
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

/**
 * Suggests recipes based on a list of ingredient names provided in the query string.
 * 
 * @route GET /api/recipes/suggest
 * 
 * @queryParam ingredients - Comma-separated list of ingredient names (e.g. "garlic,tofu")
 * @queryParam maxTime - Optional: max total cooking time in minutes
 * @queryParam minRating - Optional: minimum recipe rating (1–5)
 * @queryParam sortBy - Optional: "match" (default) or "rating"
 * 
 * @description
 * - Looks up ingredients case-insensitively
 * - Finds recipes that use at least one of the given ingredients
 * - Enriches results with match count, total ingredients, missing ingredients, and normalized rating
 * - Supports sorting by best match or highest rating
 * 
 * @example
 * GET /api/recipes/suggest?ingredients=garlic,tofu&maxTime=30&minRating=4&sortBy=rating
 * 
 * @returns JSON array of matched recipes, sorted and enriched
 * 
 * @response 200 - List of matching recipes
 * @response 400 - Missing or invalid `ingredients` query parameter
 * @response 404 - No matching ingredients found
 * @response 500 - Internal server error
 */
export const getSuggestedRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawIngredients = req.query.ingredients;
    const maxTime = req.query.maxTime
      ? parseInt(req.query.maxTime as string)
      : undefined;
    const minRating = req.query.minRating
      ? parseFloat(req.query.minRating as string)
      : undefined;
    const sortBy = (req.query.sortBy as string) || "match";

    if (!rawIngredients || typeof rawIngredients !== "string") {
      res
        .status(400)
        .json({ error: "Missing or invalid 'ingredients' query param." });
      return;
    }

    const ingredientNames = rawIngredients
      .split(",")
      .map((name) => name.trim().toLowerCase());

    // Find all matching ingredients by name
    const ingredients = await prisma.ingredient.findMany({
      where: {
        OR: ingredientNames.map((name) => ({
          name: {
            equals: name,
            mode: "insensitive",
          },
        })),
      },
      select: { iid: true, name: true },
    });

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(404).json({ error: "No matching ingredients found." });
      return;
    }

    const ingredientIds = ingredients.map((i) => i.iid);

    // Find candidate recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        timeTakenTotal: maxTime ? { lte: maxTime } : undefined,
        rating: minRating ? { gte: minRating } : undefined,
        includesSections: {
          some: {
            includes: {
              some: {
                iid: { in: ingredientIds },
              },
            },
          },
        },
      },
      include: {
        includesSections: {
          include: {
            includes: {
              include: { ingredient: true },
            },
          },
        },
        stepsSections: {
          include: { steps: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    const ranked = recipes.map((recipe) => {
      const usedIids = recipe.includesSections.flatMap((sec) =>
        sec.includes.map((inc) => inc.iid)
      );
      const matchCount = usedIids.filter((iid) =>
        ingredientIds.includes(iid)
      ).length;
      const totalIngredients = usedIids.length;
      const missingCount = totalIngredients - matchCount;
      const normalizedRating = recipe.rating / 5;

      return {
        ...recipe,
        matchCount,
        totalIngredients,
        missingCount,
        matchPercentage: Math.round((matchCount / totalIngredients) * 100),
        normalizedRating,
      };
    });

    const sorted = ranked.sort((a, b) => {
      if (sortBy === "rating") return b.normalizedRating - a.normalizedRating;
      return b.matchCount - a.matchCount;
    });

    res.status(200).json(sorted);
  } catch (err) {
    console.error("Error suggesting recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Suggests recipes based on a user's ingredient inventory.
 * 
 * @route GET /api/recipes/suggest/inventory/:uid
 * 
 * @param req.params.uid - The user ID to fetch inventory for
 * @param req.query.maxTime - Optional: max total cooking time (in minutes)
 * @param req.query.minRating - Optional: minimum rating (1–5)
 * @param req.query.sortBy - Optional: 'match' (default) or 'rating' for sorting logic
 * 
 * @returns A JSON array of recipes with:
 *  - `matchCount`: number of ingredients the user has
 *  - `normalizedRating`: recipe rating normalized to [0–1]
 * 
 * @example
 * GET /api/recipes/suggest/inventory/abcd-1234?maxTime=30&minRating=4&sortBy=rating
 * 
 * @response 200 - List of enriched recipes, sorted by match or rating
 * @response 400 - Missing user ID
 * @response 404 - No inventory or matches found
 * @response 500 - Server error
 */
export const getSuggestedRecipesFromInventory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid } = req.params;
    const maxTime = req.query.maxTime
      ? parseInt(req.query.maxTime as string)
      : undefined;
    const minRating = req.query.minRating
      ? parseFloat(req.query.minRating as string)
      : undefined;
    const sortBy = (req.query.sortBy as string) || "match"; // match | rating

    if (!uid) {
      res.status(400).json({ error: "Missing user ID" });
      return;
    }

    // Step 1: Get user’s available ingredients
    const inventoryItems = await prisma.userInventory.findMany({
      where: { uid },
      select: { iid: true },
    });

    if (inventoryItems.length === 0) {
      res.status(404).json({ error: "No ingredients in inventory" });
      return;
    }

    const userIids = inventoryItems.map((item) => item.iid);

    // Step 2: Fetch recipes matching at least one inventory ingredient
    const recipes = await prisma.recipe.findMany({
      where: {
        timeTakenTotal: maxTime ? { lte: maxTime } : undefined,
        rating: minRating ? { gte: minRating } : undefined,
        includesSections: {
          some: {
            includes: {
              some: {
                iid: {
                  in: userIids,
                },
              },
            },
          },
        },
      },
      include: {
        includesSections: {
          include: {
            includes: {
              include: {
                ingredient: true,
              },
            },
          },
        },
        stepsSections: { include: { steps: true } },
        tags: { include: { tag: true } },
      },
    });

    // Step 3: Rank by match count or normalized rating
    const enriched = recipes.map((recipe) => {
      const recipeIids = recipe.includesSections.flatMap((sec) =>
        sec.includes.map((inc) => inc.iid)
      );
      const matchCount = recipeIids.filter((iid) =>
        userIids.includes(iid)
      ).length;
      const normalizedRating = recipe.rating / 5;

      return { ...recipe, matchCount, normalizedRating };
    });

    // Step 4: Sort
    const sorted = enriched.sort((a, b) => {
      if (sortBy === "rating") return b.normalizedRating - a.normalizedRating;
      return b.matchCount - a.matchCount;
    });

    res.status(200).json(sorted);
  } catch (err) {
    console.error("Error suggesting recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
