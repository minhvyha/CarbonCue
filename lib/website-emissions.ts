import { co2, type ByteTraceOptions } from "@tgwf/co2";
import type { WebsiteMeasurement } from "./website-measurement";

export const WEBSITE_MODEL = { name: "Sustainable Web Design Model", version: 4, package: "@tgwf/co2", packageVersion: "0.19.0" } as const;
const model = new co2({ model: "swd", version: 4, results: "segment" });

export interface WebsiteAssumptions {
  greenHosting: boolean;
  gridIntensity?: ByteTraceOptions["gridIntensity"];
  provenance?: string;
}

export function calculateEmissions(data: { totalBytes?: number }, assumptions: WebsiteAssumptions | boolean = false) {
  const bytes = data.totalBytes;
  if (bytes === undefined || !Number.isSafeInteger(bytes) || bytes < 0) return null;
  const options = typeof assumptions === "boolean" ? { greenHosting: assumptions } : assumptions;
  const customValues = Object.values(options.gridIntensity || {});
  if (customValues.some(value => !Number.isFinite(value) || value < 0 || value > 5000)) {
    throw new Error("Grid intensities must be between 0 and 5,000 g CO2e/kWh.");
  }
  if (customValues.length && !options.provenance?.trim()) throw new Error("Describe the source of your custom grid intensities.");
  const trace = model.perByteTrace(bytes, options.greenHosting, { gridIntensity: options.gridIntensity });
  const raw = trace.co2;
  // CO2.js 0.19.0 returns unadjusted segment fields alongside its hosting-adjusted
  // total. Apply its hosting factor to the data-centre operational field only.
  const segments = {
    dataCenterOperational: typeof raw === "number" ? 0 : raw.dataCenterOperationalCO2e * (1 - trace.variables.greenHostingFactor),
    networkOperational: typeof raw === "number" ? 0 : raw.networkOperationalCO2e,
    deviceOperational: typeof raw === "number" ? 0 : raw.consumerDeviceOperationalCO2e,
    dataCenterEmbodied: typeof raw === "number" ? 0 : raw.dataCenterEmbodiedCO2e,
    networkEmbodied: typeof raw === "number" ? 0 : raw.networkEmbodiedCO2e,
    deviceEmbodied: typeof raw === "number" ? 0 : raw.consumerDeviceEmbodiedCO2e,
  };
  return {
    grams: typeof raw === "number" ? raw : raw.total,
    bytes,
    segments,
    model: WEBSITE_MODEL,
    assumptions: {
      greenHosting: options.greenHosting,
      gridIntensity: {
        dataCenter: trace.variables.gridIntensity.dataCenter.value,
        network: trace.variables.gridIntensity.network.value,
        device: trace.variables.gridIntensity.device.value,
      },
      provenance: customValues.length ? options.provenance!.trim().slice(0, 180) : "CO2.js SWDM v4 global defaults; locations unknown.",
      caching: "Uses perByteTrace on the supplied bytes. No additional cache or repeat-visitor reduction.",
    },
  };
}

export type WebsiteEmissions = NonNullable<ReturnType<typeof calculateEmissions>>;
export interface WebsiteCalculation { measurement: WebsiteMeasurement; emissions: WebsiteEmissions }

export function projectPageviews(grams: number, monthlyPageviews: string) {
  const count = Number(monthlyPageviews);
  if (!monthlyPageviews.trim() || !Number.isFinite(count) || count < 0 || !Number.isSafeInteger(count)) return null;
  return { monthlyKg: grams * count / 1000, annualKg: grams * count * 12 / 1000, count };
}

export const BYTE_UNITS = { bytes: 1, kB: 1000, MB: 1e6, KiB: 1024, MiB: 1024 ** 2 } as const;
export type ByteUnit = keyof typeof BYTE_UNITS;
export function sizeToBytes(input: string, unit: ByteUnit): number {
  const value = Number(input);
  const bytes = Math.round(value * BYTE_UNITS[unit]);
  if (!input.trim() || !Number.isFinite(value) || value < 0 || !Number.isSafeInteger(bytes) || bytes > 1e12) {
    throw new Error("Enter a data size between 0 bytes and 1 TB.");
  }
  return bytes;
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
