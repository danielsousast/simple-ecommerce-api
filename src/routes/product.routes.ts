import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import { uploadMultiple } from "../middlewares/upload.middleware.js";
import handleUploadError from "../middlewares/upload-error.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateCreateProduct,
  validateGetProducts,
  validateProductId,
  validateUpdateProduct,
} from "../validators/product.validator.js";

const productRouter = Router();

productRouter.get("/", validateGetProducts, validateRequest, getProducts);
productRouter.get("/:id", validateProductId, validateRequest, getProductById);

// Product creation is restricted to authenticated administrators.
productRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadMultiple(5),
  handleUploadError,
  validateCreateProduct,
  validateRequest,
  createProduct,
);

// Product updates are restricted to authenticated administrators.
productRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadMultiple(5),
  handleUploadError,
  validateProductId,
  validateUpdateProduct,
  validateRequest,
  updateProduct,
);

// Product deletion is restricted to authenticated administrators.
productRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateProductId,
  validateRequest,
  deleteProduct,
);

export default productRouter;
