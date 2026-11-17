export function volunteerUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const raw = value.trim();
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : raw.startsWith("/") ? raw : /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`, "https://www.volunteerconnector.org");
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export function normalizeVolunteerResults(results: unknown[]) {
  const events = results.flatMap((item: any) => {
    const url = volunteerUrl(item?.url);
    if (!url || typeof item?.title !== "string") return [];
    const organization = item.organization;
    return [{ id: item.id, title: item.title, org: organization?.name || "Volunteer organization",
      remote: !!item.remote_or_online, dates: item.dates || "Ongoing", url,
      logo: volunteerUrl(organization?.logo),
      organization: organization?.name ? { name: organization.name, logo: volunteerUrl(organization.logo), url: volunteerUrl(organization.url) } : null }];
  });
  const organizations = [...new Map(events.filter(e => e.organization?.url).map(e => [e.organization!.name, e.organization!])).values()];
  return { events, organizations };
}
