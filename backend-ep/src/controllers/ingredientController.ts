import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * POST /api/ingredients
 * Creates a new ingredient and adds it to the user's inventory.
 */
export const createIngredient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, name, quantity, unit, type, category } = req.body;

    if (!uid || !name || !quantity || !unit || !type || !category) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const ingredient = await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name, quantity, unit, type, category },
    });

    const userInventory = await prisma.userInventory.upsert({
      where: {
        uid_iid: {
          uid,
          iid: ingredient.iid,
        },
      },
      update: {
        quantity,
      },
      create: {
        uid,
        iid: ingredient.iid,
        quantity,
      },
    });

    res.status(201).json({ ingredient, inventory: userInventory });
  } catch (err) {
    console.error("Error creating ingredient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
