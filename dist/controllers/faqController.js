"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFAQ = exports.searchFAQs = exports.deleteFAQ = exports.getFAQs = exports.createFAQ = void 0;
const FAQ_1 = __importDefault(require("../models/FAQ"));
const Subcategory_1 = __importDefault(require("../models/Subcategory"));
const Category_1 = __importDefault(require("../models/Category"));
const createFAQ = async (req, res) => {
    try {
        const faq = new FAQ_1.default(req.body);
        await faq.save();
        res.status(201).json(faq);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create FAQ" });
    }
};
exports.createFAQ = createFAQ;
const getFAQs = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const faqs = await FAQ_1.default.find({ subcategory: subcategoryId })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        const total = await FAQ_1.default.countDocuments({ subcategory: subcategoryId });
        const subcategoryData = await Subcategory_1.default.findById(subcategoryId);
        const categoryData = await Category_1.default.findById(subcategoryData?.category);
        res.status(200).json({
            faqs,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            subcategoryData,
            categoryData
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
};
exports.getFAQs = getFAQs;
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        await FAQ_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "FAQ deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete FAQ" });
    }
};
exports.deleteFAQ = deleteFAQ;
// Поиск по FAQ
const searchFAQs = async (req, res) => {
    try {
        const { query, subcategoryId, page = 1, limit = 10 } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const faqs = await FAQ_1.default.find({
            subcategory: subcategoryId,
            $text: { $search: query }
        })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        const total = await FAQ_1.default.countDocuments({
            subcategory: subcategoryId,
            $text: { $search: query }
        });
        res.status(200).json({
            faqs,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
        });
    }
    catch (error) {
        console.error("Failed to search FAQs:", error);
        res.status(500).json({ error: "Failed to search FAQs" });
    }
};
exports.searchFAQs = searchFAQs;
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        const faq = await FAQ_1.default.findByIdAndUpdate(id, { question, answer }, { new: true, runValidators: true });
        if (!faq) {
            return res.status(404).json({ error: "FAQ not found" });
        }
        res.status(200).json(faq);
    }
    catch (error) {
        console.error("Failed to update FAQ:", error);
        res.status(500).json({ error: "Failed to update FAQ" });
    }
};
exports.updateFAQ = updateFAQ;
