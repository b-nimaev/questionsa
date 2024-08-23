import { Request, Response } from "express";
import FAQ from "../models/FAQ";

export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const { query, subcategoryId, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Используем регулярное выражение для частичного поиска
    const regex = new RegExp(query as string, "i"); // 'i' делает поиск нечувствительным к регистру

    // Преобразуем параметры пагинации в числа
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Строим фильтр с учетом подкатегории, если она задана
    const filter: any = {
      $or: [{ question: { $regex: regex } }, { answer: { $regex: regex } }],
    };

    if (subcategoryId) {
      filter.subcategory = subcategoryId;
    }

    // Выполняем поиск с учетом фильтра, пагинации и сортировки
    const results = await FAQ.find(filter)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    // Получаем общее количество результатов
    const total = await FAQ.countDocuments(filter);

    res.status(200).json({
      faqs: results,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Failed to perform search:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
};
