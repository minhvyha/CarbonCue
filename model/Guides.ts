import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGuides extends Document {
  author: string;
  content: string;
  // …other fields
}

const guidesSchema = new Schema<IGuides>({
  author: { type: String, required: true },
  content: { type: String, required: true },
  // …other fields
});

// Use existing model if it’s already been compiled, otherwise compile a new one
const Guides: Model<IGuides> =
  mongoose.models.Guides ||
  mongoose.model<IGuides>('Guides', guidesSchema);

export default Guides;
