import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Token from "../models/Token";

interface AuthenticatedRequest extends Request {
  user?: IUser; // Добавление пользовательского свойства user в интерфейс запроса
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] as string | undefined;
    
  console.log("AuthHeader:")
  console.log(authHeader)

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    }; // Используем _id вместо userId
    
    console.log(`decoded: ${decoded}`);

    // Проверяем, существует ли токен в базе данных
    const tokenExists = await Token.findOne({ token, userId: decoded.userId });

    if (!tokenExists) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Найти пользователя по _id
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Теперь TypeScript знает о наличии свойства user
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
