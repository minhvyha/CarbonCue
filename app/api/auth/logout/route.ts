import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api';
export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.delete('token');
    return response;
  } catch (error) { return apiError(error); }
}
