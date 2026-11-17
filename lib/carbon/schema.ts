import { z } from 'zod';
const nonnegative = z.number().finite().min(0);
const transport = z.object({
  activityType: z.literal('transportation'), mode: z.enum(['car','electric_car','walk_bicycle']), distanceKm: nonnegative.max(20000),
  fuel: z.enum(['petrol','diesel','hybrid']).default('petrol'), litresPer100Km: z.number().finite().positive().max(80).optional(),
  year: z.number().int().min(2013).max(2026).default(2020), engineLitres: z.number().min(.6).max(8.4).default(2),
  cylinders: z.number().int().min(2).max(16).default(4), awd: z.boolean().default(false), automatic: z.boolean().default(true),
  vehicleClass: z.enum(['car','suv','truck','van']).default('car'), occupancy: z.number().int().min(1).max(20).default(1),
  kwhPer100Km: z.number().positive().max(100).default(18),
});
const energy = z.object({ activityType: z.literal('home_energy'), electricityKwh: nonnegative.max(10000), gasMj: nonnegative.max(100000).default(0), householdShare: z.number().positive().max(1).default(1) });
const food = z.object({ activityType: z.literal('food_diet'), food: z.string().min(1), quantityKg: nonnegative.max(100) });
const shopping = z.object({ activityType: z.literal('shopping'), kind: z.enum(['landfill','product']), quantity: nonnegative.max(10000), productKgCo2e: nonnegative.max(100000).default(0), productSource: z.string().max(500).default('') }).refine(v => v.kind === 'landfill' || (v.productKgCo2e > 0 && v.productSource.trim().length > 0), { message: 'Enter the product footprint and its source.' });
const digital = z.object({ activityType: z.literal('digital_usage'), hours: nonnegative.max(24), watts: nonnegative.max(10000) });
export const activitySchema = z.object({
  input: z.discriminatedUnion('activityType', [transport, energy, food, shopping.innerType(), digital]),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => { const date = new Date(`${v}T12:00:00Z`); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === v; }, 'Enter a valid date.'),
  region: z.enum(['NSW','ACT','VIC','QLD','SA','WA-SWIS','WA-NWIS','TAS','NT','AU']).default('NSW'),
  timezone: z.string().max(100).default('Australia/Sydney').refine(v => { try { new Intl.DateTimeFormat('en',{timeZone:v}); return true; } catch { return false; } }, 'Invalid timezone.'),
  notes: z.string().max(2000).default(''),
}).superRefine((value, ctx) => {
  const i = value.input;
  if (i.activityType === 'shopping' && i.kind === 'product' && (!i.productSource.trim() || i.productKgCo2e <= 0)) ctx.addIssue({ code:'custom', path:['input','productSource'], message:'Provide the product footprint and its source.' });
});
export type ActivityInput = z.infer<typeof activitySchema>;
export type TransportInput = z.infer<typeof transport>;
export type Prediction = {
  kgCo2e: number; method: 'factor' | 'ml'; modelVersion: string | null; factorVersion: string;
  summary: string; boundary: string; warnings: string[]; intervalKg?: [number, number];
};
