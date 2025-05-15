// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define MONGODB_URI");

let cached = global._mongo; 
if (!cached) {
  cached = { client: new MongoClient(uri), promise: null };
  global._mongo = cached;
}

if (!cached.promise) {
  cached.promise = cached.client.connect();
}

export default async function getClient() {
  await cached.promise;
  return cached.client;
}
