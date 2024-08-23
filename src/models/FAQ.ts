import mongoose, { Schema, Document } from "mongoose";

export interface FAQ extends Document {
  question: string;
  answer: string;
  subcategory: mongoose.Types.ObjectId;
}

const FAQSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subcategory: {
    type: mongoose.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
});

// Создаем текстовый индекс на полях question и answer
FAQSchema.index({ question: "text", answer: "text" });

export default mongoose.model<FAQ>("FAQ", FAQSchema);
