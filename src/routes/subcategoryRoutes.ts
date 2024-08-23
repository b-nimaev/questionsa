import { Router } from "express";
import {
  getSubcategories,
  createSubcategory,
  deleteSubcategory,
  getSubcategory,
} from "../controllers/subcategoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/:categoryId/subcategories",
  authMiddleware,
  getSubcategories
);
router.get(
  "/:categoryId/subcategory",
  authMiddleware,
  getSubcategory
);
router.post(
  "/:categoryId/subcategories",
  authMiddleware,
  createSubcategory
);
router.delete(
  "/:categoryId/subcategories/:subcategoryId",
  authMiddleware,
  deleteSubcategory
);

export default router;
