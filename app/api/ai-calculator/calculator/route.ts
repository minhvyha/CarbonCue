import { NextResponse } from 'next/server';
import { z } from 'zod';
import calculateCO2 from './calculator';
import { createClient } from '@/lib/supabase/server';
import { apiError, ApiError } from '@/lib/api';
const schema = z.object({ gpu: z.string().min(1), provider: z.string().nullable().default(null), region: z.string().nullable().default(null), hours: z.number().finite().positive().max(100000), customImpact: z.number().finite().min(0).nullable().default(null), customOffset: z.number().finite().min(0).max(100).nullable().default(null) });
export async function POST(request: Request) {
  try {
    const values = schema.parse(await request.json());
    const supabase = await createClient();
    const gpuResult = await supabase.from('gpus').select('watt').eq('name', values.gpu).maybeSingle();
    if (gpuResult.error) throw gpuResult.error;
    const regionResult = values.provider && values.region ? await supabase.from('provider_regions').select('*').eq('provider_name', values.provider).eq('region_name', values.region).maybeSingle() : { data: null, error: null };
    if (regionResult.error) throw regionResult.error;
    let result;
    try {
      result = await calculateCO2(values, { gpu: gpuResult.data, provider: regionResult.data ? { regions: new Map([[regionResult.data.region_name, { impact: regionResult.data.impact, offsetRatio: regionResult.data.offset_ratio }]]) } : null });
    } catch (error) { throw new ApiError(error instanceof Error ? error.message : 'Invalid calculation'); }
    return NextResponse.json(result);
  } catch (error) { return apiError(error); }
}
