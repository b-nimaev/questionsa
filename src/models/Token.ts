// models/Token.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";

interface IToken extends Document {
  userId: ObjectId;
  token: string;
  expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IToken>("Token", tokenSchema);