import { NextResponse } from "next/server";
import { lookup } from "dns/promises";
import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import { websiteFetchFailure } from "@/lib/website-fetch-error";
import { classifyAsset, emptyBreakdown, safeOrigin, type WebsiteMeasurement } from "@/lib/website-measurement";
import { decodeResponseBody, MAX_RESPONSE_BYTES } from "@/lib/website-response";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ url: string }> }
) {
  const { url } = await params;
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) throw new Error();
  } catch {
    return NextResponse.json({ error: "Enter a valid HTTP or HTTPS website URL." }, { status: 400 });
  }
  const targetUrl = parsedUrl.href;
  const hostname = parsedUrl.hostname;

  // 1) DOMAIN CHECK
  try {
    await lookup(hostname);
  } catch {
    return NextResponse.json(
      { error: `Domain not found: ${hostname}`, code: "DOMAIN_NOT_FOUND" },
      { status: 404 }
    );
  }

  // 2) FETCH HTML
  const assets = emptyBreakdown();

  let html = "";
  let finalUrl = targetUrl;
  try {
    const res = await axios.get(targetUrl, { timeout: 10000, responseType: "arraybuffer", decompress: false, maxContentLength: MAX_RESPONSE_BYTES, maxRedirects: 5 });
    // A challenge page is not the requested website, even if returned with HTTP 200.
    if (res.headers["cf-mitigated"] === "challenge") {
      const failure = websiteFetchFailure(new axios.AxiosError("Website security challenge", undefined, undefined, undefined, res));
      return NextResponse.json(failure.body, { status: failure.status });
    }
    const body = Buffer.from(res.data);
    html = decodeResponseBody(body, String(res.headers["content-encoding"] || ""));
    assets.html += body.length;
    finalUrl = res.request?.res?.responseUrl || targetUrl;
  } catch (error) {
    const failure = websiteFetchFailure(error);
    return NextResponse.json(failure.body, { status: failure.status });
  }

  // load cheerio and prepare URL collector
  const $ = cheerio.load(html);
  const baseUrl = new URL(finalUrl);
  const resourceUrls = new Set<string>();
  const collectUrl = (raw: string) => {
    try {
      const full = new URL(raw.trim(), baseUrl).href;
      if (["http:", "https:"].includes(new URL(full).protocol)) resourceUrls.add(full);
    } catch {}
  };

  // 3) COLLECT STATIC REFERENCES
  // tags: imgs, scripts, stylesheets, iframes, media, preload/prefetch, manifests
  $('img[src], img[srcset], source[src], source[srcset], script[src], link[rel="stylesheet"][href], link[rel="preload"][href], link[rel="prefetch"][href], link[rel="manifest"][href], iframe[src], video[src], audio[src], [src]').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'img' || tag === 'source') {
      const src = $(el).attr('src');
      if (src) collectUrl(src);
      const srcset = $(el).attr('srcset');
      if (srcset) {
        srcset.split(',').forEach(item => {
          const [urlPart] = item.trim().split(/\s+/);
          collectUrl(urlPart);
        });
      }
    } else {
      const attr = $(el).attr('href') ? 'href' : 'src';
      const raw = $(el).attr(attr);
      if (raw) collectUrl(raw);
    }
  });

  // inline style URLs
  $('[style]').each((_, el) => {
    const style = $(el).attr('style')!;
    const urlRegex = /url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g;
    for (const match of style.matchAll(urlRegex)) {
      collectUrl(match[1]);
    }
  });

  // data-* lazy-loaded attributes
  $('[data-src], [data-srcset], [data-href]').each((_, el) => {
    const ds = $(el).attr('data-src');
    if (ds) collectUrl(ds);
    const dss = $(el).attr('data-srcset');
    if (dss) {
      dss.split(',').forEach(item => collectUrl(item.trim().split(/\s+/)[0]));
    }
    const dh = $(el).attr('data-href');
    if (dh) collectUrl(dh);
  });

  // 4) FETCH & PROCESS QUEUE
  const queue = Array.from(resourceUrls).slice(0, 40);
  const deadline = Date.now() + 15000;
  let processed = 0;
  let failedAssets = 0;
  while (queue.length && processed < 40 && Date.now() < deadline) {
    const url = queue.shift()!;
    processed++;
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer', decompress: false, timeout: Math.max(1, Math.min(3000, deadline - Date.now())), maxContentLength: MAX_RESPONSE_BYTES, maxRedirects: 5 });
      if (res.headers['cf-mitigated'] === 'challenge') { failedAssets++; continue; }
      const body = Buffer.from(res.data);
      const size = body.length;
      const type = classifyAsset(String(res.headers['content-type'] || ''));
      assets[type] = (assets[type] || 0) + size;

      // parse CSS for deeper imports
      if (type === 'css') {
        const text = decodeResponseBody(body, String(res.headers['content-encoding'] || ''));
        const cssBaseUrl = res.request?.res?.responseUrl || url;
        const urlRegex = /url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g;
        const importRegex = /@import\s+['"]([^'"]+)['"]/g;
        for (const m of text.matchAll(urlRegex)) {
          const full = new URL(m[1], cssBaseUrl).href;
          if (["http:", "https:"].includes(new URL(full).protocol) && !resourceUrls.has(full)) queue.push(full), resourceUrls.add(full);
        }
        for (const m of text.matchAll(importRegex)) {
          const full = new URL(m[1], cssBaseUrl).href;
          if (["http:", "https:"].includes(new URL(full).protocol) && !resourceUrls.has(full)) queue.push(full), resourceUrls.add(full);
        }
      }
    } catch { failedAssets++; }
  }

  const totalBytes = Object.values(assets).reduce((a, b) => a + b, 0);

  const warnings = [
    "Partial static scan: JavaScript is not executed. Responsive alternatives and lazy media can differ from a real browser load.",
    "Counts compressed response bodies only. Response headers and redirect bodies are excluded; import a browser capture for recorded transfer totals.",
  ];
  if (queue.length || resourceUrls.size > processed) warnings.push("The scan reached its 40-resource or time limit. Some resources were not fetched.");
  if (failedAssets) warnings.push(`${failedAssets} resource(s) could not be measured.`);
  const measurement: WebsiteMeasurement = {
    source: "url", origin: safeOrigin(finalUrl), totalBytes, breakdown: assets,
    requestCount: processed + 1, unknownSizeCount: failedAssets, partial: true, warnings,
    byteBasis: "Compressed response body bytes; headers and redirect bodies excluded",
    scenario: "Limited static scan; no browser cache or JavaScript execution",
  };
  return NextResponse.json({ measurement });
}
