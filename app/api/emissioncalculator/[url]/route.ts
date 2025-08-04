// Combined API handler to get asset breakdown, carbon data, and server info

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { lookup } from 'dns/promises';
import https from 'https';

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
    // Return 404 if domain does not exist
    return NextResponse.json(
      { error: `Domain not found: ${hostname}`, code: 'DOMAIN_NOT_FOUND' },
      { status: 404 }
    );
  }

  // --- ASSET BREAKDOWN ---
  let browser;
  const assets: Record<string, number> = {};
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => req.continue());
    page.on('response', async (response) => {
      const type = response.request().resourceType();
      const buffer = await response.buffer();
      const size = buffer.length;
      assets[type] = (assets[type] || 0) + size;
    });

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (err: any) {
    // Return 502 if Puppeteer cannot navigate to the URL
    return NextResponse.json(
      { error: `Unable to reach URL: ${targetUrl}`, code: 'URL_UNREACHABLE', details: err.message },
      { status: 502 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  const totalBytes = Object.values(assets).reduce((sum, val) => sum + val, 0);

  // --- SERVER INFO ---
  let ip: string | null;
  let serverHeader: string | null;

  try {
    const result = await lookup(hostname);
    ip = result.address;
  } catch {
    // If DNS lookup fails here, return a 502 error
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
    // Return 502 if unable to fetch server header
    return NextResponse.json(
      { error: `Fetching server header failed for: ${targetUrl}`, code: 'SERVER_HEADER_FAILED' },
      { status: 502 }
    );
  }

  // --- FINAL RESPONSE ---
  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip: ip!, server: serverHeader! },
    totalBytes,
    breakdown: assets,
  });
}
