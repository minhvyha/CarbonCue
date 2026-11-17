import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import { activityDateToday } from '@/lib/carbon/calculate';
import { apiError } from '@/lib/api';
export async function GET(request: Request) {
  try {
    await requireUser();
    const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(new URL(request.url).searchParams.get('date') || activityDateToday());
    const supabase=await createClient();
    const {data,error}=await supabase.from('activity_logs').select('activity_type,prediction').eq('activity_date',date);
    if(error)throw error;
    const totals=new Map<string,number>();
    data.forEach(r=>totals.set(r.activity_type,(totals.get(r.activity_type)||0)+r.prediction));
    return NextResponse.json({total_emissions_based_categories:[...totals].map(([activityType,totalEmissions])=>({activityType,totalEmissions:Number(totalEmissions.toFixed(6))}))});
  } catch(error){return apiError(error);}
}
