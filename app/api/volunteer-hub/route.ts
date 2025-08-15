// app/api/volunteer-hub/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // read the incoming ?page=... from the client request
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page") ?? "1";
    const page = Number(pageParam);
    if (Number.isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }

    // fetch the requested page from the external API
    const externalRes = await fetch(
      `https://www.volunteerconnector.org/api/search/?page=${encodeURIComponent(String(page))}`,
      {
        // optional: add a simple user-agent for some servers that reject empty UAs
        headers: { "User-Agent": "Next.js Server Fetch" },
      }
    );

    if (!externalRes.ok) {
      console.error("External API failed:", externalRes.status, await externalRes.text());
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 502 });
    }

    const json = await externalRes.json();
    let results = Array.isArray(json.results) ? json.results : [];

    // pick and sanitize fields
    results = results.slice(0, 6).map((r: any) => ({
      id: r.id,
      title: r.title,
      org: r.organization?.name ?? null,
      location: r.remote_or_online
        ? "Online"
        : r.audience?.scope === "local" && typeof r.audience?.latitude === "number" && typeof r.audience?.longitude === "number"
        ? `${r.audience.latitude.toFixed(2)}, ${r.audience.longitude.toFixed(2)}`
        : r.dates ?? null,
      remote: !!r.remote_or_online,
      dates: r.dates ?? null,
      url: r.url ?? null,
      logo: r.organization.logo ? (r.organization.logo.startsWith("//") ? `https:${r.organization.logo}` : r.organization.logo) : null,
    }));

    const orgMap = new Map<string, any>();
    results.forEach((r: any) => {
      const org = r.organization;
      if (org?.name && !orgMap.has(org.name)) {
        const logo = org.logo ? (org.logo.startsWith("//") ? `https:${org.logo}` : org.logo) : null;
        orgMap.set(org.name, { name: org.name, logo, url: org.url ?? null });
      }
    });

    return NextResponse.json({ events: results, organizations: Array.from(orgMap.values()) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
