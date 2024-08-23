import mongoose, { Schema, Document } from "mongoose";

interface Subcategory extends Document {
  name: string;
  category: mongoose.Types.ObjectId; // Ссылка на категорию
}

const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
});

export default mongoose.model<Subcategory>("Subcategory", SubcategorySchema);
