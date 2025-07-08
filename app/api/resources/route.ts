export const dynamic = "force-dynamic";

// app/api/resources/[slug]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Guides from "@/model/Guides";

export async function GET(_req: Request) {
  // 1) connect to MongoDB
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

  // 2) find the guide by slug
  const allGuides = await Guides.find(
    {},
    {
      numberOfLesson: 1,
      duration: 1,
      level: 1,
      title: 1,
      intro: 1,
      createdAt: 1,
      slug: 1,
      type: 1,
      _id: 0,
    }
  ).lean();
  if (allGuides && allGuides.length !== 0) {
    console.log(`Found ${allGuides.length} guides in total`);
    return NextResponse.json(allGuides);
  }
  return NextResponse.json({ error: "Guide not found" }, { status: 404 });
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  console.log("POST body:", body);

  // 1) connect
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

  // 2) create or update guide by slug
  const { slug } = params;
  let guide = await Guides.findOneAndUpdate({ slug }, body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  // 3) return the new or updated guide
  return NextResponse.json(guide);
}
