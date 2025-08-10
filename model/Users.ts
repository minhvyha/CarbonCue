import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUsers extends Document {
  email: string;
  name: string;
  password: string;
  // Carbon Tracker Fields
  totalCarbonReduced: number;
  totalTreesPlanted: number;
  completedRecommendations: mongoose.Types.ObjectId[];
  streak?: number; // Number of consecutive days of carbon tracking or 0 if not tracking
}

const userSchema = new Schema<IUsers>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalCarbonReduced: { type: Number, default: 0 },
  totalTreesPlanted: { type: Number, default: 0 },
  completedRecommendations: [
    { type: Schema.Types.ObjectId, ref: "RecommendationActivity" },
  ],
  streak: { type: Number, default: 0 },
});

// Use existing model if it’s already been compiled, otherwise compile a new one
const Users: Model<IUsers> =
  mongoose.models.Users || mongoose.model<IUsers>("Users", userSchema);

export default Users;
