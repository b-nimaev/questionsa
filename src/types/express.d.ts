import { User } from "../models/User"; // Импортируйте тип User, если он у вас есть

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Добавляем пользовательское свойство user
  }
}