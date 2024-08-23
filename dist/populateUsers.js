"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./models/User")); // Убедитесь, что путь к модели правильный
const Category_1 = __importDefault(require("./models/Category"));
mongoose_1.default.connect("mongodb://localhost:27017/answers");
const createUsers = async () => {
    try {
        const users = [];
        const roles = ["user", "admin"];
        for (let i = 1; i <= 1000; i++) {
            const username = `user${i}`;
            const role = roles[Math.floor(Math.random() * roles.length)];
            const password = await bcrypt_1.default.hash("password", 10); // Одинаковый пароль для всех пользователей
            const expiresAt = role === "user" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null; // 7 дней для "user", неограниченно для "admin"
            const user = new User_1.default({
                username,
                password,
                role,
                expiresAt,
            });
            users.push(user);
        }
        await User_1.default.insertMany(users);
        console.log("Пользователи успешно добавлены!");
    }
    catch (error) {
        console.error("Ошибка при добавлении пользователей:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
const createCategories = async () => {
    try {
        const categories = [];
        for (let i = 1; i <= 100; i++) {
            // Создаем 100 категорий для теста
            const categoryName = `Category ${i}`;
            const category = new Category_1.default({
                name: categoryName,
            });
            categories.push(category);
        }
        await Category_1.default.insertMany(categories);
        console.log("Категории успешно добавлены!");
    }
    catch (error) {
        console.error("Ошибка при добавлении категорий:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
// createUsers();
createCategories();
