import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import { activitySchema } from '@/lib/carbon/schema';
import { predictOnServer } from '@/lib/carbon/server-predictor';
import { apiError, ApiError } from '@/lib/api';
import type { Json } from '@/lib/supabase/database.types';
export async function POST(request: Request) {
  try {
    await requireUser();
    const activity=activitySchema.parse(await request.json());
    let prediction;
    try { prediction=predictOnServer(activity); } catch(error) { throw new ApiError(error instanceof Error?error.message:'Invalid activity.'); }
    const supabase=await createClient();
    const { data, error }=await supabase.from('activity_logs').insert({ activity_type:activity.input.activityType, activity_details:activity as unknown as Json,
      prediction:prediction.kgCo2e,method:prediction.method,model_version:prediction.modelVersion,factor_version:prediction.factorVersion,
      activity_date:activity.activityDate,timezone:activity.timezone,notes:activity.notes }).select().single();
    if(error)throw error;
    return NextResponse.json({message:'Activity saved.',saved:data,prediction},{status:201});
  } catch(error){return apiError(error);}
}
export async function GET() {
  try {
    await requireUser();const supabase=await createClient();
    const { data,error }=await supabase.from('activity_logs').select('*').order('activity_date',{ascending:false}).limit(500);
    if(error)throw error;
    return NextResponse.json({activityLogs:data});
  } catch(error){return apiError(error);}
}
