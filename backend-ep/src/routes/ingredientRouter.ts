import { Router } from "express";
import {
  createIngredient,
  listUserIngredients,
  updateUserIngredient,
  deleteUserIngredient
} from "../controllers/ingredientController";

const router = Router();

router.post("/", createIngredient);
router.get("/:uid", listUserIngredients);
router.put("/:uid/:iid", updateUserIngredient);
router.delete("/:uid/:iid", deleteUserIngredient);

export default router;
