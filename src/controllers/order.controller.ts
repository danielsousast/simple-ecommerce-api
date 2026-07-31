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

export { createOrder };
