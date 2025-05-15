import type { MongoClient } from 'mongodb';

declare global {
  // you can tweak the shape to match exactly what you store
  var _mongo: {
    client: MongoClient;
    promise: Promise<MongoClient> | null;
  };
}

// this file needs at least one export to be considered a module
export {};
