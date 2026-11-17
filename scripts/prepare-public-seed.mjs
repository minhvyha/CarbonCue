import { readFile, writeFile } from 'node:fs/promises';
const catalogue = JSON.parse(await readFile('app/api/ai-calculator/data.json', 'utf8'));
const base=process.env.CARBONCUE_SOURCE_URL || 'https://carboncue.vercel.app';
const resourceResponse=await fetch(`${base}/api/resources`);
if(!resourceResponse.ok) throw new Error('Public resource export failed');
const resourceList=await resourceResponse.json();
const resources = [];
for (const item of resourceList.filter(r => r.type && r.title)) {
  let data = item;
  if (['guide','course'].includes(item.type)) {
    const response=await fetch(`${base}/api/resources/${item.type==='guide'?'guide/':''}${encodeURIComponent(item.slug)}`);
    if(!response.ok) throw new Error('Resource detail export failed');
    data=await response.json();
  }
  if (item.type === 'art') {
    const response = await fetch(`${base}/api/resources/artgallery/${encodeURIComponent(item.title)}`);
    if (!response.ok) throw new Error('Artwork export failed');
    data = await response.json();
  }
  const { _id, likes, likesCount, views, __v, ...content } = data;
  const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  resources.push({ type: item.type, slug, title: item.title, content });
}
const names = { gcp: 'Google Cloud Platform', aws: 'Amazon Web Services', azure: 'Microsoft Azure', ovh: 'OVHcloud', scaleway: 'Scaleway', coreweave: 'CoreWeave', seeweb: 'Seeweb' };
const providers = Object.entries(catalogue.providers).map(([name]) => ({ name, provider_name: names[name] || name }));
const regions = Object.entries(catalogue.providers).flatMap(([provider_name, values]) => Object.entries(values).filter(([key, value]) => key !== '__min' && value.regionName !== undefined && Number.isFinite(value.impact)).map(([key, value]) => ({ provider_name, region_name: value.regionName || key, country: value.country || '', impact: value.impact, offset_ratio: Number(value.offsetRatio || 0), source: value.source || '' })));
const recommendations = JSON.parse(await readFile('public/recommendation_seed_data_no_id.json', 'utf8')).map(r => ({ title: r.title, description: r.description.replaceAll('\u2014', ','), category: r.category, impact: r.impact, impact_value: r.impactValue, difficulty: r.difficulty, trees_earned: r.treesEarned }));
const previous=JSON.parse(await readFile('data/public-seed.json','utf8').catch(()=>'{"model_versions":[],"emission_factor_versions":[]}'));
const seed = { model_versions:previous.model_versions, emission_factor_versions:previous.emission_factor_versions, gpus: Object.entries(catalogue.gpus).map(([name, value]) => ({ name, watt: value.watt })), providers, provider_regions: regions, resources, recommendations };
await writeFile('data/public-seed.json', JSON.stringify(seed, null, 2) + '\n');
console.log(Object.fromEntries(Object.entries(seed).map(([k,v])=>[k,v.length])));
