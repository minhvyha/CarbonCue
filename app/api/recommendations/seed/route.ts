import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Recommendation from "@/model/Recommendation";
import seedData from "@/public/recommendation_seed_data_no_id.json";

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing recommendations first
    await Recommendation.deleteMany({});

    // Insert all data from seed file
    const result = await Recommendation.insertMany(seedData);

    return NextResponse.json({
      message: "✅ Seeded recommendations successfully",
      count: result.length,
    });
  } catch (error) {
    console.error("❌ Failed to seed recommendations:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
