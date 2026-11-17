import { createClient } from './server';
import type { Json, Database } from './database.types';
export type ResourceType = Database['public']['Tables']['resources']['Row']['type'];
export function resourceRecord(row: Database['public']['Tables']['resources']['Row']) {
  const content = row.content && typeof row.content === 'object' && !Array.isArray(row.content) ? row.content : {};
  return { ...content, _id: row.id, id: row.id, type: row.type, slug: row.slug, title: row.title } as Record<string, any>;
}
export async function getResource(type: ResourceType, identifier: string, byTitle = false) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('resources').select('*').eq('type', type).eq(byTitle ? 'title' : 'slug', identifier).maybeSingle();
  if (error) throw error;
  return data ? resourceRecord(data) : null;
}
