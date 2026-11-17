import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api';
export async function GET(request: Request) {
  try {
    await requireUser();
    const year=z.coerce.number().int().min(2000).max(2100).parse(new URL(request.url).searchParams.get('year') || new Date().getFullYear());
    const supabase=await createClient();
    const {data,error}=await supabase.from('activity_logs').select('activity_date,prediction').gte('activity_date',`${year}-01-01`).lte('activity_date',`${year}-12-31`);
    if(error)throw error;
    const totals=new Map<number,number>();
    data.forEach(r=>{const month=Number(r.activity_date.slice(5,7));totals.set(month,(totals.get(month)||0)+r.prediction);});
    return NextResponse.json({totalEmissions:[...totals].sort((a,b)=>a[0]-b[0]).map(([month,totalEmissions])=>({month,totalEmissions:Number(totalEmissions.toFixed(6))}))});
  } catch(error){return apiError(error);}
}
