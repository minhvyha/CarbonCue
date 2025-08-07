// app/api/emissioncalculator/[url]/route.ts

import { NextResponse } from 'next/server';
import { lookup } from 'dns/promises';
import https from 'https';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

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
      { error: `Domain not found: ${hostname}`, code: 'DOMAIN_NOT_FOUND' },
      { status: 404 }
    );
  }

  // 2) FETCH HTML AND RESOURCES
  const assets: Record<string, number> = {
    html: 0,
    js: 0,
    css: 0,
    image: 0,
    other: 0,
  };

  let html = '';
  try {
    const res = await axios.get(targetUrl);
    html = res.data;
    assets.html += Buffer.byteLength(html);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: `Unable to fetch HTML: ${targetUrl}`,
        code: 'URL_UNREACHABLE',
        details: err.message,
      },
      { status: 502 }
    );
  }

  const $ = cheerio.load(html);
  const baseUrl = new URL(targetUrl);
  const resourceUrls = new Set<string>();

  $('img[src], script[src], link[rel="stylesheet"][href]').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const attr = tag === 'link' ? 'href' : 'src';
    const rawUrl = $(el).attr(attr);
    if (rawUrl) {
      try {
        const fullUrl = new URL(rawUrl, baseUrl).href;
        resourceUrls.add(fullUrl);
      } catch {
        // Ignore malformed URLs
      }
    }
  });

  const classify = (contentType?: string) => {
    if (!contentType) return 'other';
    if (contentType.includes('text/html')) return 'html';
    if (contentType.includes('javascript')) return 'js';
    if (contentType.includes('text/css')) return 'css';
    if (contentType.startsWith('image/')) return 'image';
    return 'other';
  };

  await Promise.all(
    Array.from(resourceUrls).map(async (url) => {
      try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
        const size = res.data.length;
        const type = classify(res.headers['content-type']);
        assets[type] = (assets[type] || 0) + size;
      } catch {
        // Ignore failures
      }
    })
  );

  const totalBytes = Object.values(assets).reduce((sum, n) => sum + n, 0);

  // 3) DNS & SERVER HEADER
  let ip: string;
  try {
    ip = (await lookup(hostname)).address;
  } catch {
    return NextResponse.json(
      { error: `DNS lookup failed for: ${hostname}`, code: 'DNS_LOOKUP_FAILED' },
      { status: 502 }
    );
  }

  let serverHeader = 'Unknown';
  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.get(targetUrl, (res) => {
        serverHeader = (res.headers['server'] as string) || 'Unknown';
        res.resume();
        resolve();
      });
      req.on('error', () => reject(new Error('Failed to fetch server header')));
    });
  } catch {
    return NextResponse.json(
      { error: 'Fetching server header failed', code: 'SERVER_HEADER_FAILED' },
      { status: 502 }
    );
  }

  // 4) RESPOND
  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip, server: serverHeader },
    totalBytes,
    breakdown: assets,
  });
}
