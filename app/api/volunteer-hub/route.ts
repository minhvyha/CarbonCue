import { NextResponse } from "next/server";
import { normalizeVolunteerResults } from "@/lib/volunteer-listings";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") ?? 1);
  if (!Number.isInteger(page) || page < 1) return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  const query = new URLSearchParams({ page: String(page) });
  if (params.get("search")?.trim()) query.set("se", params.get("search")!.trim());
  if (params.get("remote") === "true") query.set("ro", "on");
  try {
    const response = await fetch(`https://www.volunteerconnector.org/api/search/?${query}`, {
      headers: { "User-Agent": "CarbonCue" }, signal: AbortSignal.timeout(10000),
    });
    if (response.status === 404 && page > 1) return NextResponse.json({ events: [], organizations: [], hasMore: false });
    if (!response.ok) throw new Error("Provider unavailable");
    const data = await response.json();
    if (!Array.isArray(data.results)) throw new Error("Invalid provider response");
    return NextResponse.json({ ...normalizeVolunteerResults(data.results), hasMore: !!data.next });
  } catch {
    return NextResponse.json({ error: "Volunteer opportunities are temporarily unavailable. Please try again." }, { status: 502 });
  }
}
