import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import { validateCreateOrder } from "../validators/order.validator.js";

const orderRouter = Router();

// Any authenticated user can create an order for themselves.
orderRouter.post(
  "/",
  authenticate,
  validateCreateOrder,
  validateRequest,
  createOrder,
);

export default orderRouter;
