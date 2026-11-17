import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/getCurrentUser';
import { getUserStats } from '@/lib/supabase/stats';
import { apiError } from '@/lib/api';
export async function POST(request: Request) {
  try {
    await requireUser();
    const { recommendationId } = z.object({ recommendationId: z.string().uuid() }).parse(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.from('recommendation_completions').insert({ recommendation_id: recommendationId });
    if (error && error.code !== '23505') throw error;
    return NextResponse.json({ message: 'Recommendation completed', userStats: await getUserStats() });
  } catch (error) { return apiError(error); }
}
