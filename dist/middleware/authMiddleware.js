"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("AuthHeader:");
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret"); // Используем _id вместо userId
        console.log(`decoded: ${decoded}`);
        // Проверяем, существует ли токен в базе данных
        const tokenExists = await Token_1.default.findOne({ token, userId: decoded.userId });
        if (!tokenExists) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // Найти пользователя по _id
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user; // Теперь TypeScript знает о наличии свойства user
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
