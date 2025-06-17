import { Router } from "express";
import {
  addRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipesByName,
  getRecipesByRating,
  getSuggestedRecipes,
  getSuggestedRecipesFromInventory
} from "../controllers/recipeController";

const router = Router();

router.post("/", addRecipe);

router.get("/", getAllRecipes);
router.get("/search", searchRecipesByName);
router.get("/rating", getRecipesByRating);
router.get("/suggest", getSuggestedRecipes);
router.get("/suggest/inventory/:uid", getSuggestedRecipesFromInventory);

// Dynamic routes last
// This allows the above routes to be matched first
router.get("/:rid", getRecipeById); 
router.delete("/:rid", deleteRecipe);



export default router;