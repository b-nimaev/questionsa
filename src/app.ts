import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// Middleware для парсинга JSON
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "", {
    dbName: 'answers'
    // Без дополнительных опций, так как они больше не требуются
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
// Роуты
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Добавлен новый роут

export default app;
