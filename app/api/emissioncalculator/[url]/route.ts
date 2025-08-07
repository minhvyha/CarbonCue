// app/api/emissioncalculator/[url]/route.ts

import { NextResponse } from 'next/server';
import { lookup } from 'dns/promises';
import https from 'https';
import { launchChromium } from 'playwright-aws-lambda';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  const targetUrl = decodeURIComponent(params.url);
  const hostname  = new URL(targetUrl).hostname;

  // 1) DOMAIN CHECK
  try {
    await lookup(hostname);
  } catch {
    return NextResponse.json(
      { error: `Domain not found: ${hostname}`, code: 'DOMAIN_NOT_FOUND' },
      { status: 404 }
    );
  }

  // 2) LAUNCH PLAYWRIGHT + MEASURE ASSETS
  let browser  = null;
  const assets: Record<string, number> = {};

  try {
    browser = await launchChromium({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const context = await browser.newContext();
    const page    = await context.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    page.on('response', async (res) => {
      try {
        const buffer = await res.body();
        const type   = res.request().resourceType();
        assets[type] = (assets[type] || 0) + buffer.length;
      } catch {
        // ignore
      }
    });

    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60_000 });
  } catch (err: any) {
    console.error('Playwright error:', err);
    return NextResponse.json(
      {
        error:   `Unable to reach URL: ${targetUrl}`,
        code:    'URL_UNREACHABLE',
        details: err.message,
      },
      { status: 502 }
    );
  } finally {
    if (browser) await browser.close();
  }

  // 3) COLLECT METRICS
  const totalBytes = Object.values(assets).reduce((sum, n) => sum + n, 0);

  // 4) DNS & SERVER HEADER
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

  // 5) RESPOND
  return NextResponse.json({
    url:        targetUrl,
    serverInfo: { ip, server: serverHeader },
    totalBytes,
    breakdown:  assets,
  });
}
