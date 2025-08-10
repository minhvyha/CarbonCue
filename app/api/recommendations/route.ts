import { NextRequest, NextResponse } from "next/server";
import Recommendation from "@/model/Recommendation";
import { connectToDatabase } from "@/lib/mongoose";
import RecommendationActivity from "@/model/RecommendationActivity";

// Get all recommendations
// export async function GET() {
//   try {
//     await connectToDatabase();

//     const recommendations = await Recommendation.find();
//     return NextResponse.json(recommendations);
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 1. Get all recommendations
    const recommendations = await Recommendation.find().lean();

    // 2. If no userId, just return the list
    if (!userId) {
      return NextResponse.json(recommendations);
    }

    // 3. Get user's completed recommendation IDs
    const completed = await RecommendationActivity.find({
      userId,
      status: "completed",
    }).lean();

    const completedIds = new Set(
      completed.map((a) => a.recommendationId.toString())
    );

    // 4. Add `completed: true/false` to each recommendation
    const annotated = recommendations.map((rec) => ({
      ...rec,
      completed: completedIds.has(rec._id.toString()),
    }));

    return NextResponse.json(annotated);
  } catch (error) {
    console.error("Error fetching annotated recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
