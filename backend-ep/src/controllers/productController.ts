// Methods:
// POST /api/products – create a new product (requires brandId and ingredientId)

// GET /api/products – list all products

// GET /api/products/:id – get one product with brand + ingredient info

// GET /api/products/by-ingredient/:iid – get all products of a specific ingredient

// GET /api/products/by-brand/:id – get all products from a brand

// (Optional):

// PUT /api/products/:id – update product info

// DELETE /api/products/:id – remove a product

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";


/**
 * POST /api/products
 * Creates a new product.
 * Expected body: { productName, ingredientId, brandId }
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { productName, ingredientId, brandId } = req.body;

    if (!productName || !ingredientId || !brandId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const product = await prisma.product.create({
      data: {
        productName,
        ingredient: {
          connect: { iid: ingredientId },
        },
        brand: {
          connect: { id: brandId },
        },
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/products
 * Lists all products.
 */
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        ingredient: true,
        brand: {
          include: {
            esg: true,
          },
        },
      },
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/products/:id
 * Get a specific product with brand and ingredient info.
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ingredient: true,
        brand: {
          include: {
            esg: true,
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/products/by-ingredient/:iid
 * Get all products tied to a specific ingredient.
 */
export const getProductsByIngredient = async (req: Request, res: Response) => {
  try {
    const iid = parseInt(req.params.iid as string);

    const products = await prisma.product.findMany({
      where: { ingredientId: iid },
      include: {
        ingredient: true,
        brand: {
          include: { esg: true },
        },
      },
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching by ingredient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/products/by-brand/:id
 * Get all products from a specific brand.
 */
export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const brandId = parseInt(req.params.id as string);

    const products = await prisma.product.findMany({
      where: { brandId },
      include: {
        brand: { include: { esg: true } },
        ingredient: true,
      },
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching by brand:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/products/:id
 * Updates a product.
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { productName, ingredientId, brandId } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        productName,
        ingredientId,
        brandId,
      },
    });

    res.status(200).json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/products/:id
 * Deletes a product.
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};