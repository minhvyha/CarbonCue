export const dynamic = 'force-dynamic';

// app/api/resources/[slug]/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Course from '@/model/Course';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  // 1) connect to MongoDB
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) find the course by slug
  const { slug } = await params;
  const course = await Course.findOne({ slug }).lean();

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  // 3) return the found course
  return NextResponse.json(course);
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  console.log('POST body:', body);

  // 1) connect
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) create or update course by slug
  const { slug } = params;
  let course = await Course.findOneAndUpdate(
    { slug },
    body,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // 3) return the new or updated course
  return NextResponse.json(course);
}
