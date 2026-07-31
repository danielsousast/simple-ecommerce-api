import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateCreateProduct,
  validateGetProducts,
  validateProductId,
  validateUpdateProduct,
} from "../validators/product.validator.js";

const productRouter = Router();

productRouter.get("/", validateGetProducts, validateRequest, getProducts);

// Product creation is restricted to authenticated administrators.
productRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  validateCreateProduct,
  validateRequest,
  createProduct,
);

// Product updates are restricted to authenticated administrators.
productRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateProductId,
  validateUpdateProduct,
  validateRequest,
  updateProduct,
);

export default productRouter;
