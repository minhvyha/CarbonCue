// app/api/volunteer-hub/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://www.volunteerconnector.org/api/search/?page=2");

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }

    const json = await res.json();
    const results = json.results as any[];

    // Events
    const shuffled = results.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6).map((r) => ({
      id: r.id,
      title: r.title,
      org: r.organization.name,
      location: r.remote_or_online
        ? "Online"
        : r.audience?.scope === "local"
        ? `${r.audience.latitude?.toFixed(2)}, ${r.audience.longitude?.toFixed(2)}`
        : r.dates,
      remote: r.remote_or_online,
      dates: r.dates,
      url: r.url,
    }));

    // Unique organizations
    const orgMap = new Map();
    results.forEach((r) => {
      const org = r.organization;
      if (org?.name && !orgMap.has(org.name)) {
        orgMap.set(org.name, {
          name: org.name,
          logo: org.logo?.startsWith("//") ? `https:${org.logo}` : org.logo,
          url: org.url,
        });
      }
    });

    const organizations = Array.from(orgMap.values());

    return NextResponse.json({ events: selected, organizations });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
