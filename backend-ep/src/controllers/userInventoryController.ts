// 5. User Inventory Controller
// This likely already exists.

// POST /api/user-inventory – add an ingredient (linked to core ingredient or product) to user's pantry

// DELETE /api/user-inventory/:uid/:iid – delete from inventory

// GET /api/user-inventory/:uid – list all ingredients in a user's pantry (can now also show ESG via brand/product)

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * GET /api/user-inventory/:uid
 * Returns all ingredients in a user's inventory,
 * including related ingredient, brand, and ESG data.
 */
export const getUserInventory = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      res.status(400).json({ error: "Missing user ID" });
      return;
    }

    const inventory = await prisma.userInventory.findMany({
      where: { uid },
      include: {
        ingredient: {
          include: {
            brand: {
              include: {
                esg: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/user-inventory
 * Adds an ingredient to a user's inventory.
 * Expected body: { uid: string, iid: number, quantity: number }
 */
export const addUserIngredient = async (req: Request, res: Response) => {
  try {
    const { uid, iid, quantity } = req.body;

    if (!uid || !iid || quantity == null) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const upserted = await prisma.userInventory.upsert({
      where: {
        uid_iid: {
          uid,
          iid,
        },
      },
      update: { quantity },
      create: {
        uid,
        iid,
        quantity,
      },
    });

    res.status(201).json(upserted);
  } catch (err) {
    console.error("Error adding to inventory:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/user-inventory/:uid/:iid
 * Removes an ingredient from the user's inventory.
 */
export const deleteUserIngredient = async (req: Request, res: Response) => {
  try {
    const { uid, iid } = req.params;

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

    if (err.code === "P2025") {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }

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
