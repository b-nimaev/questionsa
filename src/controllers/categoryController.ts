import { Request, Response } from "express";
import Category from "../models/Category";

// Получение всех категорий с поддержкой пагинации
export const getCategories = async (req: Request, res: Response) => {
  try {
    console.log("Запрос на получение списка категорий")
    const { page = 1, limit = 10 } = req.query;

    const categories = await Category.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Category.countDocuments();

    res.status(200).json({
      categories,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Создание новой категории
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = new Category({ name });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Failed to create category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Удаление категории
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Failed to delete category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};