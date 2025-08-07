// pages/api/emissioncalculator/[url].ts

import { NextResponse } from "next/server";
import chromium from "chrome-aws-lambda";
import puppeteerDev from "puppeteer"; // full bundle for local
import puppeteerCore from "puppeteer-core"; // core API for prod
import { lookup } from "dns/promises";
import https from "https";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
const isProd = process.env.NODE_ENV === "production";

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
      { error: `Domain not found: ${hostname}`, code: "DOMAIN_NOT_FOUND" },
      { status: 404 }
    );
  }

  // --- LAUNCH PUPPETEER ---
  let browser;
  const assets: Record<string, number> = {};
  try {
    if (isProd) {
      // on Vercel: use the Lambda layer Chromium
      const src = await chromium.executablePath;
      const dest = path.join("/tmp", "chrome");
      await fs.copyFile(src, dest);
      await fs.chmod(dest, 0o755);

      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: dest,
        headless: chromium.headless,
      });
    } else {
      // locally: use the full Puppeteer bundle (downloads its own Chromium)
      browser = await puppeteerDev.launch();
    }

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    (page as import("puppeteer").Page).on("request", (r) => r.continue());
    (page as import("puppeteer").Page).on("response", async (res) => {
      try {
        const buf = await res.buffer();
        const key = res.request().resourceType();
        assets[key] = (assets[key] || 0) + buf.length;
      } catch {
        // ignore
      }
    });

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: `Unable to reach URL: ${targetUrl}`,
        code: "URL_UNREACHABLE",
        details: err.message,
      },
      { status: 502 }
    );
  } finally {
    if (browser) await browser.close();
  }

  // --- COLLECT & RESPOND ---
  const totalBytes = Object.values(assets).reduce((sum, n) => sum + n, 0);

  // DNS lookup
  let ip: string;
  try {
    ip = (await lookup(hostname)).address;
  } catch {
    return NextResponse.json(
      {
        error: `DNS lookup failed for: ${hostname}`,
        code: "DNS_LOOKUP_FAILED",
      },
      { status: 502 }
    );
  }

  // Server header
  let serverHeader: string;
  try {
    await new Promise<void>((resolve, reject) => {
      const req = https.get(targetUrl, (res) => {
        serverHeader = (res.headers["server"] as string) || "Unknown";
        res.resume();
        resolve();
      });
      req.on("error", () => reject(new Error("Failed to fetch server header")));
    });
  } catch {
    return NextResponse.json(
      { error: "Fetching server header failed", code: "SERVER_HEADER_FAILED" },
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
