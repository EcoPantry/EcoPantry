import { Router } from "express";
import { getRecipeTips } from "../controllers/geminiController";

const router = Router();

router.post("/recipe-tips", getRecipeTips);

export default router;
