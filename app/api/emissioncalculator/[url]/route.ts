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
  image: 0,    // now also covers SVG
  font: 0,
  other: 0,    // now includes JSON, XML, PDF, octet-stream, audio (±video)
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

  // collect initial resources
  const $ = cheerio.load(html);
  const baseUrl = new URL(targetUrl);
  const resourceUrls = new Set<string>();

  const collectUrl = (raw: string) => {
    try {
      const full = new URL(raw, baseUrl).href;
      if (!resourceUrls.has(full)) resourceUrls.add(full);
    } catch {}
  };

  // tags
  $('img[src], script[src], link[rel="stylesheet"][href], iframe[src], video[src], audio[src], source[src]').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const attr = el.tagName.toLowerCase() === 'link' ? 'href' : 'src';
    const raw = $(el).attr(attr);
    if (raw) collectUrl(raw);
  });

  // inline styles
  $('[style]').each((_, el) => {
    const style = $(el).attr('style')!;
    const urlRegex = /url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g;
    for (const match of style.matchAll(urlRegex)) {
      collectUrl(match[1]);
    }
  });

  // 3) FETCH RESOURCES (including CSS parsing for imports/url())
  const classify = (contentType?: string) => {
    if (!contentType) return 'other';
    contentType = contentType.toLowerCase();
    if (contentType.includes('text/html')) return 'html';
    if (contentType.includes('text/css')) return 'css';
    if (contentType.includes('javascript')) return 'js';
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('font/') || contentType.includes('font')) return 'font';
    return 'other';
  };

  // BFS-like fetch queue
  const queue = Array.from(resourceUrls);
  while (queue.length) {
    const url = queue.shift()!;
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
      const size = res.data.length;
      const type = classify(res.headers['content-type']);
      assets[type] = (assets[type] || 0) + size;

      // if CSS, parse for more URLs
      if (type === 'css') {
        const text = res.data.toString('utf8');
        const urlRegex = /url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g;
        const importRegex = /@import\s+['"]([^'"]+)['"]/g;
        for (const match of text.matchAll(urlRegex)) {
          const raw = match[1];
          const full = new URL(raw, url).href;
          if (!resourceUrls.has(full)) {
            resourceUrls.add(full);
            queue.push(full);
          }
        }
        for (const match of text.matchAll(importRegex)) {
          const raw = match[1];
          const full = new URL(raw, url).href;
          if (!resourceUrls.has(full)) {
            resourceUrls.add(full);
            queue.push(full);
          }
        }
      }
    } catch {
      // ignore individual failures
    }
  }

  const totalBytes = Object.values(assets).reduce((a, b) => a + b, 0);

  // 4) DNS & SERVER HEADER
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
        res.resume();
        resolve();
      });
      req.on('error', () => reject(new Error('Failed to fetch server header')));
    });
  } catch {
    return NextResponse.json(
      { error: 'Fetching server header failed', code: "SERVER_HEADER_FAILED" },
      { status: 502 }
    );
  }

  // 5) RESPOND
  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip, server: serverHeader },
    totalBytes,
    breakdown: assets,
  });
}
