import Category from "../models/category.model.js";

import { Request, Response } from "express";

async function getCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
}

async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: req.t("categoryNotFound") });
    }
    res.json(category);
  } catch {
    res.status(500).json({ error: req.t("serverError") });
  }
}

async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: req.t("categoryNotFound") });
    }
    res.json(updatedCategory);
  } catch {
    res.status(500).json({ error: req.t("serverError") });
  }
} 

async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: req.t("categoryNotFound") });
    }
    res.json({ message: req.t("categoryDeletedSuccessfully") });
  } catch {
    res.status(500).json({ error: req.t("serverError") });
  }
}

export { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory };
