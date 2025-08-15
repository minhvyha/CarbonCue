// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Cache the connection across hot-reloads in development
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "carboncue",
        // modern connection options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // ensure server acknowledges writes
        retryWrites: true,
        writeConcern: { w: "majority", j: true },
      } as mongoose.ConnectOptions)
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
