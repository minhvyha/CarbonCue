// Example: API handler to get asset breakdown from a website using Puppeteer in Next.js (app/api/assets/[url]/route.ts)

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  const targetUrl = decodeURIComponent(params.url);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const assets: Record<string, number> = {};

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    request.continue();
  });

  page.on('response', async (response) => {
    try {
      const url = response.url();
      const type = response.request().resourceType();
      const buffer = await response.buffer();
      const size = buffer.length;

      assets[type] = (assets[type] || 0) + size;
    } catch (err) {
      console.error('Failed to process response:', err);
    }
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await browser.close();

  const total = Object.values(assets).reduce((sum, val) => sum + val, 0);

  // Fetch WebsiteCarbon data
  let carbonData = null;
  try {
    const carbonRes = await fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(targetUrl)}`);
    if (carbonRes.ok) {
      carbonData = await carbonRes.json();
    }
  } catch (e) {
    console.error('WebsiteCarbon fetch failed:', e);
  }

  return NextResponse.json({
    url: targetUrl,
    totalBytes: total,
    breakdown: assets,
    websiteCarbon: carbonData || { error: 'Could not fetch carbon data' }
  });
}