import { NextResponse } from "next/server";
import RecommendationActivity from "@/model/RecommendationActivity";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
  await connectToDatabase();
  const activities = await RecommendationActivity.find({});
  return NextResponse.json(activities);
}
