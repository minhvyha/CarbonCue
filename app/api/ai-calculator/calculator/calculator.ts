export interface CalculateCO2Input {
  gpu: string;
  hours: number;
  provider: string | null;
  region: string | null;
  // UI and reference data use grams CO2e per kWh.
  customImpact: number | null;
  customOffset: number | null;
}

export interface CalculateCO2Result {
  energy: number;
  impact: number;
  co2: number;
  offset: number;
  offsetPercents: number;
}

type Region = { impact?: number; offsetRatio?: string | number };
type CalculatorData = {
  gpu: { watt: number } | null;
  provider: { regions: Map<string, Region> | Record<string, Region> } | null;
};

export default async function calculateCO2(
  values: CalculateCO2Input,
  data: CalculatorData
): Promise<CalculateCO2Result> {
  if (!data.gpu) throw new Error("GPU not found.");
  if (!Number.isFinite(values.hours) || values.hours <= 0 || values.hours > 100000) {
    throw new Error("GPU hours must be greater than zero and at most 100000.");
  }
  const regions = data.provider?.regions;
  const region = values.region
    ? regions instanceof Map ? regions.get(values.region) : regions?.[values.region]
    : undefined;
  if (values.provider && (!data.provider || !region)) {
    throw new Error("Provider or region not found.");
  }
  const gramsPerKwh = values.customImpact ?? region?.impact;
  const offsetPercent = values.customOffset ?? Number(region?.offsetRatio ?? 0);
  if (typeof gramsPerKwh !== "number" || !Number.isFinite(gramsPerKwh) || gramsPerKwh < 0) {
    throw new Error("Carbon intensity must be a non-negative number in g CO2e/kWh.");
  }
  if (!Number.isFinite(offsetPercent) || offsetPercent < 0 || offsetPercent > 100) {
    throw new Error("Offset ratio must be between 0 and 100 percent.");
  }
  const round = (n: number) => Number(n.toFixed(6));
  const energy = data.gpu.watt * values.hours / 1000;
  const impact = gramsPerKwh / 1000;
  const co2 = energy * impact;
  return { energy: round(energy), impact: round(impact), co2: round(co2),
    offset: round(co2 * offsetPercent / 100), offsetPercents: offsetPercent };
}
