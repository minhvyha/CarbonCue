/**
 * Reads configuration from data.json (GPU info and cloud providers).
 *
 * Main function:
 *   calculateCO2(values)
 *     Parameters:
 *       {
 *         gpu: string,           // GPU name
 *         hours: number,         // Usage hours
 *         provider: string | null,      // Cloud provider name (e.g., "gcp", "aws", ...) or null if using customImpact
 *         region: string | null,        // Provider region or null if using customImpact
 *         customImpact: number | null,  // (Optional) Custom emission factor (kg/kWh), if null uses provider/region value
 *         customOffset: number | null   // (Optional) Custom offset ratio (%), if null uses provider/region value
 *       }
 *     Returns:
 *       {
 *         energy: number,         // Power consumption (kWh)
 *         impact: number,         // Emission factor (kg/kWh)
 *         co2: number,            // CO2 emission (kg)
 *         offset: number,         // CO2 offset (kg)
 *         offsetPercents: number  // Offset ratio (%)
 *       }
 *     Throws Error if required fields are missing or invalid.
 *
 * Example usage:
 *   import calculateCO2 from './calculator';
 *   const result = calculateCO2({
 *     gpu: "AGX Xavier",
 *     provider: "gcp",
 *     region: "asia-east1",
 *     hours: 100,
 *     customImpact: null,
 *     customOffset: null
 *   });
 */

const twoDigits = (n: number): number => Number(Number(n).toFixed(2));
const toDigits = (n: number, d: number): number => Number(Number(n).toFixed(d));

export interface CalculateCO2Input {
  gpu: string;
  hours: number;
  provider: string | null;
  region: string | null;
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

export default async function calculateCO2(
  values: CalculateCO2Input,
  data: any
): Promise<CalculateCO2Result> {
  const { hours, region, customImpact, customOffset } = values;

  const gpu = data.gpu;
  const provider = data.provider;

  if (!provider) {
    throw new Error("Provider not found.");
  }
  if (!gpu) {
    throw new Error("GPU not found.");
  }
  const energy = twoDigits((gpu.watt * hours) / 1000); // kWh
  const impact =
    customImpact !== null && customImpact !== undefined
      ? customImpact / 1000
      : undefined;
  if (impact === null || impact === undefined || isNaN(impact)) {
    throw new Error("Impact value is missing or invalid.");
  }
  if (
    customOffset === null ||
    customOffset === undefined ||
    isNaN(customOffset)
  ) {
    throw new Error("Offset value is missing or invalid.");
  }
  const co2 = twoDigits(energy * impact);
  const offset = twoDigits((co2 * customOffset) / 100);
  const offsetPercents = twoDigits(customOffset);

  return { energy, impact, co2, offset, offsetPercents };
}

// =================================================
// fetch gpt example
// const response = await fetch('/api/sum', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ a: 5, b: 7 })
// });

// const data = await response.json();
// console.log(data.result); // Output: 12
// ------------------------------------------------
