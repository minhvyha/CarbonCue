"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectPageviews, type WebsiteCalculation } from "@/lib/website-emissions";
import { ASSET_TYPES, formatBytes } from "@/lib/website-measurement";

const number = (value: number) => value.toLocaleString(undefined, { maximumSignificantDigits: 4 });
const SOURCE_NAMES = { har: "Local browser capture", url: "Automatic static scan", manual: "Manual transferred size" };
const SEGMENT_LABELS = {
  dataCenterOperational: "Data centre operations",
  networkOperational: "Network operations",
  deviceOperational: "Device operations",
  dataCenterEmbodied: "Data centre embodied",
  networkEmbodied: "Network embodied",
  deviceEmbodied: "Device embodied",
};

export function WebsiteCalculatorResults({ data, monthlyPageviews }: { data: WebsiteCalculation; monthlyPageviews: string }) {
  const { measurement, emissions } = data;
  const projection = projectPageviews(emissions.grams, monthlyPageviews);
  const unit = measurement.source === "har" ? "captured page load" : measurement.source === "url" ? "static scan" : "supplied page load";
  return <section className="mt-8 space-y-6" aria-label="Website emissions results" aria-live="polite">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="sm:col-span-2 border-carbon-red/30">
        <CardHeader>
          <CardDescription>Estimated emissions per {unit}</CardDescription>
          <CardTitle className="text-3xl">{number(emissions.grams)} <span className="text-lg">g CO2e</span></CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">SWDM v4 estimates emissions from data transfer. This is not a direct electricity or emissions measurement.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardDescription>{measurement.partial ? "Known data subtotal" : "Transferred data input"}</CardDescription><CardTitle className="text-2xl">{formatBytes(measurement.totalBytes)}</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">{measurement.totalBytes.toLocaleString()} bytes{measurement.requestCount !== undefined && ` · ${measurement.requestCount.toLocaleString()} requests`}</CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader><CardTitle>Measurement details</CardTitle><CardDescription>{SOURCE_NAMES[measurement.source]}{measurement.partial ? " · Partial result" : ""}</CardDescription></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <dl className="space-y-3">
          {measurement.origin && <div><dt className="font-medium">Page origin</dt><dd className="break-all text-muted-foreground">{measurement.origin}</dd></div>}
          <div><dt className="font-medium">Scenario</dt><dd className="text-muted-foreground">{measurement.scenario}</dd></div>
          <div><dt className="font-medium">Byte basis</dt><dd className="text-muted-foreground break-words">{measurement.byteBasis}</dd></div>
          {measurement.durationSeconds !== undefined && <div><dt className="font-medium">Recorded request span</dt><dd className="text-muted-foreground">{number(measurement.durationSeconds)} seconds; not necessarily the full observation window.</dd></div>}
          {measurement.decodedBodyBytes !== undefined && <div><dt className="font-medium">Known decoded bodies</dt><dd className="text-muted-foreground">{formatBytes(measurement.decodedBodyBytes)}. Shown separately; not added to transferred bytes.</dd></div>}
        </dl>
        {measurement.warnings.length > 0 && <div className="rounded-md bg-muted/50 p-4"><ul className="list-disc pl-4 space-y-2">{measurement.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></div>}
        {measurement.totalBytes === 0 && <p className="rounded-md border p-3">The supplied transfer is zero. The model scales with bytes, so its estimate is zero; a cached page can still consume device energy. This does not establish zero real-world emissions.</p>}
        {measurement.breakdown && <div className="space-y-3">
          <h3 className="font-medium">Transferred bytes by resource type</h3>
          {ASSET_TYPES.filter(type => measurement.breakdown![type] > 0).map(type => <div key={type}>
            <div className="flex justify-between gap-3 mb-1"><span className="capitalize">{type === "js" ? "JavaScript" : type === "css" ? "CSS" : type === "html" ? "HTML" : type}</span><span>{formatBytes(measurement.breakdown![type])}</span></div>
            <div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-carbon-red" style={{ width: `${measurement.totalBytes ? measurement.breakdown![type] / measurement.totalBytes * 100 : 0}%` }} /></div>
          </div>)}
        </div>}
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Pageview projections</CardTitle><CardDescription>Assumes every pageview resembles this {unit} and its cache scenario. Visitors can generate multiple pageviews.</CardDescription></CardHeader>
      <CardContent>
        {projection ? <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><dt className="text-sm text-muted-foreground">{projection.count.toLocaleString()} pageviews per month</dt><dd className="mt-1 text-2xl font-semibold">{number(projection.monthlyKg)} kg CO2e</dd></div>
          <div><dt className="text-sm text-muted-foreground">12 equivalent months</dt><dd className="mt-1 text-2xl font-semibold">{number(projection.annualKg)} kg CO2e</dd></div>
        </dl> : <p className="text-sm">Enter a non-negative whole number of monthly pageviews.</p>}
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Model breakdown and assumptions</CardTitle><CardDescription>{emissions.model.name} v{emissions.model.version} · {emissions.model.package} {emissions.model.packageVersion}</CardDescription></CardHeader>
      <CardContent className="text-sm space-y-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Object.entries(emissions.segments).map(([key, grams]) => <div key={key} className="flex justify-between gap-4 rounded-md bg-muted/40 p-3"><dt>{SEGMENT_LABELS[key as keyof typeof SEGMENT_LABELS]}</dt><dd className="shrink-0">{number(grams)} g</dd></div>)}</dl>
        <p className="text-muted-foreground">Embodied emissions allocate manufacturing and infrastructure impacts to the supplied data. They are modelled allocations.</p>
        <dl className="space-y-2">
          <div><dt className="font-medium">Operational grid intensities (g CO2e/kWh)</dt><dd className="text-muted-foreground">Data centre: {number(emissions.assumptions.gridIntensity.dataCenter)} · Network: {number(emissions.assumptions.gridIntensity.network)} · Device: {number(emissions.assumptions.gridIntensity.device)}</dd></div>
          <div><dt className="font-medium">Assumption source</dt><dd className="text-muted-foreground break-words">{emissions.assumptions.provenance}</dd></div>
          <div><dt className="font-medium">Hosting</dt><dd className="text-muted-foreground">{emissions.assumptions.greenHosting ? "User-declared 100% green hosting; data-centre operational reduction only. This has not been independently verified." : "Unknown hosting energy mix; no green-hosting reduction applied."}</dd></div>
          <div><dt className="font-medium">Caching</dt><dd className="text-muted-foreground">{emissions.assumptions.caching}</dd></div>
        </dl>
        <p className="text-muted-foreground">Results depend on the capture, grid assumptions and model boundaries. No accuracy percentage or website ranking is inferred.</p>
        <a className="underline" href="https://developers.thegreenwebfoundation.org/co2js/models/overview/" target="_blank" rel="noreferrer">Read the CO2.js methodology</a>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Reduce transfer and repeat the same scenario</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground"><ul className="list-disc pl-5 space-y-2"><li>Resize and compress images, defer offscreen media, and avoid unnecessary autoplay.</li><li>Remove unused JavaScript, CSS and third-party requests.</li><li>Use compression and cache static assets. Compare cold and cached loads separately.</li><li>Record the same observation window and interactions before and after changes.</li></ul></CardContent>
    </Card>
  </section>;
}
