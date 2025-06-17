// PUT /api/brands/:id/esg – upsert ESG rating for a brand

// GET /api/brands/:id/esg – fetch ESG rating of a brand

import type{ Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * GET /api/brands/:id/esg
 * Fetch ESG rating for a brand
 */
export const getEsgRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id as string);

    if (isNaN(brandId)) {
      res.status(400).json({ error: "Invalid brand ID" });
      return;
    }

    const esg = await prisma.eSGRating.findUnique({
      where: { brandId },
    });

    if (!esg) {
      res.status(404).json({ error: "ESG rating not found" });
      return;
    }

    res.status(200).json(esg);
  } catch (err) {
    console.error("Error fetching ESG rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/brands/:id/esg
 * Upsert ESG rating for a brand
 */
export const upsertEsgRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandId = parseInt(req.params.id as string);

    if (isNaN(brandId)) {
      res.status(400).json({ error: "Invalid brand ID" });
      return;
    }

    const { environmentScore, socialScore, governanceScore, totalScore } = req.body;

    if (
      environmentScore === undefined ||
      socialScore === undefined ||
      governanceScore === undefined
    ) {
      res.status(400).json({ error: "Missing ESG score fields" });
      return;
    }

    const score =
      totalScore ?? (environmentScore + socialScore + governanceScore) / 3;

    const existing = await prisma.eSGRating.findUnique({
      where: { brandId },
    });

    const result = existing
      ? await prisma.eSGRating.update({
          where: { brandId },
          data: {
            environmentScore,
            socialScore,
            governanceScore,
            totalScore: score,
          },
        })
      : await prisma.eSGRating.create({
          data: {
            brandId,
            environmentScore,
            socialScore,
            governanceScore,
            totalScore: score,
          },
        });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error upserting ESG rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};