import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/getCurrentUser';
import { getUserStats } from '@/lib/supabase/stats';
import { apiError } from '@/lib/api';
export async function GET() {
  try { await requireUser(); return NextResponse.json(await getUserStats()); }
  catch (error) { return apiError(error); }
}
