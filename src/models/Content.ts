import mongoose, { Document, Schema } from "mongoose";

interface IContent extends Document {
  category: string;
  subcategory: string;
  title: string;
  body: string;
}

const ContentSchema: Schema = new Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export default mongoose.model<IContent>("Content", ContentSchema);
