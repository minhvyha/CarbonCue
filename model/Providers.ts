// models/Provider.ts
import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Single region entry (matches your JSON sample)
 */
export interface IRegion {
  regionName?: string;
  country?: string;
  state?: string;
  city?: string;
  source?: string;
  comment?: string;
  providerName?: string;
  offsetRatio?: string;
  impact?: number;
}

/**
 * Structure used for the "__min" field inside each provider object
 * (your sample uses "__min": { region: "...", impact: ... })
 */
export interface IMin {
  region: string;
  impact: number;
}

/**
 * Provider document
 * - `regions` is stored as a Map in Mongo (keys = region code, e.g. "asia-east1").
 * - `__min` matches your sample's special min object (optional).
 */
export interface IProvider extends Document {
  regions: Map<string, IRegion>;
  __min?: IMin;
  name: string; // optional display name for the provider
}

const regionSchema = new Schema<IRegion>(
  {
    regionName: { type: String, required: false },
    country: { type: String, required: false, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    source: { type: String, default: "" },
    comment: { type: String, default: "" },
    providerName: { type: String, required: false },
    offsetRatio: { type: String, required: false },
    impact: { type: Number, required: false },
  },
  { _id: false } // region entries are subdocuments stored in a Map; no separate _id needed
);

// schema for the __min object
const minSchema = new Schema<IMin>(
  {
    region: { type: String, default: "" },
    impact: { type: Number, required: true },
  },
  { _id: false }
);

const providerSchema = new Schema<IProvider>(
  {
    // store regions as a Map (keys = region codes like "asia-east1", could be empty string "")
    regions: {
      type: Map,
      of: regionSchema || minSchema, // use region schema for normal regions, min schema for __min
      required: true,
      default: {},
    },

    // preserve the "__min" object present in your JSON samples
    name: { type: String, default: "" }, // optional display name for the provider
  }
);

// Use existing model if already compiled (prevents overwrite errors in dev/hot-reload)
const Providers: Model<IProvider> =
  (mongoose.models && (mongoose.models.Providers as Model<IProvider>)) ||
  mongoose.model<IProvider>("Providers", providerSchema);

export default Providers;
