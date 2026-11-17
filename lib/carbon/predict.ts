import manifest from '@/public/models/vehicle-manifest.json';
import { calculateFactors } from './calculate';
import { activitySchema, type ActivityInput, type Prediction } from './schema';
import { runTreeModel, type TreeModel } from './tree-model';
export function requiresModel(activity: ActivityInput) {
  return activity.input.activityType==='transportation' && activity.input.mode==='car' && activity.input.litresPer100Km===undefined;
}
export function predictActivity(raw: ActivityInput, model?: TreeModel): Prediction {
  const activity=activitySchema.parse(raw);
  if (!requiresModel(activity)) return calculateFactors(activity);
  const input=activity.input;
  if(input.activityType!=='transportation' || !model) throw new Error('The local model is unavailable. Enter measured fuel consumption or try again.');
  for (const [key, range] of Object.entries(manifest.ranges)) {
    const value = input[key as 'year'|'engineLitres'|'cylinders'];
    if (value < range[0] || value > range[1]) throw new Error(`Vehicle ${key} is outside the model's training range. Enter measured fuel consumption instead.`);
  }
  const features=[input.year,input.engineLitres,input.cylinders,Number(input.fuel==='diesel'),Number(input.fuel==='hybrid'),Number(input.awd),Number(input.automatic),Number(input.vehicleClass==='suv'),Number(input.vehicleClass==='truck'),Number(input.vehicleClass==='van')];
  const rate=runTreeModel(model,features);
  const multiplier=input.distanceKm/1000/input.occupancy;
  const kgCo2e=Math.max(0,rate)*multiplier;
  const width=manifest.test.interval_half_width_g_per_km;
  return { kgCo2e:Number(kgCo2e.toFixed(6)),method:'ml',modelVersion:manifest.version,factorVersion:'carboncue-factors-2026-v1',
    summary:"Vehicle specification estimate",boundary:manifest.boundary,
    warnings:[manifest.population,`Held-out mean absolute error: ${manifest.test.mae_g_per_km.toFixed(1)} g CO2/km. Reference interval coverage on held-out data: ${(manifest.test.empirical_interval_coverage*100).toFixed(1)}%; this is not a guarantee for your vehicle.`],
    intervalKg:[Math.max(0,rate-width)*multiplier,(rate+width)*multiplier] };
}
export { manifest };
