import { classifyAsset, emptyBreakdown, safeOrigin, type WebsiteMeasurement } from "./website-measurement";

export const MAX_HAR_BYTES = 50 * 1024 * 1024;
export const MAX_HAR_ENTRIES = 100_000;
export const MAX_HAR_PAGES = 1_000;

export interface HarNavigation {
  // Generated IDs and labels deliberately exclude archive titles and page IDs.
  id: string;
  label: string;
  measurement: WebsiteMeasurement;
  error?: string;
  mainDocumentStatus?: number;
  sizeSources: { browserTransfer: number; headersAndBody: number; incomplete: number };
}
export interface HarSummary { navigations: HarNavigation[] }

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
}
function size(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}
function header(response: RecordValue, name: string): string {
  if (!Array.isArray(response.headers)) return "";
  const found = response.headers.find(item => String(record(item).name).toLowerCase() === name);
  return typeof record(found).value === "string" ? record(found).value as string : "";
}
function challenged(response: RecordValue): boolean {
  if (header(response, "cf-mitigated").toLowerCase() === "challenge") return true;
  const content = record(response.content);
  // Inspect only to recognize challenge pages. No response text leaves this parser.
  let text = typeof content.text === "string" ? content.text : "";
  if (content.encoding === "base64") {
    try { text = atob(text.slice(0, 16_384)); } catch { text = ""; }
  }
  return /<title>\s*Just a moment\.\.\.|\/cdn-cgi\/challenge-platform|cf-chl-/i.test(text);
}
function isDocument(entry: RecordValue): boolean {
  return entry._resourceType === "document" || String(record(record(entry.response).content).mimeType || "").includes("text/html");
}
function mainDocument(entries: RecordValue[]): RecordValue | undefined {
  let current = entries.find(isDocument);
  // Follow the first navigation's redirect chain, rather than choosing a later iframe.
  const visited = new Set<RecordValue>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const response = record(current.response);
    const status = response.status;
    if (typeof status !== "number" || status < 300 || status >= 400 || status === 304) break;
    const destination = response.redirectURL || header(response, "location");
    if (typeof destination !== "string" || !destination) break;
    try {
      const nextUrl = new URL(destination, String(record(current.request).url)).href;
      const next = entries.find(entry => !visited.has(entry) && record(entry.request).url === nextUrl);
      if (!next) break;
      current = next;
    } catch { break; }
  }
  return current;
}

