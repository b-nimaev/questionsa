import { Router } from "express";
import { getUsers, registerUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.get('/users', authMiddleware, getUsers); // Добавляем новый маршрут для получения списка пользователей
// Другие роуты

export default router;
