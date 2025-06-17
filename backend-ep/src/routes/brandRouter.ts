import { Router } from "express";
import {
  createBrand,
  getAllBrands,
  upsertEsgRating,
} from "../controllers/brandController";

const router = Router();

router.post("/", createBrand);
router.get("/", getAllBrands);
router.put("/:id/esg", upsertEsgRating);

export default router;
