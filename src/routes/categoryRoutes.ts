import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getCategories); // Получение всех категорий
router.post("/", authMiddleware, createCategory); // Создание новой категории
router.delete("/:id", authMiddleware, deleteCategory); // Удаление категории
router.put("/:id", authMiddleware, updateCategory); // Обновление категории

export default router;
