"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_HAR_BYTES, type HarSummary } from "@/lib/website-har";
import { formatBytes, type WebsiteMeasurement } from "@/lib/website-measurement";

const SCENARIOS = {
  unknown: "Browser capture; cache state unknown",
  cold: "Cold cache; initial load without scrolling or playing video",
  warm: "Normal cached load without scrolling or playing video",
  interactive: "Interaction or extended capture; includes the recorded activity only",
};
const selectClass = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm";

export function WebsiteHarImport({ onReady }: { onReady: (measurement: WebsiteMeasurement | null) => void }) {
  const [summary, setSummary] = useState<HarSummary | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>("unknown");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = summary?.navigations.find(page => page.id === selectedId);
  useEffect(() => {
    onReady(selected && !selected.error && confirmed ? { ...selected.measurement, scenario: SCENARIOS[scenario] } : null);
  }, [selected, confirmed, scenario, onReady]);
  useEffect(() => () => {
    workerRef.current?.terminate();
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // Do not retain the raw file in the input element.
    workerRef.current?.terminate();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSummary(null); setSelectedId(""); setConfirmed(false); setError(""); setBusy(false); onReady(null);
    if (!file) return;
    if (file.size > MAX_HAR_BYTES) { setError("Choose a HAR file smaller than 50 MiB."); return; }
    setBusy(true);
    try {
      const worker = new Worker(new URL("../workers/website-har.worker.ts", import.meta.url), { type: "module" });
      workerRef.current = worker;
      const finish = () => { worker.terminate(); workerRef.current = null; if (timerRef.current) clearTimeout(timerRef.current); setBusy(false); };
      worker.onmessage = (message: MessageEvent<{ summary?: HarSummary; error?: string }>) => {
        if (message.data.error || !message.data.summary) setError(message.data.error || "Unable to read this capture.");
        else {
          setSummary(message.data.summary);
          setSelectedId(message.data.summary.navigations[0]?.id || "");
        }
        finish();
      };
      worker.onerror = () => { setError("The capture could not be processed. Try a smaller HAR file."); finish(); };
      timerRef.current = setTimeout(() => { setError("The capture took too long to read. Export a shorter capture."); finish(); }, 30_000);
      worker.postMessage(file);
    } catch {
      workerRef.current?.terminate(); workerRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      setBusy(false); setError("Local capture processing is unavailable in this browser. Try a current browser or enter the transferred size manually.");
    }
  }

  return <div className="space-y-4">
    <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
      <p className="font-medium">Analyse protected pages such as mq.edu.au</p>
      <p>Open the page normally and complete any security check. This capture stays in your browser and is never uploaded or saved.</p>
      <details>
        <summary className="cursor-pointer font-medium">How to record a browser capture</summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Open Chrome DevTools, then Network. Turn off Preserve log and clear the request list.</li>
          <li>Choose a cache scenario. For a cold load, tick Disable cache. Otherwise leave it off for a normal cached load.</li>
          <li>Reload once. For a standard comparison, wait ten seconds without scrolling or playing video, then stop recording.</li>
          <li>Export HAR (sanitized) from Network and select the file below. Include only the intended page load.</li>
        </ol>
      </details>
      <p className="text-xs text-muted-foreground">A sanitized HAR can still contain private URLs and content. Only byte totals and an origin are retained in memory. Limits: 50 MiB, 100,000 requests, 1,000 navigations.</p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="har-file">Browser capture (.har or .json)</Label>
      <Input id="har-file" type="file" accept=".har,.json,application/json" onChange={importFile} aria-describedby="har-status" />
      <p id="har-status" role="status" className="text-sm text-muted-foreground">{busy ? "Reading capture locally..." : "No account or server connection is needed to import."}</p>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {summary && <>
      <div className="space-y-2">
        <Label htmlFor="har-navigation">Captured navigation</Label>
        <select id="har-navigation" className={selectClass} value={selectedId} onChange={event => { setSelectedId(event.target.value); setConfirmed(false); }}>
          {summary.navigations.map(page => <option key={page.id} value={page.id}>{page.label}</option>)}
        </select>
        {summary.navigations.length > 1 && <p className="text-xs text-muted-foreground">Choose one navigation. Third-party requests belonging to it are included; other navigations are kept separate.</p>}
      </div>
      {selected && <div className="rounded-lg border p-4 space-y-3 text-sm" aria-live="polite">
        <p><strong>{formatBytes(selected.measurement.totalBytes)}</strong> known transferred bytes across {selected.measurement.requestCount?.toLocaleString()} requests.</p>
        <p className="text-muted-foreground">{selected.measurement.byteBasis}. {selected.measurement.durationSeconds !== undefined && `Recorded request span: ${selected.measurement.durationSeconds.toFixed(1)} seconds.`}</p>
        {selected.error && <p role="alert" className="text-destructive">{selected.error}</p>}
        {selected.measurement.warnings.length > 0 && <ul className="list-disc pl-5 space-y-1 text-muted-foreground">{selected.measurement.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul>}
      </div>}
      <div className="space-y-2">
        <Label htmlFor="har-scenario">Capture scenario</Label>
        <select id="har-scenario" className={selectClass} value={scenario} onChange={event => setScenario(event.target.value as keyof typeof SCENARIOS)}>
          {Object.entries(SCENARIOS).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
        </select>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-carbon-red" checked={confirmed} disabled={!!selected?.error} onChange={event => setConfirmed(event.target.checked)} />
        <span>I confirm the intended page loaded successfully and this capture contains the activity I want to estimate.</span>
      </label>
    </>}
  </div>;
}
