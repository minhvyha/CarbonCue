// pages/api/emissioncalculator/[url].ts

import { NextResponse } from 'next/server';
import chromium from 'chrome-aws-lambda';
import puppeteerCore from 'puppeteer-core';
import { lookup } from 'dns/promises';
import https from 'https';
import fs from 'fs/promises';
import path from 'path';

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

  // 2) PREPARE & LAUNCH CHROME
  let browser;
  const assets: Record<string, number> = {};
  try {
    // Copy binary to /tmp to avoid ETXTBSY
    const src = await chromium.executablePath;
    const dest = path.join('/tmp', 'chrome');
    await fs.copyFile(src, dest);
    await fs.chmod(dest, 0o755);

    // Launch with extra flags
    browser = await puppeteerCore.launch({
      executablePath: dest,
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
      ],
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });

    // Asset interception
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (r) => r.continue());
    page.on('response', async (res) => {
      try {
        const buf = await res.buffer();
        const type = res.request().resourceType();
        assets[type] = (assets[type] || 0) + buf.length;
      } catch {}
    });

    // Navigate
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (err: any) {
    console.error('Puppeteer launch error:', err);
    return NextResponse.json(
      {
        error: `Unable to reach URL: ${targetUrl}`,
        code: 'URL_UNREACHABLE',
        details: err.message,
      },
      { status: 502 }
    );
  } finally {
    if (browser) await browser.close();
  }

  // 3) COLLECT METRICS
  const totalBytes = Object.values(assets).reduce((sum, n) => sum + n, 0);

  // DNS & SERVER HEADER
  let ip: string;
  try {
    ip = (await lookup(hostname)).address;
  } catch {
    return NextResponse.json(
      { error: `DNS lookup failed for: ${hostname}`, code: 'DNS_LOOKUP_FAILED' },
      { status: 502 }
    );
  }

  let serverHeader: string;
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
    serverInfo: { ip, server: serverHeader! },
    totalBytes,
    breakdown: assets,
  });
}
