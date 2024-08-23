"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
// Получение всех категорий с поддержкой пагинации
const getCategories = async (req, res) => {
    try {
        console.log("Запрос на получение списка категорий");
        const { page = 1, limit = 10 } = req.query;
        const categories = await Category_1.default.find()
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Category_1.default.countDocuments();
        res.status(200).json({
            categories,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    }
    catch (error) {
        console.error('Failed to fetch categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
exports.getCategories = getCategories;
// Создание новой категории
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }
        const category = new Category_1.default({ name });
        await category.save();
        res
            .status(201)
            .json({ message: "Category created successfully", category });
    }
    catch (error) {
        console.error("Failed to create category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};
exports.createCategory = createCategory;
// Удаление категории
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Failed to delete category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
