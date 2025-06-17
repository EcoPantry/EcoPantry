import { Router } from "express";
import {
  getUserInventory,
  addUserIngredient,
  deleteUserIngredient,
} from "../controllers/userInventoryController";

const router = Router();

router.get("/:uid", getUserInventory);
router.post("/", addUserIngredient);
router.delete("/:uid/:iid", deleteUserIngredient);

export default router;
