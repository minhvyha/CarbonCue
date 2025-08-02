export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import Users from "@/model/Users";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // 1) connect
  try {
    const conn = await connectToDatabase();
    console.log("Mongo readyState:", conn.connection.readyState); // 1 = connected

    // 2) check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 3) hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) create a new user
    const newUser = new Users({ name, email, password: hashedPassword });
    await newUser.save();

    // 5) return the new user
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
