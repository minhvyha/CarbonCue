import factors from '@/data/emission-factors.json';
import { activitySchema, type ActivityInput, type Prediction } from './schema';
export { factors };
export function calculateFactors(raw: ActivityInput): Prediction {
  const activity = activitySchema.parse(raw);
  const input = activity.input;
  const electricity = factors.electricity[activity.region].kgPerKwh;
  let kgCo2e = 0, summary = '', boundary = '';
  const warnings: string[] = [];
  switch (input.activityType) {
    case 'transportation': {
      if (input.mode === 'walk_bicycle') { summary='Walking / cycling'; boundary='Operational energy only; excludes food and equipment production.'; break; }
      if (input.mode === 'electric_car') { kgCo2e=input.distanceKm*input.kwhPer100Km/100*electricity/input.occupancy; summary='Electric vehicle electricity'; boundary='Location-based electricity scope 2 and 3; excludes vehicle manufacturing.'; break; }
      if (input.litresPer100Km === undefined) throw new Error('Vehicle specifications require the local ML model. Enter fuel consumption to use a factor calculation.');
      const fuel=factors.fuel[input.fuel==='diesel'?'diesel':'petrol'];
      kgCo2e=input.distanceKm*input.litresPer100Km/100*(fuel.kgPerLitre+fuel.upstreamKgPerLitre)/input.occupancy;
      summary='Fuel consumption calculation'; boundary='Fuel combustion and upstream fuel production; excludes vehicle manufacturing.'; break;
    }
    case 'home_energy':
      kgCo2e=(input.electricityKwh*electricity+input.gasMj*factors.naturalGasKgPerMj)*input.householdShare;
      summary='Household energy'; boundary='Electricity scope 2 and 3 plus gas combustion. Gas upstream emissions are excluded.'; break;
    case 'food_diet': {
      const food=factors.foods[input.food as keyof typeof factors.foods];
      if (!food) throw new Error('Select a supported food.');
      kgCo2e=input.quantityKg*food.kgPerKg; summary=`${input.quantityKg} kg ${input.food}`;
      boundary='Global average food lifecycle estimate from 2018 data; includes supply-chain losses.';
      warnings.push('Food production varies by producer and location. This global reference is not a measurement of your purchase.'); break;
    }
    case 'shopping':
      kgCo2e=input.kind==='landfill'?input.quantity*factors.landfillKgPerKg:input.quantity*input.productKgCo2e;
      summary=input.kind==='landfill'?'Municipal waste to landfill':'Product footprint supplied by you';
      boundary=input.kind==='landfill'?'Australian municipal landfill estimate; excludes collection and product production.':`User-supplied product footprint: ${input.productSource}`; break;
    case 'digital_usage':
      kgCo2e=input.hours*input.watts/1000*electricity;
      summary='Device electricity'; boundary='Device electricity scope 2 and 3 only. Networks, data centres, and manufacturing are excluded.'; break;
  }
  return { kgCo2e: Number(kgCo2e.toFixed(6)), method:'factor', modelVersion:null, factorVersion:factors.version, summary, boundary, warnings };
}
export function activityDateToday(timezone = 'Australia/Sydney') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
}
