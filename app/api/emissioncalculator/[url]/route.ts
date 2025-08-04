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

  // --- ASSET BREAKDOWN ---
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const assets: Record<string, number> = {};

  await page.setRequestInterception(true);
  page.on('request', (req) => req.continue());

  page.on('response', async (response) => {
    try {
      const type = response.request().resourceType();
      const buffer = await response.buffer();
      const size = buffer.length;
      assets[type] = (assets[type] || 0) + size;
    } catch (err) {
      console.error('Asset breakdown error:', err);
    }
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await browser.close();
  const totalBytes = Object.values(assets).reduce((sum, val) => sum + val, 0);

  // --- SERVER INFO ---
  const hostname = new URL(targetUrl).hostname;
  let ip = null;
  let serverHeader = null;

  try {
    const result = await lookup(hostname);
    ip = result.address;
  } catch (err) {
    console.error('DNS lookup failed:', err);
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.get(targetUrl, (res) => {
        serverHeader = res.headers['server'] || 'Unknown';
        res.resume();
        resolve();
      });
      req.on('error', reject);
    });
  } catch (err) {
    console.error('Fetching server header failed:', err);
  }

  // --- FINAL RESPONSE ---
  return NextResponse.json({
    url: targetUrl,
    serverInfo: { ip, server: serverHeader },
    totalBytes,
    breakdown: assets,
  });
}