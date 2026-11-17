import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api';
export async function POST(request: Request) {
  try {
    const {email}=z.object({email:z.string().email()}).parse(await request.json());
    const supabase=await createClient();
    const origin=process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${origin}/auth/confirm?next=/reset-password`});
    if(error)throw error;
    return NextResponse.json({message:'If that account exists, a password reset email has been sent.'});
  } catch(error){return apiError(error);}
}
