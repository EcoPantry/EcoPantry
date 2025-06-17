import { Router } from "express";
import { getEsgRating, upsertEsgRating } from "../controllers/esgController";

const router = Router();

router.get("/:id/esg", getEsgRating);
router.put("/:id/esg", upsertEsgRating);

export default router;
