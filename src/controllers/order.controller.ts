import { Request, Response } from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/**
 * POST /orders (authenticated)
 * Creates an order for the authenticated user from a list of
 * { product, quantity } items. Stock is checked and decremented
 * atomically per item; if any item can't be fulfilled, previously
 * decremented items are rolled back and the request fails as a whole
 * (no DB transactions available on a standalone MongoDB connection).
 */
async function createOrder(req: Request, res: Response) {
  const decremented: { productId: string; quantity: number }[] = [];

  try {
    const { items, shippingAddress } = req.body;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!product) {
        await Promise.all(
          decremented.map(({ productId, quantity }) =>
            Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } }),
          ),
        );

        const productExists = await Product.exists({ _id: item.product });
        if (!productExists) {
          res.status(404).json({ error: req.t("productNotFound") });
        } else {
          res.status(400).json({ error: req.t("insufficientStock") });
        }
        return;
      }

      decremented.push({ productId: item.product, quantity: item.quantity });
      orderItems.push({
        product: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const total = orderItems.reduce((sum, orderItem) => sum + orderItem.price * orderItem.quantity, 0);

    const order = await Order.create({
      user: req.auth!.id,
      items: orderItems,
      shippingAddress,
      total,
    });

    const populatedOrder = await order.populate("items.product");

    res.status(201).json({
      status: true,
      message: req.t("orderCreatedSuccessfully"),
      data: populatedOrder,
    });
  } catch (error: any) {
    await Promise.all(
      decremented.map(({ productId, quantity }) =>
        Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } }),
      ),
    );
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

/**
 * GET /orders (authenticated)
 * Lists the authenticated user's own orders, newest first, paginated
 * via `page`/`limit` query params (both validated upstream).
 */
async function getMyOrders(req: Request, res: Response) {
  try {
    const { page, limit } = req.query;

    // Default to page 1 / 10 per page when not provided.
    const pageNumber = typeof page === "string" ? parseInt(page, 10) : 1;
    const pageLimit = typeof limit === "string" ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * pageLimit;

    const filter = { user: req.auth!.id };

    // Fetch the page of results and the total matching count in parallel.
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("items.product")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit),
      Order.countDocuments(filter),
    ]);

    res.json({
      data: orders,
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
 * GET /orders/:id (authenticated)
 * Fetches a single order belonging to the authenticated user by id,
 * 404s if it doesn't exist or belongs to someone else.
 */
async function getOrderById(req: Request, res: Response) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.auth!.id,
    }).populate("items.product");

    if (!order) {
      res.status(404).json({ error: req.t("orderNotFound") });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

/**
 * DELETE /orders/:id (admin only)
 * Removes an order by id and restocks its items, 404s if it doesn't exist.
 */
async function deleteOrder(req: Request, res: Response) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      res.status(404).json({ error: req.t("orderNotFound") });
      return;
    }

    await Promise.all(
      order.items.map(({ product, quantity }) =>
        Product.findByIdAndUpdate(product, { $inc: { stock: quantity } }),
      ),
    );

    res.json({
      status: true,
      message: req.t("orderDeletedSuccessfully"),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

export { createOrder, deleteOrder, getMyOrders, getOrderById };
