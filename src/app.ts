import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { authMiddleware } from "./middleware/authMiddleware";
import categoryRoutes from "./routes/categoryRoutes";
import subcategoryRoutes from "./routes/subcategoryRoutes";
import faqRoutes from "./routes/faqRoutes";
import searchRoutes from "./routes/searchRoutes";
dotenv.config();

const app = express();
app.use(cors())
// Middleware для парсинга JSON
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "answers",
    // Без дополнительных опций, так как они больше не требуются
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Роуты
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Добавлен новый роут
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/faqs", authRoutes, faqRoutes);
app.use('/api/search', searchRoutes); // Подключаем маршрут поиска

export default app;
