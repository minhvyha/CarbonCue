export const ASSET_TYPES = ["html", "css", "js", "image", "font", "media", "other"] as const;
export type AssetType = typeof ASSET_TYPES[number];
export type AssetBreakdown = Record<AssetType, number>;

export function emptyBreakdown(): AssetBreakdown {
  return { html: 0, css: 0, js: 0, image: 0, font: 0, media: 0, other: 0 };
}

export function classifyAsset(mimeType: string): AssetType {
  const type = mimeType.toLowerCase();
  if (type.includes("html")) return "html";
  if (type.includes("css")) return "css";
  if (type.includes("javascript")) return "js";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("font/") || /font|woff|opentype/.test(type)) return "font";
  if (/^(audio|video)\//.test(type)) return "media";
  return "other";
}

export interface WebsiteMeasurement {
  source: "har" | "url" | "manual";
  // Only an origin is retained. Paths, credentials, query strings and fragments are discarded.
  origin?: string;
  totalBytes: number;
  decodedBodyBytes?: number;
  breakdown?: AssetBreakdown;
  requestCount?: number;
  unknownSizeCount: number;
  partial: boolean;
  warnings: string[];
  byteBasis: string;
  scenario: string;
  durationSeconds?: number;
}

export function safeOrigin(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : undefined;
  } catch { return undefined; }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes.toLocaleString()} bytes`;
  if (bytes < 1e6) return `${(bytes / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} kB`;
  return `${(bytes / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })} MB`;
}
