// models/ArtPiece.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArtPiece extends Document {
  title: string;
  artist: string;
  medium: string;
  year: string;
  dimensions: string;
  description: string;
  image: string;
  technique: string;
  inspiration: string;
  artistBio: string;
  type: string;
}

const artPieceSchema = new Schema<IArtPiece>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  medium: { type: String, required: true },
  year: { type: String, required: true },
  dimensions: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  technique: { type: String, required: true },
  inspiration: { type: String, required: true },
  artistBio: { type: String, required: true },
  type: { type: String, required: true, default: 'art' }, // Default type for art pieces
});

// Use existing model if already compiled
const ArtPieces: Model<IArtPiece> =
  mongoose.models.ArtPieces || mongoose.model<IArtPiece>("ArtPieces", artPieceSchema);

export default ArtPieces;
