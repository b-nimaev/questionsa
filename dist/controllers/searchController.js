"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFAQs = void 0;
const FAQ_1 = __importDefault(require("../models/FAQ"));
const searchFAQs = async (req, res) => {
    try {
        const { query, subcategoryId, page = 1, limit = 10 } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
        // Используем регулярное выражение для частичного поиска
        const regex = new RegExp(query, "i"); // 'i' делает поиск нечувствительным к регистру
        // Преобразуем параметры пагинации в числа
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        // Строим фильтр с учетом подкатегории, если она задана
        const filter = {
            $or: [{ question: { $regex: regex } }, { answer: { $regex: regex } }],
        };
        if (subcategoryId) {
            filter.subcategory = subcategoryId;
        }
        // Выполняем поиск с учетом фильтра, пагинации и сортировки
        const results = await FAQ_1.default.find(filter)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        // Получаем общее количество результатов
        const total = await FAQ_1.default.countDocuments(filter);
        res.status(200).json({
            faqs: results,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    }
    catch (error) {
        console.error("Failed to perform search:", error);
        res.status(500).json({ error: "Failed to perform search" });
    }
};
exports.searchFAQs = searchFAQs;
