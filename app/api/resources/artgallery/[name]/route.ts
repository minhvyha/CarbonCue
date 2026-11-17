import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getResource } from '@/lib/supabase/resources';
import { getCurrentUser, requireUser } from '@/lib/getCurrentUser';
import { apiError, ApiError } from '@/lib/api';
type Context = { params: Promise<{ name: string }> };
async function artwork(name: string) {
  const resource = await getResource('art', name, true);
  if (!resource) throw new ApiError('Artwork not found', 404);
  return resource;
}
async function likes(resourceId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const [stats, own] = await Promise.all([
    supabase.from('artwork_stats').select('likes_count').eq('resource_id', resourceId).maybeSingle(),
    user ? supabase.from('artwork_likes').select('resource_id').eq('resource_id', resourceId) : Promise.resolve({ data: [], error: null }),
  ]);
  if (stats.error) throw stats.error;
  if (own.error) throw own.error;
  return { likesCount: stats.data?.likes_count || 0, likes: user && own.data?.length ? [user._id] : [] };
}
export async function GET(_request: Request, { params }: Context) {
  try { const resource = await artwork((await params).name); return NextResponse.json({ ...resource, ...await likes(resource.id) }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request, { params }: Context) {
  try {
    await requireUser();
    const { action } = z.object({ action: z.enum(['add', 'remove']).default('add') }).parse(await request.json());
    const resource = await artwork((await params).name);
    const supabase = await createClient();
    const { error } = action === 'remove'
      ? await supabase.from('artwork_likes').delete().eq('resource_id', resource.id)
      : await supabase.from('artwork_likes').insert({ resource_id: resource.id });
    if (error && error.code !== '23505') throw error;
    return NextResponse.json({ success: true, ...await likes(resource.id) });
  } catch (error) { return apiError(error); }
}
