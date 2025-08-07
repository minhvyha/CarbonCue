import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecommendation extends Document {
  title: string;
  description: string;
  category: 'transportation' | 'homeenergy' | 'fooddiet' | 'shopping' | 'digitalusage';
  impact: string;
  impactValue: number;
  difficulty: "Easy" | "Medium" | "Hard";
  treesEarned: number;
}

const recommendationSchema = new Schema<IRecommendation>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "transportation",
      "homeenergy",
      "fooddiet",
      "shopping",
      "digitalusage",
    ],
  },
  impact: { type: String, required: true },
  impactValue: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  treesEarned: { type: Number, required: true },
});

const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>("Recommendation", recommendationSchema);

export default Recommendation;

