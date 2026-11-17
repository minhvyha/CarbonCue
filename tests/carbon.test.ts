import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { activitySchema, type ActivityInput } from '../lib/carbon/schema';
import { calculateFactors } from '../lib/carbon/calculate';
import { predictActivity } from '../lib/carbon/predict';
import { runTreeModel } from '../lib/carbon/tree-model';
import runtime from '../public/models/vehicle-runtime.json';
import fixture from '../public/models/vehicle-fixtures.json';

const activity=(input:unknown)=>activitySchema.parse({input,activityDate:'2026-11-17',region:'NSW'});
test('electricity, food, landfill, and device calculations keep daily quantities and units',()=>{
  assert.equal(calculateFactors(activity({activityType:'home_energy',electricityKwh:10})).kgCo2e,6.7);
  assert.equal(calculateFactors(activity({activityType:'digital_usage',hours:2,watts:50})).kgCo2e,.067);
  assert.equal(calculateFactors(activity({activityType:'shopping',kind:'landfill',quantity:2})).kgCo2e,3);
  const food=calculateFactors(activity({activityType:'food_diet',food:'Poultry Meat',quantityKg:1}));
  assert.ok(food.kgCo2e>0);assert.equal(food.method,'factor');
});
test('measured fuel consumption uses fuel factors and does not silently run a model',()=>{
  const input=activity({activityType:'transportation',mode:'car',distanceKm:100,fuel:'petrol',litresPer100Km:10,occupancy:2});
  const result=predictActivity(input,runtime);assert.equal(result.method,'factor');assert.equal(result.kgCo2e,14.50422);
});
test('vehicle numeric export matches held-out native/ONNX fixtures',()=>{
  fixture.features.forEach((features,i)=>assert.ok(Math.abs(runTreeModel(runtime,features)-fixture.expected[i])<.01));
});
test('vehicle inference scales by distance and occupancy and keeps its scope explicit',()=>{
  const a=activity({activityType:'transportation',mode:'car',distanceKm:10});
  const result=predictActivity(a,runtime);
  const longer=predictActivity(activity({...a.input,distanceKm:20}),runtime);
  assert.ok(Math.abs(longer.kgCo2e-result.kgCo2e*2)<.000002);
  assert.equal(result.method,'ml');assert.match(result.boundary,/Tailpipe CO2 only/);assert.equal(result.modelVersion,'epa-vehicle-v1');
  assert.ok(result.intervalKg![0]<=result.kgCo2e&&result.intervalKg![1]>=result.kgCo2e);
});
test('invalid dates, negative values, unsupported model years, unknown food and unreferenced products fail',()=>{
  assert.throws(()=>activitySchema.parse({input:{activityType:'digital_usage',hours:1,watts:50},activityDate:'2026-02-30'}));
  assert.throws(()=>activity({activityType:'home_energy',electricityKwh:-1}));
  assert.throws(()=>activity({activityType:'transportation',mode:'car',distanceKm:1,year:2000}));
  assert.throws(()=>calculateFactors(activity({activityType:'food_diet',food:'unknown',quantityKg:1})));
  assert.throws(()=>activity({activityType:'shopping',kind:'product',quantity:1,productKgCo2e:1}));
});
test('ONNX WebAssembly runtime agrees with the compact browser export',async()=>{
  const ort=await import('onnxruntime-web');ort.env.wasm.numThreads=1;
  const bytes=await readFile(new URL('../public/models/vehicle-v1.onnx',import.meta.url));
  const session=await ort.InferenceSession.create(new Uint8Array(bytes),{executionProviders:['wasm']});
  const features=fixture.features.flat();
  const result=await session.run({[session.inputNames[0]]:new ort.Tensor('float32',Float32Array.from(features),[fixture.features.length,10])});
  const predictions=Array.from(result[session.outputNames[0]].data as Float32Array);
  predictions.forEach((value,i)=>assert.ok(Math.abs(value-runTreeModel(runtime,fixture.features[i]))<.01));
  await session.release();
});
