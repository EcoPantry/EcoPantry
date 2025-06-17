import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * POST /api/brands
 * Creates a new brand with optional ESG rating.
 */
export const createBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, esg } = req.body;

    if (!name) {
      res.status(400).json({ error: "Brand name is required." });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        esg: esg
          ? {
              create: {
                environmentScore: esg.environmentScore,
                socialScore: esg.socialScore,
                governanceScore: esg.governanceScore,
                totalScore:
                  esg.totalScore ??
                  (esg.environmentScore +
                    esg.socialScore +
                    esg.governanceScore) /
                    3,
              },
            }
          : undefined,
      },
      include: {
        esg: true,
      },
    });

    res.status(201).json(brand);
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/brands
 * Returns all brands with ESG scores if available.
 */
export const getAllBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { esg: true },
    });

    res.status(200).json(brands);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/brands/:id/esg
 * Creates or updates ESG rating for a brand.
 */
export const upsertEsgRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
    res.status(400).json({ error: "Missing brand ID" }); 
    }

    const brandId = parseInt(id as string);

    if (isNaN(brandId)) {
      res.status(400).json({ error: "Invalid brand ID" }); 
    }

    const { environmentScore, socialScore, governanceScore, totalScore } = req.body;

    if (
      environmentScore === undefined ||
      socialScore === undefined ||
      governanceScore === undefined
    ) {
      res.status(400).json({ error: "Missing ESG score fields" }); 
    }

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
            totalScore:
              totalScore ?? (environmentScore + socialScore + governanceScore) / 3,
          },
        })
      : await prisma.eSGRating.create({
          data: {
            brandId,
            environmentScore,
            socialScore,
            governanceScore,
            totalScore:
              totalScore ?? (environmentScore + socialScore + governanceScore) / 3,
          },
        });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error upserting ESG rating:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
