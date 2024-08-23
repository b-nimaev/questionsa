"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', categoryController_1.getCategories); // Получение всех категорий
router.post('/', authMiddleware_1.authMiddleware, categoryController_1.createCategory); // Создание новой категории
router.delete('/:id', authMiddleware_1.authMiddleware, categoryController_1.deleteCategory); // Удаление категории
exports.default = router;
