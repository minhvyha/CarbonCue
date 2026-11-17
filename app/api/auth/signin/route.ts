import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiError, ApiError } from '@/lib/api';
export async function POST(request: Request) {
  try {
    const input = z.object({ email: z.string().email().transform(v => v.trim().toLowerCase()), password: z.string().min(1) }).parse(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(input);
    if (error) throw new ApiError(error.message, 401);
    return NextResponse.json({ message: 'Login successful' });
  } catch (error) { return apiError(error); }
}
