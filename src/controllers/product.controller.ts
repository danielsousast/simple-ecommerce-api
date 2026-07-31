import { Request, Response } from "express";
import Product from "../models/product.model.js";
import { getFileUrl } from "../middlewares/upload.middleware.js";

/**
 * GET /products
 * Lists products, optionally filtered by category/search and paginated
 * via `page`/`limit` query params (both validated upstream).
 */
async function getProducts(req: Request, res: Response) {
  try {
    const { category, search, page, limit } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof category === "string") {
      filter.category = category;
    }

    if (typeof search === "string") {
      // Escape regex metacharacters so user input is matched literally.
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Default to page 1 / 10 per page when not provided.
    const pageNumber = typeof page === "string" ? parseInt(page, 10) : 1;
    const pageLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * pageLimit;

    // Fetch the page of results and the total matching count in parallel.
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category").skip(skip).limit(pageLimit),
      Product.countDocuments(filter),
    ]);

    res.json({
      data: products,
      meta: {
        total,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

/**
 * GET /products/:id
 * Fetches a single product by id, 404s if it doesn't exist.
 */
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

/**
 * POST /products (admin only)
 * Creates a product from the request body, uploading any attached
 * files and storing their public URLs as `images`.
 */
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

/**
 * PUT /products/:id (admin only)
 * Applies a partial update, only sending fields that were actually
 * provided in the body so omitted fields keep their existing value.
 * Uploading new files replaces the product's images entirely.
 */
async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, price, category, images, stock } = req.body;
    const uploadedFiles = (req.files as Express.Multer.File[] | undefined) ?? [];
    const uploadedImages = uploadedFiles.length
      ? uploadedFiles.map((file) => getFileUrl(req, file.filename))
      : undefined;

    const updates = Object.fromEntries(
      Object.entries({
        name,
        description,
        price,
        category,
        images: uploadedImages ?? images,
        stock,
      }).filter(([, value]) => value !== undefined),
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

/**
 * DELETE /products/:id (admin only)
 * Removes a product by id, 404s if it doesn't exist.
 */
async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: req.t("productNotFound") });
      return;
    }

    res.json({
      status: true,
      message: req.t("productDeletedSuccessfully"),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

export { createProduct, deleteProduct, getProductById, getProducts, updateProduct };
