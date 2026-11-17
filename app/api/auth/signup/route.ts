import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiError, ApiError } from '@/lib/api';
export async function POST(request: Request) {
  try {
    const { name, email, password } = z.object({ name: z.string().trim().min(1).max(120), email: z.string().email(), password: z.string().min(8).max(128) }).parse(await request.json());
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const { data, error } = await supabase.auth.signUp({ email: email.toLowerCase(), password, options: { data: { name }, emailRedirectTo: `${origin}/auth/confirm` } });
    if (error) throw new ApiError(error.message, 400);
    return NextResponse.json({ message: data.session ? 'Account created.' : 'Check your email to confirm your account before signing in.', requiresConfirmation: !data.session });
  } catch (error) { return apiError(error); }
}
