import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/getCurrentUser';
import { apiError } from '@/lib/api';
export async function GET() {
  try { return NextResponse.json(await requireUser()); }
  catch (error) { return apiError(error); }
}
