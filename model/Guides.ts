import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the types of content blocks allowed in a guide
export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'video'
  | 'list'
  | 'quote'
  | 'divider';

// Block interface: flexible structure for various content types
export interface IBlock {
  type: BlockType;
  label?: string;            // For headings, video captions, or quote attribution
  text?: string;             // For paragraphs or quotes
  url?: string;              // For video links or external resources
  items?: string[];          // List items
  meta?: Record<string, any>; // Any additional metadata
}

// Guides interface: the main document schema
export interface IGuides extends Document {
  slug: string;
  title: string;
  author: string;
  intro?: string;
  blocks: IBlock[];
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for each content block (embedded, no _id by default)
const BlockSchema = new Schema<IBlock>(
  {
    type: {
      type: String,
      enum: ['heading','paragraph','video','list','quote','divider'],
      required: true,
    },
    label: { type: String },
    text: { type: String },
    url: { type: String },
    items: [{ type: String }],
    meta: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

// Main schema for guides
const guidesSchema = new Schema<IGuides>(
  {
    slug:      { type: String, required: true, unique: true, trim: true },
    title:     { type: String, required: true, trim: true },
    author:    { type: String, required: true, trim: true },
    intro:     { type: String },
    blocks:    { type: [BlockSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create or reuse the model
const Guides: Model<IGuides> =
  mongoose.models.Guides || mongoose.model<IGuides>('Guides', guidesSchema);

export default Guides;
