import { Router } from "express";
import {
  createIngredient,
} from "../controllers/ingredientController";

const router = Router();

router.post("/", createIngredient);

export default router;
