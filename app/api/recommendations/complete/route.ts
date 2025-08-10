import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Recommendation from "@/model/Recommendation";
import RecommendationActivity from "@/model/RecommendationActivity";
import Users from "@/model/Users";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, recommendationId } = await req.json();
    console.log("📝 Complete request:", { userId, recommendationId });

    const recommendation = await Recommendation.findById(recommendationId);
    // Check if user exists first
    const existingUser = await Users.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("👤 User before update:", {
      id: existingUser._id,
      totalCarbonReduced: existingUser.totalCarbonReduced,
      totalTreesPlanted: existingUser.totalTreesPlanted,
      streak: existingUser.streak,
    });

    // Initialize fields if they don't exist
    if (existingUser.totalCarbonReduced === undefined) {
      existingUser.totalCarbonReduced = 0;
    }
    if (existingUser.totalTreesPlanted === undefined) {
      existingUser.totalTreesPlanted = 0;
    }
    if (existingUser.streak === undefined) {
      existingUser.streak = 0;
    }
    await existingUser.save();

    console.log("👤 User after initialization:", {
      totalCarbonReduced: existingUser.totalCarbonReduced,
      totalTreesPlanted: existingUser.totalTreesPlanted,
      streak: existingUser.streak,
    });

    // Create recommendation activity log
    const activity = await RecommendationActivity.create({
      userId,
      recommendationId,
      dateCompleted: new Date(),
      status: "completed",
      impactKgCO2: recommendation?.impactValue,
      treesEarned: recommendation?.treesEarned,
    });

    console.log("✅ Created activity:", activity._id);

    // Update user stats
    const user = await Users.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalCarbonReduced: recommendation?.impactValue,
          totalTreesPlanted: recommendation?.treesEarned,
          streak: 1, // Increment streak when completing a recommendation
        },
        $addToSet: {
          completedRecommendations: recommendation?._id,
        },
      },
      { new: true }
    );

    console.log("🔧 Updated user stats:", {
      userId,
      recommendationImpact: recommendation?.impactValue,
      treesEarned: recommendation?.treesEarned,
      newTotalCarbon: user?.totalCarbonReduced,
      newTotalTrees: user?.totalTreesPlanted,
      newStreak: user?.streak,
    });

    return NextResponse.json({
      message: "✅ Recommendation completed",
      userStats: {
        carbonReduced: user?.totalCarbonReduced || 0,
        treesPlanted: user?.totalTreesPlanted || 0,
        streak: user?.streak || 0,
      },
    });
  } catch (error) {
    console.error("❌ Failed to complete recommendation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
