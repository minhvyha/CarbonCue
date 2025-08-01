import mongoose, { Schema, Document, Model } from 'mongoose';

// Main Research interface
export interface IResearch extends Document {
  slug: string;
  title: string;
  abstract: string;
  researchLink: string;
  authors: string[];
  type: string;
  year: number;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Research schema
const ResearchSchema = new Schema<IResearch>(
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
    abstract: {
      type: String,
      required: true,
    },
    researchLink: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: [String],
      required: true,
      validate: [(arr: string[]) => arr.length > 0, 'At least one author is required.'],
    },
    type: {
      type: String,
      default: 'research',
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create or reuse the Research model
const Researchs: Model<IResearch> =
  mongoose.models.Research || mongoose.model<IResearch>('Research', ResearchSchema);

export default Researchs;
