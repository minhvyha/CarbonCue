import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecommendationActivity extends Document {
  userId: mongoose.Types.ObjectId;
  recommendationId: mongoose.Types.ObjectId;
  dateCompleted: Date;
  status: "completed" | "not_completed";
  impactKgCO2: number;
  treesEarned: number;
}

const recommendationActivitySchema = new Schema<IRecommendationActivity>({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  recommendationId: {
    type: Schema.Types.ObjectId,
    ref: "Recommendation",
    required: true,
  },
  dateCompleted: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["completed", "not_completed"],
    default: "not_completed",
  },
  impactKgCO2: { type: Number, required: true },
  treesEarned: { type: Number, required: true },
});

const RecommendationActivity: Model<IRecommendationActivity> =
  mongoose.models.RecommendationActivity ||
  mongoose.model<IRecommendationActivity>(
    "RecommendationActivity",
    recommendationActivitySchema
  );

export default RecommendationActivity;
