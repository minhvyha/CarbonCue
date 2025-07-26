import mongoose, { Schema, Document, Model } from 'mongoose';

// Define content structure for guides
export interface IGuideSection {
  order?: number;
  title?: string;
  description?: string;
  takeaways?: string[];
  youtubeUrl?: string;
}

// Main Guide interface
export interface IGuide extends Document {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  presentationLink: string;
  contents: IGuideSection[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for guide sections
const GuideSectionSchema = new Schema<IGuideSection>(
  {
    order: { type: Number },
    title: { type: String, trim: true },
    description: { type: String },
    takeaways: [{ type: String }],
    youtubeUrl: { type: String },
  },
  { _id: false }
);

// Main Guide schema
const GuideSchema = new Schema<IGuide>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    heroImage: {
      type: String,
      required: true,
    },
    presentationLink: {
      type: String,
      required: true,
    },
    contents: { type: [GuideSectionSchema], default: [] },
    type: {
      type: String,
      default: 'guide',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create or reuse the Guide model
const Guide: Model<IGuide> =
  mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);

export default Guide;
