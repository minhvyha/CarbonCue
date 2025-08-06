"use client";

import React, { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { Search, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast-provider";

// --- Constants & Thresholds ---
const ADJUSTMENT_FACTOR = 0.7554; // network/header/etc overhead
const ENERGY_INTENSITY_GB = 0.7545; // kWh per GB transferred
const GRID_CARBON_INTENSITY = 351; // g CO₂ per kWh (grid avg)
const RENEWABLE_INTENSITY = 288; // g CO₂ per kWh (renewables)
const CO2_GAS_DENSITY = 1.8; // g CO₂ per litre CO₂
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

// Rating thresholds in bytes
const RATING_THRESHOLDS: { limit: number; label: string }[] = [
  { limit: 100 * 1024, label: "A+" },
  { limit: 250 * 1024, label: "A" },
  { limit: 500 * 1024, label: "A-" },
  { limit: 1 * 1024 * 1024, label: "B" },
  { limit: 2 * 1024 * 1024, label: "C" },
  { limit: 3 * 1024 * 1024, label: "D" },
];

interface EmissionData {
  url?: string;
  totalBytes?: number;
}

// --- Utility: Compute all emissions stats ---
function calculateEmissions(data: EmissionData, green: boolean) {
  const bytes = data.totalBytes || 0;
  if (bytes <= 0) {
    return null;
  }

  // 1) adjust bytes
  const adjustedBytes = bytes * ADJUSTMENT_FACTOR;

  // 2) convert to GB & compute energy
  const GB = adjustedBytes / 1e9;
  const energy = GB * ENERGY_INTENSITY_GB; // kWh

  // 3) compute CO₂ in grams
  const co2Grid_g = energy * GRID_CARBON_INTENSITY;
  const co2Renewable_g = energy * RENEWABLE_INTENSITY;

  // 4) convert grams → litres
  const litresGrid = co2Grid_g / CO2_GAS_DENSITY;
  const litresRenewable = co2Renewable_g / CO2_GAS_DENSITY;

  // 5) determine rating
  const rating = RATING_THRESHOLDS.find((t) => bytes < t.limit)?.label ?? "F";

  // 6) make up a 'cleanerThan' stat
  let cleanerThan = Math.max(0, (MAX_BYTES - bytes) / MAX_BYTES);
  cleanerThan = Math.round(cleanerThan * 100) / 100;

  return {
    url: data.url || null,
    green,
    bytes,
    cleanerThan,
    rating,
    statistics: {
      adjustedBytes,
      energy,
      co2: {
        grid: { grams: co2Grid_g, litres: litresGrid },
        renewable: { grams: co2Renewable_g, litres: litresRenewable },
      },
    },
    timestamp: Math.floor(Date.now() / 1000),
  };
}

export function WebsiteCalculatorForm({
  setData,
  monthlyVisitors,
  setMonthlyVisitors,
}: {
  setData: (data: any) => void;
  monthlyVisitors: string;
  setMonthlyVisitors: (visitors: string) => void;
}) {
  // --- State ---
  const [url, setUrl] = useState("");
  const [pageSize, setPageSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [green, setGreen] = useState(false);
  const { toast } = useToast();

  // --- Handlers ---
  const handleUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value) setPageSize("");
  }, []);

  const handlePageSizeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPageSize(e.target.value);
      if (e.target.value) setUrl("");
    },
    []
  );

  const handleEnergyChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setGreen(e.target.value === "renewable");
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!url && !pageSize) return;
      setIsLoading(true);
      if (pageSize) {
        const emissionDetails = calculateEmissions(
          { totalBytes: parseInt(pageSize) },
          green
        );
        setData({
          totalBytes: parseInt(pageSize),
          url: null,
          emissionDetails: emissionDetails,
          breakdown: {
            assets: {
              html: 0,
              css: 0,
              js: 0,
              images: 0,
              fonts: 0,
              other: 0,
            },
          },

          serverInfo: {
            ip: "N/A",
            server: "N/A",
          },
        });
        setIsLoading(false);
        toast({
          title: "Page Size Calculated",
          description: `Emissions calculated for ${pageSize} KB page size.`,
        });
        return;
      }

      try {
        const endpoint = url
          ? `/api/emissioncalculator/${encodeURIComponent(url)}`
          : `/api/emissioncalculator/pagesize/${pageSize}`;

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) {
          const errMsg = res.statusText || "Unknown server error";
          const errCode = res.status ? ` [${res.status}]` : "";
          throw new Error(`${errMsg}${errCode}`);
        }

        const data: EmissionData = await res.json();
        setData(data);

        const emissionDetails = calculateEmissions(data, green);
        if (emissionDetails) {
          setData((prev: any) => ({
            ...prev,
            emissionDetails,
          }));
        }
        toast({
          title: "Calculation Complete",
          description: `Emissions calculated for ${url || pageSize} with ${
            green ? "renewable" : "mixed"
          } energy source.`,
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setData(null);
      } finally {
        setIsLoading(false);
        
        setUrl("");
        setPageSize("");
      }
    },
    [url, pageSize, green, setData, toast]
  );

  // --- JSX ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info box */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter either a website URL <strong>OR</strong> a page size in KB - not
          both. We'll analyze your website automatically or use your custom page
          size.
        </p>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="website-url" className="flex items-center gap-2">
          Website URL{" "}
          <span className="text-xs text-muted-foreground">(Option 1)</span>
        </Label>
        <Input
          id="website-url"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          disabled={!!pageSize}
          className={pageSize ? "opacity-50 cursor-not-allowed" : ""}
        />
      </div>

      {/* OR Divider */}
      <div className="relative flex items-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative px-2 bg-card text-xs uppercase text-muted-foreground font-bold">
          OR
        </span>
      </div>

      {/* Page Size Input */}
      <div className="space-y-2">
        <Label htmlFor="page-size" className="flex items-center gap-2">
          Page Size{" "}
          <span className="text-xs text-muted-foreground">(Option 2)</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="page-size"
            type="number"
            placeholder="2400"
            value={pageSize}
            min={1}
            max={200000000}
            disabled={!!url}
            onChange={handlePageSizeChange}
            className={url ? "opacity-50 cursor-not-allowed flex-1" : "flex-1"}
          />
          <span className="text-sm text-muted-foreground">KB</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || (!url && !pageSize)}
        className="w-full bg-carbon-red hover:bg-carbon-deep-red"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Analyzing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>
              {url
                ? "Analyze Website"
                : pageSize
                ? "Calculate Emissions"
                : "Enter URL or Page Size"}
            </span>
          </div>
        )}
      </Button>

      {/* Monthly Visitors & Energy Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="monthly-visitors">Monthly Visitors</Label>
          <Input
            id="monthly-visitors"
            type="number"
            placeholder="10000"
            value={monthlyVisitors}
            onChange={(e) => setMonthlyVisitors(e.target.value)}
            min={1}
            max={10000000}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="energy-source">Energy Source</Label>
          <select
            id="energy-source"
            onChange={handleEnergyChange}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm 
                       placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                       focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="mixed">Mixed (Default)</option>
            <option value="renewable">Renewable</option>
            <option value="non-renewable">Non-Renewable</option>
          </select>
        </div>
      </div>
    </form>
  );
}
