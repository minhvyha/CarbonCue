export const dynamic = "force-dynamic";

// app/api/resources/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Users from "@/model/Users";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
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
    const user = await Users.findById(decoded.id).select("-password");
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("POST body:", body);

  // 1) connect
  const conn = await connectToDatabase();
  console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

  // 2) create a new user
  const newUser = new Users(body);
  await newUser.save();

  // 3) return the new user
  return NextResponse.json(newUser);
}
