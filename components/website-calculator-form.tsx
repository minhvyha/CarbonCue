"use client";

import { useCallback, useState, type Dispatch, type SetStateAction, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebsiteHarImport } from "@/components/website-har-import";
import { BYTE_UNITS, calculateEmissions, normalizeWebsiteUrl, sizeToBytes, type ByteUnit, type WebsiteAssumptions, type WebsiteCalculation } from "@/lib/website-emissions";
import type { WebsiteMeasurement } from "@/lib/website-measurement";

type Mode = "url" | "har" | "manual";
const selectClass = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm";
const MODES = { url: "Analyse URL", har: "Import browser capture", manual: "Enter data size" };

export function WebsiteCalculatorForm({ setData, monthlyPageviews, setMonthlyPageviews }: {
  setData: Dispatch<SetStateAction<WebsiteCalculation | null>>;
  monthlyPageviews: string;
  setMonthlyPageviews: (value: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [pageSize, setPageSize] = useState("");
  const [unit, setUnit] = useState<ByteUnit>("kB");
  const [harMeasurement, setHarMeasurement] = useState<WebsiteMeasurement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [green, setGreen] = useState(false);
  const [intensities, setIntensities] = useState({ dataCenter: "", network: "", device: "" });
  const [provenance, setProvenance] = useState("");
  const [error, setError] = useState("");
  const handleHarReady = useCallback((measurement: WebsiteMeasurement | null) => {
    setHarMeasurement(measurement); setData(null);
  }, [setData]);

  function switchMode(next: Mode) { setMode(next); setError(""); setData(null); setHarMeasurement(null); }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(""); setData(null); setIsLoading(true);
    try {
      const gridIntensity: NonNullable<WebsiteAssumptions["gridIntensity"]> = {};
      for (const key of ["dataCenter", "network", "device"] as const) {
        if (intensities[key].trim()) gridIntensity[key] = Number(intensities[key]);
      }
      const assumptions = { greenHosting: green, gridIntensity, provenance };
      let measurement: WebsiteMeasurement;
      if (mode === "manual") {
        measurement = {
          source: "manual", totalBytes: sizeToBytes(pageSize, unit), unknownSizeCount: 0, partial: false,
          warnings: ["User-entered transferred size; completeness has not been verified."],
          byteBasis: "User-entered transferred bytes", scenario: "User-supplied page-load size; cache state unknown",
        };
      } else if (mode === "har") {
        if (!harMeasurement) throw new Error("Import a capture, choose a navigation, and confirm the intended page loaded.");
        measurement = harMeasurement;
      } else {
        const endpoint = `/api/emissioncalculator/${encodeURIComponent(normalizeWebsiteUrl(url))}`;
        const response = await fetch(endpoint, { cache: "no-store" });
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.error || "Unable to analyse this website. Import a browser capture or enter its transferred size.");
        if (!body?.measurement || !Number.isSafeInteger(body.measurement.totalBytes)) throw new Error("The website did not return a measurable size.");
        measurement = body.measurement;
      }
      const emissions = calculateEmissions(measurement, assumptions);
      if (!emissions) throw new Error("The transferred byte count is invalid.");
      setData({ measurement, emissions });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to calculate emissions."); }
    finally { setIsLoading(false); }
  }

  return <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Measurement method">
      {Object.entries(MODES).map(([value, label]) => <Button key={value} type="button" variant={mode === value ? "default" : "outline"} aria-pressed={mode === value} disabled={isLoading} onClick={() => switchMode(value as Mode)} className="h-auto whitespace-normal py-3">{label}</Button>)}
    </div>
    {mode === "url" && <div className="space-y-2">
      <Label htmlFor="website-url">Website URL</Label>
      <Input id="website-url" placeholder="https://example.com" value={url} disabled={isLoading} onChange={event => { setUrl(event.target.value); setError(""); setData(null); }} required aria-describedby="url-help" />
      <p id="url-help" className="text-sm text-muted-foreground">A limited static scan. For protected pages or dynamically loaded content, import a browser capture.</p>
    </div>}
    {mode === "har" && <WebsiteHarImport onReady={handleHarReady} />}
    {mode === "manual" && <div className="space-y-2">
      <Label htmlFor="page-size">Transferred data per page load</Label>
      <div className="flex gap-2">
        <Input id="page-size" type="number" min="0" step="any" placeholder="2400" value={pageSize} onChange={event => { setPageSize(event.target.value); setData(null); }} required />
        <select aria-label="Data size unit" className={`${selectClass} max-w-24`} value={unit} onChange={event => { setUnit(event.target.value as ByteUnit); setData(null); }}>
          {Object.keys(BYTE_UNITS).map(value => <option key={value}>{value}</option>)}
        </select>
      </div>
      <p className="text-sm text-muted-foreground">Use the Network panel's transferred total, including third-party requests. kB = 1,000 bytes; KiB = 1,024 bytes. Decoded resource size is a different quantity.</p>
    </div>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="monthly-pageviews">Monthly pageviews</Label>
        <Input id="monthly-pageviews" type="number" min="0" max="1000000000000" step="1" value={monthlyPageviews} onChange={event => setMonthlyPageviews(event.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hosting-assumption">Hosting assumption</Label>
        <select id="hosting-assumption" className={selectClass} value={green ? "green" : "default"} disabled={isLoading} onChange={event => { setGreen(event.target.value === "green"); setData(null); }}>
          <option value="default">Unknown: use model default</option>
          <option value="green">I declare 100% green hosting</option>
        </select>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">The hosting assumption applies only to data-centre operations. Device, network and embodied emissions remain in the model.</p>
    <details className="rounded-lg border p-4 text-sm">
      <summary className="cursor-pointer font-medium">Optional grid intensity assumptions</summary>
      <p className="mt-3 text-muted-foreground">Leave blank for global model defaults. Override only when you have evidence of the serving grid or user location. Units: g CO2e/kWh.</p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {([["dataCenter", "Data centre"], ["network", "Network"], ["device", "User device"]] as const).map(([key, label]) => <div className="space-y-2" key={key}>
          <Label htmlFor={`intensity-${key}`}>{label}</Label>
          <Input id={`intensity-${key}`} type="number" min="0" max="5000" step="any" placeholder="Global default" value={intensities[key]} disabled={isLoading} onChange={event => { setIntensities(previous => ({ ...previous, [key]: event.target.value })); setData(null); }} />
        </div>)}
      </div>
      <Label className="block mt-3 mb-2" htmlFor="intensity-source">Source for custom assumptions</Label>
      <Input id="intensity-source" maxLength={180} value={provenance} disabled={isLoading} onChange={event => { setProvenance(event.target.value); setData(null); }} placeholder="Source, region and year" />
    </details>
    {error && <div role="alert" className="rounded-lg border border-destructive/40 p-4 text-sm space-y-3">
      <p>{error}</p>
      {mode === "url" && <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => switchMode("har")}>Import browser capture</Button>
        <Button type="button" variant="outline" onClick={() => switchMode("manual")}>Use manual page size</Button>
      </div>}
    </div>}
    <Button type="submit" disabled={isLoading || (mode === "har" && !harMeasurement)} className="w-full bg-carbon-red hover:bg-carbon-deep-red">
      <Search className="mr-2 h-4 w-4" />{isLoading ? "Analysing..." : "Estimate emissions"}
    </Button>
  </form>;
}
