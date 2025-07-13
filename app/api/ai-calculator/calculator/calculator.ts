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

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const twoDigits = (n: number): number => Number(Number(n).toFixed(2));
const toDigits = (n: number, d: number): number => Number(Number(n).toFixed(d));

function loadData(fileName: string): any {
    const filePath = join(__dirname, fileName);
    const fileContent = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
}

const data = loadData('../data.json');

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

export default function calculateCO2(values: CalculateCO2Input): CalculateCO2Result {
    const { gpu, hours, provider, region, customImpact, customOffset } = values;

    // Validate input
    if (
        typeof gpu !== 'string' ||
        typeof hours !== 'number' ||
        (provider !== null && typeof provider !== 'string') ||
        (region !== null && typeof region !== 'string')
    ) {
        throw new Error('Missing or invalid required fields.');
    }

    // Validate GPU existence
    if (!data.gpus[gpu]) {
        throw new Error('GPU not found.');
    }

    // Case 1: Use provider/region emission factors
    if (customImpact == null && customOffset == null) {
        if (typeof provider !== 'string' || typeof region !== 'string') {
            throw new Error('Provider and region are required when customImpact/customOffset are null.');
        }
        if (!data.providers[provider] || !data.providers[provider][region]) {
            throw new Error('Provider or region not found.');
        }
        const energy = twoDigits((data.gpus[gpu].watt * hours) / 1000); // kWh
        const impact = twoDigits(data.providers[provider][region].impact / 1000); // kg/kWh
        const co2 = twoDigits(energy * impact);
        const offset = twoDigits((co2 * data.providers[provider][region].offsetRatio) / 100);
        const offsetPercents = twoDigits(data.providers[provider][region].offsetRatio);

        return { energy, impact, co2, offset, offsetPercents };
    }

    // Case 2: Use custom emission factors
    if (
        provider == null &&
        region == null &&
        typeof customImpact === 'number' &&
        typeof customOffset === 'number'
    ) {
        const energy = twoDigits((data.gpus[gpu].watt * hours) / 1000); // kWh
        const impact = customImpact;
        const co2 = twoDigits(energy * impact);
        const offset = twoDigits((co2 * customOffset) / 100);
        const offsetPercents = twoDigits(customOffset);

        return { energy, impact, co2, offset, offsetPercents };
    }

    throw new Error('Invalid input: must provide either provider/region or customImpact/customOffset.');
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

