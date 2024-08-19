import { Request, Response } from "express";
import User from "../models/User";

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Логика для авторизации админов
    if (user.role === "admin") {
      if (!password) {
        return res
          .status(400)
          .json({ error: "Password is required for admins" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      return res
        .status(200)
        .json({
          message: "Admin login successful",
          user: { username: user.username, role: user.role },
        });
    }

    // Логика для авторизации обычных пользователей без пароля
    const currentDate = new Date();
    const currentDay = currentDate
      .toLocaleDateString("ru-RU", { weekday: "long" })
      .toLowerCase();
    const currentHour = currentDate.getHours();

    if (
      user.allowedLoginTime?.day !== currentDay ||
      !user.allowedLoginTime.hours.includes(currentHour)
    ) {
      return res.status(403).json({ error: "Access denied: Not allowed time" });
    }

    return res
      .status(200)
      .json({
        message: "User login successful",
        user: { username: user.username, role: user.role },
      });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
