import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api';
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('providers').select('*').order('provider_name');
    if (error) throw error;
    return NextResponse.json({ providers: data.map(r => ({ name: r.name, providerName: r.provider_name })) });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    const { providerName } = z.object({ providerName: z.string().min(1) }).parse(await request.json());
    const supabase = await createClient();
    const { data, error } = await supabase.from('provider_regions').select('*').eq('provider_name', providerName).order('region_name');
    if (error) throw error;
    return NextResponse.json({ regions: data.map(r => ({ regionName: r.region_name, country: r.country, impact: r.impact, offsetRatio: r.offset_ratio, source: r.source })) });
  } catch (error) { return apiError(error); }
}
