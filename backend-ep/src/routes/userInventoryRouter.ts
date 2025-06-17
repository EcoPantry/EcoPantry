import { Router } from "express";
import {
  getUserInventory,
  addUserIngredient,
  deleteUserIngredient,
  listUserIngredients,
  updateUserIngredient,
} from "../controllers/userInventoryController";

const router = Router();

router.get("/:uid", getUserInventory);
router.post("/", addUserIngredient);
router.delete("/:uid/:iid", deleteUserIngredient);
router.get("/:uid", listUserIngredients);
router.put("/:uid/:iid", updateUserIngredient);

export default router;
