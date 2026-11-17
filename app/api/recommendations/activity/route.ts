import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/getCurrentUser';
import { apiError } from '@/lib/api';
export async function GET() {
  try {
    await requireUser();
    const supabase = await createClient();
    const { data, error } = await supabase.from('recommendation_completions').select('*').order('completed_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) { return apiError(error); }
}
