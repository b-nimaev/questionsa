import { Request, Response } from "express";
import User from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, role, allowedLoginTime } = req.body;

  try {
    // Проверка обязательных полей
    if (!username || !role) {
      return res.status(400).json({ error: "Username and role are required" });
    }

    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Создание нового пользователя
    const user = new User({
      username,
      password,
      role,
      allowedLoginTime,
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

// Другие методы контроллера для аутентификации, логирования и управления пользователями.
