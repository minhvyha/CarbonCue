import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { apiError } from '@/lib/api';
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recommendations').select('*').order('title');
    if (error) throw error;
    const user = await getCurrentUser();
    const completion = user ? await supabase.from('recommendation_completions').select('recommendation_id') : { data: [], error: null };
    if (completion.error) throw completion.error;
    const completed = new Set(completion.data?.map(r => r.recommendation_id));
    return NextResponse.json((data || []).map(r => ({ ...r, _id: r.id, impactValue: r.impact_value, treesEarned: r.trees_earned, completed: completed.has(r.id) })));
  } catch (error) { return apiError(error); }
}
