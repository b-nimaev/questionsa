import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User"; // Убедитесь, что путь к модели правильный
import Category from "./models/Category";

mongoose.connect("mongodb://localhost:27017/answers");

const createUsers = async () => {
  try {
    const users = [];
    const roles = ["user", "admin"];

    for (let i = 1; i <= 1000; i++) {
      const username = `user${i}`;
      const role = roles[Math.floor(Math.random() * roles.length)];

      const password = await bcrypt.hash("password", 10); // Одинаковый пароль для всех пользователей

      const expiresAt =
        role === "user" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null; // 7 дней для "user", неограниченно для "admin"

      const user = new User({
        username,
        password,
        role,
        expiresAt,
      });

      users.push(user);
    }

    await User.insertMany(users);
    console.log("Пользователи успешно добавлены!");
  } catch (error) {
    console.error("Ошибка при добавлении пользователей:", error);
  } finally {
    mongoose.connection.close();
  }
};

const createCategories = async () => {
  try {
    const categories = [];
    
    for (let i = 1; i <= 100; i++) {
      // Создаем 100 категорий для теста
      const categoryName = `Category ${i}`;
      const category = new Category({
        name: categoryName,
      });
      
      categories.push(category);
    }
    
    await Category.insertMany(categories);
    console.log("Категории успешно добавлены!");
  } catch (error) {
    console.error("Ошибка при добавлении категорий:", error);
  } finally {
    mongoose.connection.close();
  }
};

// createUsers();
createCategories();