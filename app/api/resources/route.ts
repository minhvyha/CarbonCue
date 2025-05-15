export const dynamic = 'force-dynamic';


// app/api/resources/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/model/Users';

export async function GET() {
  // 1) connect
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) try an unfiltered find
  const all = await User.find({});
  console.log(`Found ${all.length} total users`);

  // 3) then your filter
  const filtered = await User.find({ email: 'minhyv.ha@outlook.com' }).lean();
  console.log(`Found ${filtered.length} users matching your email`);

  // 4) return both sets so you can inspect in the browser
  return NextResponse.json({ total: all });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log('POST body:', body);

  // 1) connect
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) create a new user
  const newUser = new User(body);
  await newUser.save();

  // 3) return the new user
  return NextResponse.json(newUser);
}
