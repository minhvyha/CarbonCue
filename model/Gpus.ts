// models/Gpu.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGpu extends Document {
  name: string; // GPU model name
  watt: number; // Power consumption in watts
}

const gpuSchema = new Schema<IGpu>({
  name: { type: String, required: true, unique: true },
  watt: { type: Number, required: true },
});

// Use existing model if already compiled
const Gpus: Model<IGpu> = mongoose.models.Gpus || mongoose.model<IGpu>("Gpus", gpuSchema);

export default Gpus;
