import { createClient } from './server';
export async function getUserStats() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('recommendation_completions').select('recommendations(impact_value,trees_earned)');
  if (error) throw error;
  return (data || []).reduce((stats, row) => ({
    carbonReduced: stats.carbonReduced + (row.recommendations?.impact_value || 0),
    treesPlanted: stats.treesPlanted + (row.recommendations?.trees_earned || 0), streak: stats.streak + 1,
  }), { carbonReduced: 0, treesPlanted: 0, streak: 0 });
}
