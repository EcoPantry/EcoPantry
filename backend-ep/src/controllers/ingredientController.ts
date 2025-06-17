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

/**
 * GET /api/ingredients/:uid
 * Lists all ingredients in a user's inventory.
 */
export const listUserIngredients = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    const inventory = await prisma.userInventory.findMany({
      where: { uid },
      include: { ingredient: true },
    });

    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/ingredients/:uid/:iid
 * Updates the quantity of a specific ingredient in user's inventory.
 */
export const updateUserIngredient = async (req: Request, res: Response) => {
  try {
    const { uid, iid } = req.params as { uid?: string; iid?: string };
    const { quantity } = req.body;

    if (!uid || !iid) {
      res.status(400).json({ error: "Missing uid or iid in path params" });
      return;
    }

    const updated = await prisma.userInventory.update({
      where: {
        uid_iid: {
          uid,
          iid: parseInt(iid),
        },
      },
      data: { quantity },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating ingredient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/ingredients/:uid/:iid
 * Removes an ingredient from user's inventory.
 */
export const deleteUserIngredient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid, iid } = req.params as { uid?: string; iid?: string };

    if (!uid || !iid) {
      res.status(400).json({ error: "Missing uid or iid in path parameters" });
      return;
    }

    await prisma.userInventory.delete({
      where: {
        uid_iid: {
          uid,
          iid: parseInt(iid),
        },
      },
    });

    res.status(200).json({ message: "Ingredient removed from inventory" });
  } catch (err: any) {
    console.error("Error deleting ingredient:", err);

    if (err?.code === "P2025") {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
};