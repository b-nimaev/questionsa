import { Router, Request } from "express";
import { loginUser, logoutUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { IUser } from "../models/User";
interface AuthenticatedRequest extends Request {
  user?: IUser; // Добавление пользовательского свойства user в интерфейс запроса
}
const router = Router();

router.post("/login", loginUser);
router.get("/check-auth", authMiddleware, (req: AuthenticatedRequest, res) => {
  // Если токен валидный, возвращаем информацию о пользователе
  res.status(200).json({ user: req.user });
});
router.post("/logout", authMiddleware, logoutUser); // Добавляем маршрут логаута
export default router;
