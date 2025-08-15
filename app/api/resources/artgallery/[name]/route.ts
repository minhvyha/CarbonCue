export const dynamic = 'force-dynamic';

// app/api/resources/[slug]/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import ArtPieces from '@/model/ArtPieces';
export async function GET(
  _req: Request,
  { params }: { params: { name: string } }
) {
  // 1) connect to MongoDB
  const conn = await connectToDatabase();
  console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

  // 2) find the guide by slug
  const { name } = await params;
  const artpiece = await ArtPieces.findOne({ title: name }).lean();

  if (!artpiece) {
    return NextResponse.json({ error: 'Art piece not found' }, { status: 404 });
  }

  // 3) return the found guide
  return NextResponse.json(artpiece);
}

