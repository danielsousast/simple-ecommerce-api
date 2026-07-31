import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateCreateOrder,
  validateGetMyOrders,
  validateOrderId,
} from "../validators/order.validator.js";

const orderRouter = Router();

// Any authenticated user can list their own orders.
orderRouter.get(
  "/",
  authenticate,
  validateGetMyOrders,
  validateRequest,
  getMyOrders,
);

// Any authenticated user can view one of their own orders by id.
orderRouter.get(
  "/:id",
  authenticate,
  validateOrderId,
  validateRequest,
  getOrderById,
);

// Any authenticated user can create an order for themselves.
orderRouter.post(
  "/",
  authenticate,
  validateCreateOrder,
  validateRequest,
  createOrder,
);

// Order deletion is restricted to authenticated administrators.
orderRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateOrderId,
  validateRequest,
  deleteOrder,
);

export default orderRouter;
