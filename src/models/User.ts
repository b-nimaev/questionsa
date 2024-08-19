import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password?: string;
  role: "user" | "admin";
  allowedLoginTime?: {
    day: string;
    hours: number[];
  };
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], required: true },
  allowedLoginTime: {
    day: {
      type: String,
      required: function (this: IUser) {
        return this.role === "user";
      },
    },
    hours: {
      type: [Number],
      required: function (this: IUser) {
        return this.role === "user";
      },
    },
  },
});

// Хеширование пароля перед сохранением
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Метод для сравнения пароля
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
