import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByIngredient,
  getProductsByBrand,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/by-ingredient/:iid", getProductsByIngredient);
router.get("/by-brand/:id", getProductsByBrand);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
