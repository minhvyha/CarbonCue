import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=process.env.CARBONCUE_TEST_URL || 'http://127.0.0.1:3101';
const fixture=JSON.parse(fs.readFileSync('/tmp/carboncue-auth-fixture.json','utf8'));
let cookie='';
async function request(path,body,expected=200){
 const r=await fetch(root+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});
 const setCookie=r.headers.getSetCookie();if(setCookie.length)cookie=setCookie.map(v=>v.split(';')[0]).join('; ');
 const data=await r.json();assert.equal(r.status,expected,`${path}: ${JSON.stringify(data)}`);return data;
}
for(const path of ['/website-calculator','/ai-calculator','/carbon-tracker','/volunteer-hub','/resources','/forgot-password','/methodology'])assert.equal((await fetch(root+path)).status,200,path);
assert.equal((await request('/api/ai-calculator/gpus')).gpus.length,45);
assert.equal((await request('/api/resources')).length,11);
const region=await request('/api/ai-calculator/providers',{providerName:'gcp'});assert.ok(region.regions.length>0);
const calculation=await request('/api/ai-calculator/calculator',{gpu:'AGX Xavier',provider:'gcp',region:'asia-east1',hours:100,customImpact:null,customOffset:null});assert.equal(calculation.co2,1.671);
await request('/api/auth/signin',{email:fixture.emails[0],password:fixture.password});
assert.ok((await request('/api/users'))._id);
const activity={input:{activityType:'transportation',mode:'car',distanceKm:10},activityDate:'2026-11-17',region:'NSW',notes:'Temporary automated verification'};
const saved=await request('/api/activity-tracker',activity,201);assert.equal(saved.prediction.method,'ml');assert.ok(saved.prediction.kgCo2e>0);
const forged=await request('/api/activity-tracker',{...activity,prediction:{kgCo2e:999999},method:'factor'},201);assert.equal(forged.prediction.kgCo2e,saved.prediction.kgCo2e);
assert.ok((await request('/api/activity-tracker/categories?date=2026-11-17')).total_emissions_based_categories.length>0);
assert.ok((await request('/api/activity-tracker/trends?year=2026')).totalEmissions.length>0);
const resources=await request('/api/resources');
for(const r of resources.filter(r=>['course','guide','art'].includes(r.type))){
 const path=r.type==='course'?`/resources/course/${encodeURIComponent(r.slug)}`:r.type==='guide'?`/resources/guide/${encodeURIComponent(r.slug)}`:`/resources/art/${encodeURIComponent(r.title)}`;
 const apiPath=r.type==='course'?`/api/resources/${encodeURIComponent(r.slug)}`:r.type==='guide'?`/api/resources/guide/${encodeURIComponent(r.slug)}`:`/api/resources/artgallery/${encodeURIComponent(r.title)}`;
 await request(apiPath);
 assert.equal((await fetch(root+path)).status,200,path);
}
await request('/api/auth/logout',{});
await request('/api/users',undefined,401);
console.log('PASS: feature pages, Supabase references/resources, AI calculator, cookie authentication, ML save/recalculation, daily/monthly reports, resource details, and logout.');
