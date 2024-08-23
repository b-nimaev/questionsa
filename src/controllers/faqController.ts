import { Request, Response } from "express";
import FAQ from "../models/FAQ";
import Subcategory from "../models/Subcategory";
import Category from "../models/Category";

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};

export const getFAQs = async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const faqs = await FAQ.find({ subcategory: subcategoryId })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await FAQ.countDocuments({ subcategory: subcategoryId });

    const subcategoryData = await Subcategory.findById(subcategoryId);
    const categoryData = await Category.findById(subcategoryData?.category)
    res.status(200).json({
      faqs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      subcategoryData,
      categoryData
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

// Поиск по FAQ
export const searchFAQs = async (req: Request, res: Response) => {
  try {
    const { query, subcategoryId, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const faqs = await FAQ.find({
      subcategory: subcategoryId,
      $text: { $search: query as string }
    })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await FAQ.countDocuments({
      subcategory: subcategoryId,
      $text: { $search: query as string }
    });

    res.status(200).json({
      faqs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Failed to search FAQs:", error);
    res.status(500).json({ error: "Failed to search FAQs" });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};
