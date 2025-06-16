import { Router } from "express";
import {
  addRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipesByName,
  getRecipesByRating
} from "../controllers/recipeController";

const router = Router();

router.post("/", addRecipe);
router.delete("/:rid", deleteRecipe);
router.get("/", getAllRecipes);
router.get("/search", searchRecipesByName);
router.get("/rating", getRecipesByRating);
router.get("/:rid", getRecipeById); // Keep this after specific routes

export default router;