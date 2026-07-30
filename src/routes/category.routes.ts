import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateCategoryId,
  validateCategoryName,
} from "../validators/category.validator.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);

categoryRouter.post("/", validateCategoryName, validateRequest, createCategory);

categoryRouter.get("/:id", validateCategoryId, validateRequest, getCategoryById);

categoryRouter.put(
  "/:id",
  validateCategoryId,
  validateCategoryName,
  validateRequest,
  updateCategory,
);

categoryRouter.delete("/:id", validateCategoryId, validateRequest, deleteCategory);

export default categoryRouter;
