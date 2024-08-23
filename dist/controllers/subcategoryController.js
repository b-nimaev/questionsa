"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory = exports.getSubcategory = exports.getSubcategories = exports.createSubcategory = void 0;
const Subcategory_1 = __importDefault(require("../models/Subcategory"));
const Category_1 = __importDefault(require("../models/Category"));
// Создание новой субкатегории
const createSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        console.log(categoryId);
        console.log(name);
        if (!name) {
            return res.status(400).json({ error: 'Subcategory name is required' });
        }
        const subcategory = new Subcategory_1.default({ name, category: categoryId });
        await subcategory.save();
        res.status(201).json({ message: 'Subcategory created successfully', subcategory });
    }
    catch (error) {
        console.error('Failed to create subcategory:', error);
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
};
exports.createSubcategory = createSubcategory;
// Получение всех субкатегорий для конкретной категории с поддержкой пагинации
const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        // Преобразуем параметры в числа
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        // Получение субкатегорий с поддержкой пагинации
        const subcategories = await Subcategory_1.default.find({ category: categoryId })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        // Получаем общее количество субкатегорий
        const total = await Subcategory_1.default.countDocuments({ category: categoryId });
        const cat = await Category_1.default.findOne({ _id: categoryId });
        res.status(200).json({
            subcategories,
            categoryName: cat ? cat.name : null,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    }
    catch (error) {
        console.error('Failed to fetch subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
};
exports.getSubcategories = getSubcategories;
// Получение одной субкатегории
const getSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subcategory = await Subcategory_1.default.findById(categoryId);
        const category = await Category_1.default.findById(subcategory?.category);
        res.status(200).json({
            subcategory,
            category
        });
    }
    catch (error) {
        console.error('Failed to fetch subcategory:', error);
        res.status(500).json({ error: 'Failed to fetch subcategory' });
    }
};
exports.getSubcategory = getSubcategory;
const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Subcategory_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Subcategory deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete subcategory" });
    }
};
exports.deleteSubcategory = deleteSubcategory;
