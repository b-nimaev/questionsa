"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], required: true },
    expiresAt: { type: Date },
    isLoggedIn: { type: Boolean, default: false }, // По умолчанию false
});
// Устанавливаем TTL индекс для автоматического удаления документов по полю expiresAt
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
// Метод для сравнения пароля
userSchema.methods.comparePassword = function (password) {
    if (!this.password)
        return Promise.resolve(false);
    return bcrypt_1.default.compare(password, this.password);
};
exports.default = mongoose_1.default.model("User", userSchema);
