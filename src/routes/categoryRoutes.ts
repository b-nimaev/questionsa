import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories); // Получение всех категорий
router.post('/', authMiddleware, createCategory); // Создание новой категории
router.delete('/:id', authMiddleware, deleteCategory); // Удаление категории

export default router;
