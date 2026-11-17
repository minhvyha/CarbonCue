import { createClient } from './supabase/server';
import { ApiError } from './api';
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { _id: user.id, name: String(user.user_metadata?.name || 'CarbonCue member'), email: user.email || '' };
}
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new ApiError('Please sign in to continue.', 401);
  return user;
}
