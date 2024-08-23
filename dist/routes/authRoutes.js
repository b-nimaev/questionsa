"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/login", authController_1.loginUser);
router.get("/check-auth", authMiddleware_1.authMiddleware, (req, res) => {
    // Если токен валидный, возвращаем информацию о пользователе
    res.status(200).json({ user: req.user });
});
router.post("/logout", authMiddleware_1.authMiddleware, authController_1.logoutUser); // Добавляем маршрут логаута
exports.default = router;
