"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { set } from "mongoose"

export function WebsiteCalculatorForm({setData}: { setData: (data: any) => void }) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  function manualCalculation(data: any) {
    let bytes = data.totalBytes || 0;
    let green = data.websiteCarbon?.green || true;
  if (!bytes || bytes <= 0) return;

  // --- SWDM & CO2.js constants ---
  const ADJUSTMENT_FACTOR       = 0.7554;   // network/header/etc overhead
  const ENERGY_INTENSITY_GB     = 0.7545;   // kWh per GB transferred
  const GRID_CARBON_INTENSITY   = 351;      // g CO₂ per kWh (grid avg)
  const RENEWABLE_INTENSITY     = 288;      // g CO₂ per kWh (renewables)
  const CO2_GAS_DENSITY         = 1.8;      // g CO₂ per litre CO₂

  // 1) adjust bytes
  const adjustedBytes = bytes * ADJUSTMENT_FACTOR;

  // 2) convert to GB & compute energy
  const GB      = adjustedBytes / 1e9;
  const energy  = GB * ENERGY_INTENSITY_GB; // kWh

  // 3) compute CO₂ in grams
  const co2Grid_g       = energy * GRID_CARBON_INTENSITY;
  const co2Renewable_g  = energy * RENEWABLE_INTENSITY;

  // 4) convert grams → litres
  const litresGrid      = co2Grid_g      / CO2_GAS_DENSITY;
  const litresRenewable = co2Renewable_g / CO2_GAS_DENSITY;

  // 5) rating thresholds (bytes)
  // A+ : < 100 KB
  // A  : 100 KB – 250 KB
  // A- : 250 KB – 500 KB
  // B  : 500 KB – 1 MB
  // C  : 1 MB – 2 MB
  // D  : 2 MB – 3 MB
  // F  : > 3 MB
  let rating: string;
  if      (bytes < 100 * 1024)           rating = "A+";
  else if (bytes < 250 * 1024)           rating = "A";
  else if (bytes < 500 * 1024)           rating = "A-";
  else if (bytes < 1   * 1024 * 1024)    rating = "B";
  else if (bytes < 2   * 1024 * 1024)    rating = "C";
  else if (bytes < 3   * 1024 * 1024)    rating = "D";
  else                                   rating = "F";
  // 6) make up a 'cleanerThan' stat based on page size
  const MAX_BYTES = 3 * 1024 * 1024; // 3 MB as 100% worst
  let cleanerThan = (MAX_BYTES - bytes) / MAX_BYTES;
  if (cleanerThan < 0) cleanerThan = 0;
  // Round to two decimals
  cleanerThan = Math.round(cleanerThan * 100) / 100; // e.g. 0.75 means cleaner than 75% of sites

  // 7) assemble the results object
  const websiteCarbon = {
    url:       data.url,
    green:     green,
    bytes:     bytes,
    cleanerThan: cleanerThan,
    rating,
    statistics: {
      adjustedBytes,
      energy,
      co2: {
        grid:      { grams: co2Grid_g,      litres: litresGrid },
        renewable: { grams: co2Renewable_g, litres: litresRenewable },
      },
    },
    timestamp: Math.floor(Date.now() / 1000),
  };

  // 8) update state
  setData((prev: any) => ({
    ...prev,
    websiteCarbon,
  }));
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)

    // Simulate API call
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
    
       fetch(`${baseUrl}/api/emissioncalculator/${encodeURIComponent(url)}`, {
        cache: "no-store",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        return res.json()
      }).then((data) => {
        setData(data)
        console.log("Fetched data:", data)
        manualCalculation( data);
      }).catch((error) => {
        console.error("Error fetching data:", error)
        setData(null)
      }).finally(() => {
        setIsLoading(false)
        setUrl("") // Clear input after submission
      })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-3">
        <Label htmlFor="website-url">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="website-url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !url} className="bg-carbon-red hover:bg-carbon-deep-red">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Analyze</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="time-period">Time Period</Label>
          <select
            id="time-period"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="energy-source">Energy Source</Label>
          <select
            id="energy-source"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="mixed">Mixed (Default)</option>
            <option value="renewable">Renewable</option>
            <option value="non-renewable">Non-Renewable</option>
          </select>
        </div>
      </div>
    </form>
  )
}
