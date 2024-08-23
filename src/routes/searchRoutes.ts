import { Router } from "express";
import { searchFAQs } from "../controllers/searchController";

const router = Router();

router.get("/", searchFAQs);

export default router;
