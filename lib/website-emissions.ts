// --- Constants & Thresholds ---
const ADJUSTMENT_FACTOR = 0.7554; // network/header/etc overhead
const ENERGY_INTENSITY_GB = 0.7545; // kWh per GB transferred
const GRID_CARBON_INTENSITY = 351; // g CO₂ per kWh (grid avg)
const RENEWABLE_INTENSITY = 288; // g CO₂ per kWh (renewables)
const CO2_GAS_DENSITY = 1.8; // g CO₂ per litre CO₂
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Rating thresholds in bytes
const RATING_THRESHOLDS: { limit: number; label: string }[] = [
  { limit: 500 * 1024, label: "A+" },
  { limit: 1 * 1024 * 1024, label: "A" },
  { limit: 1.5 * 1024 * 1024, label: "A-" },
  { limit: 2 * 1024 * 1024, label: "B" },
  { limit: 3 * 1024 * 1024, label: "C" },
  { limit: 4 * 1024 * 1024, label: "D" },
];

interface EmissionData {
  url?: string;
  totalBytes?: number;
}

// --- Utility: Compute all emissions stats ---
export function calculateEmissions(data: EmissionData, green: boolean) {
  const bytes = data.totalBytes || 0;
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }

  // 1) adjust bytes
  const adjustedBytes = bytes * ADJUSTMENT_FACTOR;

  // 2) convert to GB & compute energy
  const GB = adjustedBytes / 1e9;
  const energy = GB * ENERGY_INTENSITY_GB; // kWh

  // 3) compute CO₂ in grams
  const co2Grid_g = energy * GRID_CARBON_INTENSITY;
  const co2Renewable_g = energy * RENEWABLE_INTENSITY;

  // 4) convert grams → litres
  const litresGrid = co2Grid_g / CO2_GAS_DENSITY;
  const litresRenewable = co2Renewable_g / CO2_GAS_DENSITY;

  // 5) determine rating
  const rating = RATING_THRESHOLDS.find((t) => bytes < t.limit)?.label ?? "F";

  // Relative page-size score, not a measured percentile.
  let cleanerThan = Math.max(0, (MAX_BYTES - bytes) / MAX_BYTES);
  cleanerThan = Math.round(cleanerThan * 100) / 100;

  return {
    url: data.url || null,
    green,
    bytes,
    cleanerThan,
    rating,
    statistics: {
      adjustedBytes,
      energy,
      co2: {
        grid: { grams: co2Grid_g, litres: litresGrid },
        renewable: { grams: co2Renewable_g, litres: litresRenewable },
      },
    },
    timestamp: Math.floor(Date.now() / 1000),
  };
}

export function kilobytesToBytes(kilobytes: string): number {
  const size = Number(kilobytes);
  if (!Number.isFinite(size) || size <= 0) throw new Error("Enter a positive page size in KB.");
  return size * 1024;
}

export function normalizeWebsiteUrl(input: string): string {
  const value = input.trim();
  if (!value) throw new Error("Enter a website URL.");
  const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Enter a valid HTTP or HTTPS website URL.");
  }
  return url.href;
}
