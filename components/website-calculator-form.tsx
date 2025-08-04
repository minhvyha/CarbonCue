"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WebsiteCalculatorForm({setData}: { setData: (data: any) => void }) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  function manualCalculation(data: any) {
    let bytes = data.totalBytes || 0;
    let green = data.websiteCarbon?.green || true;
    if (!bytes || bytes <= 0) return;

    // --- constants from SWDM & CO2.js ---
    const ADJUSTMENT_FACTOR        = 0.7554;   // network/header/etc overhead
    const ENERGY_INTENSITY_PER_GB  = 0.7545;   // kWh per GB transferred
    const GRID_CARBON_INTENSITY    = 351;      // g CO2 per kWh (grid avg)
    const RENEWABLE_INTENSITY      = 288;      // g CO2 per kWh (100% renewables)
    const CO2_GAS_DENSITY          = 1.8;      // g CO2 per litre CO2

    // 1) adjust bytes
    const adjustedBytes = bytes * ADJUSTMENT_FACTOR;

    // 2) to GB & energy
    const GB         = adjustedBytes / 1e9;
    const energy     = GB * ENERGY_INTENSITY_PER_GB; // kWh

    // 3) co2 in grams
    const co2grid_g  = energy * GRID_CARBON_INTENSITY;
    const co2ren_g   = energy * RENEWABLE_INTENSITY;

    // 4) convert to litres
    const litresGrid = co2grid_g / CO2_GAS_DENSITY;
    const litresRen  = co2ren_g  / CO2_GAS_DENSITY;

    // Build the websiteCarbon object
    const websiteCarbon = {
      url:            data.url,
      green:          green,
      bytes:          bytes,
      cleanerThan:    null,     // you could compute this if you have distribution data
      rating:         null,     // likewise, derive A+/A/B…
      statistics: {
        adjustedBytes,
        energy,
        co2: {
          grid: {
            grams:   co2grid_g,
            litres:  litresGrid,
          },
          renewable: {
            grams:   co2ren_g,
            litres:  litresRen,
          },
        },
      },
      timestamp: Math.floor(Date.now() / 1000),
    };

    // Merge into your data state
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
    
       fetch(`${baseUrl}/api/websitecarbon/${encodeURIComponent(url)}`, {
        cache: "no-store",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        return res.json()
      }).then((data) => {
        console.log(data)
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
