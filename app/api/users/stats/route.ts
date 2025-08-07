export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Users from "@/model/Users";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET user stats (carbon reduced, trees planted, streak)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    await connectToDatabase();
    const user = await Users.findById(decoded.id).select(
      "totalCarbonReduced totalTreesPlanted streak"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      carbonReduced: user.totalCarbonReduced || 0,
      treesPlanted: user.totalTreesPlanted || 0,
      streak: user.streak || 0,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update user stats (when completing recommendations)
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const body = await request.json();
    const { carbonReduced, treesPlanted, incrementStreak } = body;

    await connectToDatabase();
    const user = await Users.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user stats
    if (carbonReduced !== undefined) {
      user.totalCarbonReduced = (user.totalCarbonReduced || 0) + carbonReduced;
    }

    if (treesPlanted !== undefined) {
      user.totalTreesPlanted = (user.totalTreesPlanted || 0) + treesPlanted;
    }

    if (incrementStreak) {
      user.streak = (user.streak || 0) + 1;
    }

    await user.save();

    return NextResponse.json({
      carbonReduced: user.totalCarbonReduced,
      treesPlanted: user.totalTreesPlanted,
      streak: user.streak,
    });
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
