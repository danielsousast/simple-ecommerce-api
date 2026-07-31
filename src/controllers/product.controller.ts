import { Request, Response } from "express";
import Product from "../models/product.model.js";

async function getProducts(req: Request, res: Response) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, category, images, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      // images,
      // convert stock to number if it is a string
      stock: typeof stock === "string" ? parseInt(stock, 10) : stock,
    });

    res.status(201).json({
      status: true,
      message: req.t("productCreatedSuccessfully"),
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, price, category, images, stock } = req.body;
    const updates = Object.fromEntries(
      Object.entries({ name, description, price, category, images, stock }).filter(
        ([, value]) => value !== undefined,
      ),
    );

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true },
    );

    if (!product) {
      res.status(404).json({ error: req.t("productNotFound") });
      return;
    }

    res.json({
      status: true,
      message: req.t("productUpdatedSuccessfully"),
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

export { createProduct, getProducts, updateProduct };
