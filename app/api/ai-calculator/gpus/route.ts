import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api';
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('gpus').select('name').order('name');
    if (error) throw error;
    return NextResponse.json({ gpus: data.map(r => r.name) });
  } catch (error) { return apiError(error); }
}
