import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);

// Другие роуты

export default router;
