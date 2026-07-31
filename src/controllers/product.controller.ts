import { Request, Response } from "express";
import Product from "../models/product.model.js";
import { getFileUrl } from "../middlewares/upload.middleware.js";

async function getProducts(req: Request, res: Response) {
  try {
    const { category, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof category === "string") {
      filter.category = category;
    }

    if (typeof search === "string") {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function getProductById(req: Request, res: Response) {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      res.status(404).json({ error: req.t("productNotFound") });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, category, stock } = req.body;
    const uploadedFiles = (req.files as Express.Multer.File[] | undefined) ?? [];
    const images = uploadedFiles.map((file) => getFileUrl(req, file.filename));

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
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

export { createProduct, getProductById, getProducts, updateProduct };
