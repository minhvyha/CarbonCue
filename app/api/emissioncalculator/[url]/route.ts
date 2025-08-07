// app/api/scrape/[url]/route.ts  (or wherever yours lives)

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';           // still full puppeteer
import { lookup } from 'dns/promises';
import https from 'https';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  const targetUrl = decodeURIComponent(params.url);
  const hostname = new URL(targetUrl).hostname;

  // --- DOMAIN AVAILABILITY CHECK ---
  try {
    await lookup(hostname);
  } catch {
    return NextResponse.json(
      { error: `Domain not found: ${hostname}`, code: 'DOMAIN_NOT_FOUND' },
      { status: 404 }
    );
  }

  // --- LAUNCH PUPPETEER USING THE INSTALLED CHROME BINARY ---
  let browser;
  const assets: Record<string, number> = {};
  try {
    // Prefer the env var set by @puppeteer/browsers; fallback to the folder under project root.
    const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    const fallbackPath = path.join(
      process.cwd(),
      'chrome',
      'linux-139.0.7258.66',
      'chrome-linux64',
      'chrome'
    );
    const executablePath = envPath || fallbackPath;

    browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (r) => r.continue());
    page.on('response', async (response) => {
      try {
        const buffer = await response.buffer();
        const type = response.request().resourceType();
        assets[type] = (assets[type] || 0) + buffer.length;
      } catch {
        // ignore any buffer errors
      }
    });

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Unable to reach URL: ${targetUrl}`, code: 'URL_UNREACHABLE', details: err.message },
      { status: 502 }
    );
  } finally {
    if (browser) await browser.close();
  }

  const totalBytes = Object.values(assets).reduce((sum, val) => sum + val, 0);

  // --- SERVER INFO ---
  let ip: string, serverHeader: string;
  try {
    ip = (await lookup(hostname)).address;
  } catch {
    return NextResponse.json(
      { error: `DNS lookup failed for: ${hostname}`, code: 'DNS_LOOKUP_FAILED' },
      { status: 502 }
    );
  }

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
      { error: `Fetching server header failed for: ${targetUrl}`, code: 'SERVER_HEADER_FAILED' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip, server: serverHeader! },
    totalBytes,
    breakdown: assets,
  });
}
