export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import Users from "@/model/Users";
import jwt from "jsonwebtoken";

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
    const savedUser = await newUser.save();

    // 5) generate JWT token and set cookie (same as signin)
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
