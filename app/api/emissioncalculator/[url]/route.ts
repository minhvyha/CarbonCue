import { NextResponse } from "next/server";
import { lookup } from "dns/promises";
import https from "https";
import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  const targetUrl = decodeURIComponent(params.url);
  const hostname = new URL(targetUrl).hostname;

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
  const assets: Record<string, number> = {
    html: 0,
    css: 0,
    js: 0,
    image: 0,
    font: 0,
    other: 0,
  };

  let html = "";
  try {
    const res = await axios.get(targetUrl);
    html = res.data;
    assets.html += Buffer.byteLength(html);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: `Unable to fetch HTML: ${targetUrl}`,
        code: "URL_UNREACHABLE",
        details: err.message,
      },
      { status: 502 }
    );
  }

  // load cheerio and prepare URL collector
  const $ = cheerio.load(html);
  const baseUrl = new URL(targetUrl);
  const resourceUrls = new Set<string>();
  const collectUrl = (raw: string) => {
    try {
      const full = new URL(raw.trim(), baseUrl).href;
      resourceUrls.add(full);
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
  const classify = (ct?: string) => {
    ct = ct?.toLowerCase() || '';
    if (ct.includes('html')) return 'html';
    if (ct.includes('css')) return 'css';
    if (ct.includes('javascript')) return 'js';
    if (ct.startsWith('image/')) return 'image';
    if (ct.startsWith('font/')) return 'font';
    return 'other';
  };

  const queue = Array.from(resourceUrls);
  while (queue.length) {
    const url = queue.shift()!;
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
      const size = res.data.length;
      const type = classify(res.headers['content-type']);
      assets[type] = (assets[type] || 0) + size;

      // parse CSS for deeper imports
      if (type === 'css') {
        const text = res.data.toString('utf8');
        const urlRegex = /url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g;
        const importRegex = /@import\s+['"]([^'"]+)['"]/g;
        for (const m of text.matchAll(urlRegex)) {
          const full = new URL(m[1], url).href;
          if (!resourceUrls.has(full)) queue.push(full), resourceUrls.add(full);
        }
        for (const m of text.matchAll(importRegex)) {
          const full = new URL(m[1], url).href;
          if (!resourceUrls.has(full)) queue.push(full), resourceUrls.add(full);
        }
      }
    } catch {}
  }

  const totalBytes = Object.values(assets).reduce((a, b) => a + b, 0);

  // 5) DNS & SERVER INFO
  let ip: string;
  try {
    ip = (await lookup(hostname)).address;
  } catch {
    return NextResponse.json(
      { error: `DNS lookup failed for: ${hostname}`, code: "DNS_LOOKUP_FAILED" },
      { status: 502 }
    );
  }

  let serverHeader = 'Unknown';
  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.get(targetUrl, res => {
        serverHeader = (res.headers['server'] as string) || 'Unknown';
        res.resume(); resolve();
      });
      req.on('error', () => reject(new Error()));
    });
  } catch {
    return NextResponse.json(
      { error: 'Fetching server header failed', code: "SERVER_HEADER_FAILED" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip, server: serverHeader },
    totalBytes,
    breakdown: assets,
  });
}
