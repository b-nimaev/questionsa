"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const subcategoryRoutes_1 = __importDefault(require("./routes/subcategoryRoutes"));
const faqRoutes_1 = __importDefault(require("./routes/faqRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Middleware для парсинга JSON
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGO_URI || "http://localhost:27017", {
    dbName: 'answers'
    // Без дополнительных опций, так как они больше не требуются
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
// Роуты
app.use("/api/users", authMiddleware_1.authMiddleware, userRoutes_1.default);
app.use("/api/auth", authRoutes_1.default); // Добавлен новый роут
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/subcategories", subcategoryRoutes_1.default);
app.use("/api/faqs", authRoutes_1.default, faqRoutes_1.default);
app.use('/api/search', searchRoutes_1.default); // Подключаем маршрут поиска
exports.default = app;
