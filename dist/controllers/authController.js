"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_1 = __importDefault(require("../models/Token"));
const registerUser = async (req, res) => {
    const { username, password, role, activeDuration } = req.body;
    try {
        // Проверка обязательных полей
        if (!username || !role) {
            return res.status(400).json({ error: "Username and role are required" });
        }
        // Проверка на существующего пользователя
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }
        // Вычисляем время истечения документа, если задано activeDuration
        let expiresAt;
        if (activeDuration) {
            const durationInMilliseconds = activeDuration * 1000; // предполагается, что activeDuration в секундах
            expiresAt = new Date(Date.now() + durationInMilliseconds);
        }
        // Создание нового пользователя
        const user = new User_1.default({
            username,
            password,
            role,
            expiresAt, // Устанавливаем время истечения
        });
        await user.save();
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("User registration failed:", error);
        return res.status(500).json({ error: "User registration failed" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.expiresAt && new Date() > user.expiresAt) {
            return res.status(403).json({ error: "User account has expired" });
        }
        if (user.isLoggedIn) {
            return res.status(403).json({ error: "User is already logged in" });
        }
        if (user.role === "admin") {
            if (!password) {
                return res
                    .status(400)
                    .json({ error: "Password is required for admin login" });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid password" });
            }
        }
        user.isLoggedIn = true;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        const tokenDocument = new Token_1.default({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 1000), // 1 час от текущего времени
        });
        await tokenDocument.save();
        return res.status(200).json({
            message: "Login successful",
            token,
            user: { username: user.username, role: user.role },
        });
    }
    catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ error: "Login failed" });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        if (req.user) {
            console.log(req.user);
            const user = await User_1.default.findById(req.user._id);
            if (user) {
                user.isLoggedIn = false; // Обновляем статус пользователя
                await user.save();
                return res.status(200).json({ message: "Logout successful" });
            }
        }
        return res.status(400).json({ error: "User not found" });
    }
    catch (error) {
        return res.status(500).json({ error: "Logout failed" });
    }
};
exports.logoutUser = logoutUser;
// Метод для получения списка пользователей
const getUsers = async (req, res) => {
    try {
        const { username, page = 1, limit = 10 } = req.query;
        const query = username
            ? { username: new RegExp(username, "i") }
            : {};
        // Пагинация
        const users = await User_1.default.find(query)
            .select("-password")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        // Общее количество пользователей для вычисления общего числа страниц
        const total = await User_1.default.countDocuments(query);
        res.status(200).json({
            users,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    }
    catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
