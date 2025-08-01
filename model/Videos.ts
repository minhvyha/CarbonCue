import mongoose, { Schema, Document, Model } from 'mongoose';

// Define content structure (if needed for future video chapters or metadata)
export interface IVideoSection {
  order?: number;
  title?: string;
  description?: string;
}

// Main Video interface
export interface IVideo extends Document {
  slug: string;
  title: string;
  description: string;
  videoLink: string;
  contents: IVideoSection[];
  duration: string;
  uploadDate: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for video sections (currently unused but extensible)
const VideoSectionSchema = new Schema<IVideoSection>(
  {
    order: { type: Number },
    title: { type: String, trim: true },
    description: { type: String },
  },
  { _id: false }
);

// Main Video schema
const VideoSchema = new Schema<IVideo>(
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
    videoLink: {
      type: String,
      required: true,
    },
    contents: { type: [VideoSectionSchema], default: [] },
    type: {
      type: String,
      default: 'video',
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    uploadDate: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create or reuse the Video model
const Videos: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Videos;
