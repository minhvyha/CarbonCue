export const dynamic = 'force-dynamic';

// app/api/resources/[slug]/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Guide from '@/model/Guide';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  // 1) connect to MongoDB
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) find the guide by slug
  const { slug } = await params;
  const guide = await Guide.findOne({ slug }).lean();

  if (!guide) {
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }

  // 3) return the found guide
  return NextResponse.json(guide);
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

  // 2) create or update guide by slug
  const { slug } = params;
  let guide = await Guide.findOneAndUpdate(
    { slug },
    body,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // 3) return the new or updated guide
  return NextResponse.json(guide);
}
