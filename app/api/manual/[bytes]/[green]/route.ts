// Combined API handler to get asset breakdown, carbon data, and server info

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { bytes: number; green: boolean } }
) {
  const bytes = params.bytes;
  const green = params.green;

  // --- WEBSITE CARBON ---
  let data = null;
  try {
    const res = await fetch(
      `https://api.websitecarbon.com/data?bytes=${bytes}&green=${green ? 1: 0}`
    );
    if (res.ok) data = await res.json();
  } catch (e) {
    console.error("WebsiteCarbon fetch failed:", e);
  }

  // --- FINAL RESPONSE ---
  return NextResponse.json({
    websiteCarbon: data
  });
}
