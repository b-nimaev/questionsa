import { Router } from "express";
import {
  createFAQ,
  getFAQs,
  deleteFAQ,
  updateFAQ,
  searchFAQs,
} from "../controllers/faqController";

const router = Router();

router.post("/", createFAQ);
router.get("/:subcategoryId", getFAQs);
router.delete("/:id", deleteFAQ);
router.put("/:id", updateFAQ); // Маршрут для обновления FAQ
router.get("/", searchFAQs); // Маршрут для поиска FAQ

export default router;
