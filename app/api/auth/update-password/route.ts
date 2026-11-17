import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/getCurrentUser';
import { apiError } from '@/lib/api';
export async function POST(request: Request) {
  try {
    await requireUser();const {password}=z.object({password:z.string().min(8).max(128)}).parse(await request.json());
    const supabase=await createClient();const {error}=await supabase.auth.updateUser({password});
    if(error)throw error;
    return NextResponse.json({message:'Password updated. You can now sign in with your new password.'});
  } catch(error){return apiError(error);}
}
