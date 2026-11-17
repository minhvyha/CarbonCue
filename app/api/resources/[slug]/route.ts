import { NextResponse } from 'next/server';
import { getResource } from '@/lib/supabase/resources';
import { apiError, ApiError } from '@/lib/api';
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resource = await getResource('course', (await params).slug);
    if (!resource) throw new ApiError('Course not found', 404);
    return NextResponse.json(resource);
  } catch (error) { return apiError(error); }
}
