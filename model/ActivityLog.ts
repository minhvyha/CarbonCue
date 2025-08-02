import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
  userId: string;
  activityType: string;
  activityDetails: Record<string, any>; //Flexible data
  prediction: number;
  notes: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: { type: String, required: true },
  activityType: { type: String, required: true },
  activityDetails: { type: Schema.Types.Mixed, required: true }, // Accepts any type of data
  prediction: { type: Number, required: true },
  notes: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
