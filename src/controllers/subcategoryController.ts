import { Request, Response } from "express";
import Subcategory from "../models/Subcategory";
import Category from "../models/Category";

// Создание новой субкатегории
export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    console.log(categoryId)
    console.log(name)
    if (!name) {
      return res.status(400).json({ error: 'Subcategory name is required' });
    }

    const subcategory = new Subcategory({ name, category: categoryId });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    console.error('Failed to create subcategory:', error);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

// Получение всех субкатегорий для конкретной категории с поддержкой пагинации
export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Преобразуем параметры в числа
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Получение субкатегорий с поддержкой пагинации
    const subcategories = await Subcategory.find({ category: categoryId })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    // Получаем общее количество субкатегорий
    const total = await Subcategory.countDocuments({ category: categoryId });
    const cat = await Category.findOne({ _id: categoryId })
    res.status(200).json({
      subcategories,
      categoryName: cat ? cat.name : null,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

// Получение одной субкатегории
export const getSubcategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const subcategory = await Subcategory.findById(categoryId)
    const category = await Category.findById(subcategory?.category)
    res.status(200).json({
      subcategory,
      category
    });
  } catch (error) {
    console.error('Failed to fetch subcategory:', error);
    res.status(500).json({ error: 'Failed to fetch subcategory' });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    await Subcategory.findByIdAndDelete(subcategoryId);
    res.status(200).json({ message: "Subcategory deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Subcategory.findByIdAndUpdate(
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