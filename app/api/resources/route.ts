import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourceRecord } from '@/lib/supabase/resources';
import { apiError } from '@/lib/api';
export async function GET() {
  try {
    const supabase = await createClient();
    const [resources, stats] = await Promise.all([supabase.from('resources').select('*').order('title'), supabase.from('artwork_stats').select('*')]);
    if (resources.error) throw resources.error;
    if (stats.error) throw stats.error;
    const counts = new Map(stats.data.map(r => [r.resource_id, r.likes_count]));
    return NextResponse.json(resources.data.map(r => ({ ...resourceRecord(r), likes: [], likesCount: counts.get(r.id) || 0 })));
  } catch (error) { return apiError(error); }
}
