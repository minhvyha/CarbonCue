export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import Users from "@/model/Users";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await connectToDatabase(); // connect to database

    const user = await Users.findOne({ email }); // find user by email
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // compare password
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    }); // generate token

    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
