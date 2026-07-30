import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);

categoryRouter.post("/", createCategory);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.put("/:id", updateCategory);

categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
