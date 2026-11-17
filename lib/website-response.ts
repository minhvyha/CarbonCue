import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";

export const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

// Decode only for discovering references. Emission inputs always use the original wire body.
export function decodeResponseBody(body: Buffer, contentEncoding: string): string {
  let decoded = body;
  for (const encoding of contentEncoding.toLowerCase().split(",").map(value => value.trim()).reverse()) {
    if (encoding === "gzip" || encoding === "x-gzip") decoded = gunzipSync(decoded, { maxOutputLength: MAX_RESPONSE_BYTES });
    else if (encoding === "br") decoded = brotliDecompressSync(decoded, { maxOutputLength: MAX_RESPONSE_BYTES });
    else if (encoding === "deflate") decoded = inflateSync(decoded, { maxOutputLength: MAX_RESPONSE_BYTES });
    else if (encoding && encoding !== "identity") throw new Error("Unsupported response encoding.");
  }
  if (decoded.length > MAX_RESPONSE_BYTES) throw new Error("The decoded resource exceeds the analysis limit.");
  return decoded.toString("utf8");
}