function summarize(entries: RecordValue[], index: number, unassigned: boolean): HarNavigation {
  const breakdown = emptyBreakdown();
  let totalBytes = 0, decodedBodyBytes = 0, unknownSizeCount = 0, decodedUnknown = 0;
  let incompleteRequests = 0, failedRequests = 0, streams = 0;
  let first = Infinity, last = -Infinity;
  const sizeSources = { browserTransfer: 0, headersAndBody: 0, incomplete: 0 };
  for (const entry of entries) {
    const response = record(entry.response);
    const content = record(response.content);
    const mime = typeof content.mimeType === "string" ? content.mimeType : "";
    const transfer = size(response._transferSize);
    const headers = size(response.headersSize);
    const body = size(response.bodySize);
    let bytes: number;
    if (transfer !== undefined) {
      bytes = transfer; // A recorded zero is valid, including memory/disk cache hits.
      sizeSources.browserTransfer++;
    } else {
      bytes = (headers ?? 0) + (body ?? 0);
      if (headers === undefined || body === undefined) {
        unknownSizeCount++;
        sizeSources.incomplete++;
      } else sizeSources.headersAndBody++;
    }
    totalBytes += bytes;
    if (!Number.isSafeInteger(totalBytes)) throw new Error("The capture's byte total is too large.");
    breakdown[classifyAsset(mime)] += bytes;
    const decoded = size(content.size);
    if (decoded === undefined) decodedUnknown++; else decodedBodyBytes += decoded;
    if (!Number.isSafeInteger(decodedBodyBytes)) throw new Error("The capture's decoded byte total is too large.");
    const status = response.status;
    if (typeof status !== "number" || status <= 0 || status >= 400) failedRequests++;
    if (/event-stream/.test(mime) || status === 101 || entry._resourceType === "websocket") streams++;
    const start = typeof entry.startedDateTime === "string" ? Date.parse(entry.startedDateTime) : NaN;
    const time = typeof entry.time === "number" && Number.isFinite(entry.time) && entry.time >= 0 ? entry.time : undefined;
    if (time === undefined) incompleteRequests++;
    if (Number.isFinite(start)) {
      first = Math.min(first, start);
      last = Math.max(last, start + (time ?? 0));
    }
  }
  const main = mainDocument(entries);
  const response = record(main?.response);
  const mainDocumentStatus = typeof response.status === "number" ? response.status : undefined;
  const origin = safeOrigin(record(main?.request).url) || safeOrigin(record(entries[0]?.request).url);
  const warnings: string[] = [];
  let error: string | undefined;
  if (!entries.length) error = "This navigation contains no recorded requests.";
  else if (main && challenged(response)) error = "This capture contains a security-check page. Load the intended page in your browser, then record a new capture.";
  else if (main && !(mainDocumentStatus === 304 || (mainDocumentStatus !== undefined && mainDocumentStatus >= 200 && mainDocumentStatus < 300))) {
    error = "The main navigation did not complete successfully. Record a capture of the loaded page.";
  }
  if (!main) warnings.push("No main document could be identified. Confirm that these requests belong to one intended page load.");
  if (unassigned) warnings.push("These requests have no navigation reference. They are kept separate from named navigations.");
  if (unknownSizeCount) warnings.push(`${unknownSizeCount} request(s) have missing transfer sizes. Only known bytes are included; this is a partial result.`);
  if (failedRequests) warnings.push(`${failedRequests} request(s) failed or have an unknown status. The captured page may be incomplete.`);
  if (incompleteRequests) warnings.push(`${incompleteRequests} request(s) have no completed duration.`);
  if (streams) warnings.push(`${streams} streaming connection(s) detected. HAR sizes may omit streamed frames or later traffic.`);
  if (decodedUnknown) warnings.push("Decoded body size is unavailable for some requests and is shown separately as a known subtotal.");
  const basis: string[] = [];
  if (sizeSources.browserTransfer) basis.push("browser response._transferSize");
  if (sizeSources.headersAndBody) basis.push("HAR response headersSize + bodySize");
  if (sizeSources.incomplete) basis.push("known header/body subtotals for incomplete entries");
  return {
    id: `navigation-${index + 1}`,
    label: `Navigation ${index + 1}${origin ? ` · ${origin}` : ""}${unassigned ? " (unassigned)" : ""}`,
    mainDocumentStatus,
    error,
    sizeSources,
    measurement: {
      source: "har", origin, totalBytes, decodedBodyBytes, breakdown, requestCount: entries.length,
      unknownSizeCount,
      partial: unknownSizeCount > 0 || failedRequests > 0 || incompleteRequests > 0 || streams > 0 || !main || unassigned,
      warnings, byteBasis: basis.join("; ") || "No known transferred bytes",
      scenario: "Browser capture; cache state not specified",
      ...(Number.isFinite(first) && Number.isFinite(last) ? { durationSeconds: Math.max(0, (last - first) / 1000) } : {}),
    },
  };
}

export function parseHar(text: string): HarSummary {
  if (new TextEncoder().encode(text).byteLength > MAX_HAR_BYTES) throw new Error("Choose a HAR file smaller than 50 MiB.");
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error("This file is not valid HAR JSON. Export a HAR capture from your browser's Network panel."); }
  const log = record(record(parsed).log);
  if (!Array.isArray(log.entries) || !log.entries.length) throw new Error("This HAR contains no network requests.");
  if (log.entries.length > MAX_HAR_ENTRIES) throw new Error("This capture exceeds the 100,000 request limit. Export a shorter capture.");
  if (log.pages !== undefined && !Array.isArray(log.pages)) throw new Error("This HAR has an invalid navigation list.");
  const pages = Array.isArray(log.pages) ? log.pages : [];
  if (pages.length > MAX_HAR_PAGES) throw new Error("This capture contains too many navigations. Export a shorter capture.");
  const groups = new Map<string, RecordValue[]>();
  for (const page of pages) {
    const id = record(page).id;
    if (typeof id !== "string" || !id || groups.has(id)) throw new Error("This HAR contains missing or duplicate navigation references.");
    groups.set(id, []);
  }
  for (const value of log.entries) {
    const entry = record(value);
    if (!Object.keys(record(entry.request)).length || !Object.keys(record(entry.response)).length) throw new Error("This HAR contains an invalid request or response record.");
    const id = typeof entry.pageref === "string" && entry.pageref ? entry.pageref : "";
    if (!groups.has(id)) groups.set(id, []);
    if (groups.size > MAX_HAR_PAGES) throw new Error("This capture contains too many navigations. Export a shorter capture.");
    groups.get(id)!.push(entry);
  }
  // Only aggregates cross the worker boundary. Raw entries, headers, URLs and content are discarded.
  return { navigations: [...groups.entries()].map(([id, entries], index) => summarize(entries, index, id === "" && groups.size > 1)) };
}
