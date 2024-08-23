"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.registerUser);
router.get('/users', authMiddleware_1.authMiddleware, authController_1.getUsers); // Добавляем новый маршрут для получения списка пользователей
// Другие роуты
exports.default = router;
