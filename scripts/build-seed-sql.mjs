import { readFile, writeFile } from 'node:fs/promises';
const seed = JSON.parse(await readFile('data/public-seed.json','utf8'));
const definitions = {
 model_versions: ['version text, method text, metadata jsonb','version'],
 emission_factor_versions: ['version text, metadata jsonb','version'],
 gpus: ['name text, watt double precision', 'name'],
 providers: ['name text, provider_name text','name'],
 provider_regions: ['provider_name text, region_name text, country text, impact double precision, offset_ratio double precision, source text','provider_name, region_name'],
 resources: ['type text, slug text, title text, content jsonb','type, slug'],
 recommendations: ['title text, description text, category text, impact text, impact_value double precision, difficulty text, trees_earned integer','title'],
};
let sql = '';
for (const [table, rows] of Object.entries(seed)) {
 const [definition, conflict] = definitions[table];
 const columns = Object.keys(rows[0]);
 const updates = columns.filter(c=>!conflict.split(', ').includes(c)).map(c=>`${c}=excluded.${c}`).join(', ');
 const payload=JSON.stringify(rows).replaceAll("'", "''");
 sql += `insert into public.${table} (${columns.join(', ')}) select ${columns.join(', ')} from jsonb_to_recordset('${payload}'::jsonb) as row(${definition}) on conflict (${conflict}) do update set ${updates};\n`;
}
await writeFile('supabase/seed.sql',sql);
console.log('Seed SQL prepared');
