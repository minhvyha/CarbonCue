"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Tv, Home, Plane, Lightbulb, Droplets } from "lucide-react";

// Updated component: displays a dedicated "Calculation Result" section
// It supports two shapes of incoming data:
// 1) data.calculationResult = { energy, impact, co2, offset, offsetPercents }
// 2) flat data object with those keys directly on `data`.
export function AiResults({ data }: { data: any }) {
  if (!data) return null;

  // Prefer explicit calculationResult, otherwise try top-level fields
  const calc =
    data.calculationResult ??
    (typeof data.co2 !== "undefined" || typeof data.energy !== "undefined"
      ? {
          energy: data.energy,
          impact: data.impact,
          co2: data.co2,
          offset: data.offset,
          offsetPercents: data.offsetPercents,
        }
      : null);

  const co2Kg = typeof calc?.co2 === "number" ? calc.co2 : typeof data.co2 === "number" ? data.co2 : 0;
  const totalCO2g = co2Kg * 1000;

  // Add offset/energy derived values
  const offsetKg = typeof calc?.offset === "number" ? calc.offset : 0;
  const offsetPerc = typeof calc?.offsetPercents === "number" ? calc.offsetPercents : 0;
  // energyOffsetKWh = offset (kg) ÷ impact (kg/kWh) -- guard against zero/undefined
  const energyOffsetKWh = calc?.impact ? offsetKg / calc.impact : 0;
  // energyOffset as percent of total energy used
  const energyOffsetPerc = calc?.energy ? (energyOffsetKWh / calc.energy) * 100 : 0;

  // Define per-unit CO₂ rates (all in grams):
  const rates = {
    microwave: 400, // g per use
    tv: 170, // g per hour
    household: 42000, // g per day (42 kg/day)
    flight: 160, // g per km
    bulb: 6.1, // g per hour (10 W)
    waterHeater: 16.2, // g per litre (0.0162 kg/L)
  };

  const funFacts = [
    {
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      title: "Microwave Uses",
      // number of uses = totalCO2g ÷ rate
      value: `${(totalCO2g / rates.microwave).toFixed(1)}`,
      unit: "uses",
      description: "Full-power microwave cycles",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: <Tv className="h-6 w-6 text-indigo-600" />,
      title: "TV Watching",
      value: `${(totalCO2g / rates.tv).toFixed(1)}`,
      unit: "hours",
      description: "Watching a 50\u2033 LED TV",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      icon: <Home className="h-6 w-6 text-emerald-600" />,
      title: "Household Days",
      // convert CO₂ to days: divide by g/day
      value: `${(totalCO2g / rates.household).toFixed(2)}`,
      unit: "days",
      description: "Avg. Australian household footprint",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: <Plane className="h-6 w-6 text-sky-600" />,
      title: "Flight Distance",
      value: `${(totalCO2g / rates.flight).toFixed(0)}`,
      unit: "km",
      description: "Economy-class air travel",
      bg: "bg-sky-50 dark:bg-sky-950/20",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
      title: "LED Bulb Hours",
      value: `${(totalCO2g / rates.bulb).toFixed(0)}`,
      unit: "hours",
      description: "10 W LED bulb runtime",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: <Droplets className="h-6 w-6 text-cyan-600" />,
      title: "Water Heating",
      value: `${(totalCO2g / rates.waterHeater).toFixed(1)}`,
      unit: "L",
      description: "Water heated from cold to boiling",
      bg: "bg-cyan-50 dark:bg-cyan-950/20",
    },
  ];

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carbon Emission Results</CardTitle>
          <CardDescription>
            Analysis for{" "}
            <a href={data.url || "#"} target="_blank" rel="noopener noreferrer">
              {data.url || (data.totalBytes ? `${data.totalBytes} bytes` : "Result")}
            </a>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* NEW: Display the calculation result (energy, impact, co2, offset, offsetPercents) */}
          {calc && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Energy</div>
                <div className="text-xl font-bold">{formatNumber(calc.energy)} kWh</div>
                <div className="text-xs text-muted-foreground">Total energy used</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Impact</div>
                <div className="text-xl font-bold">{formatNumber(calc.impact)} kg/kWh</div>
                <div className="text-xs text-muted-foreground">Emission intensity</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">CO₂ Emitted</div>
                <div className="text-xl font-bold">{formatNumber(calc.co2)} kg</div>
                <div className="text-xs text-muted-foreground">Equivalent CO₂</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Offset</div>
                <div className="text-xl font-bold">{formatNumber(calc.offset)} kg</div>
                <div className="text-xs text-muted-foreground">CO₂ offset</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Offset Ratio</div>
                <div className="text-xl font-bold">{formatNumber(calc.offsetPercents)}%</div>
                <div className="text-xs text-muted-foreground">Percentage offset</div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Fun Facts About Your Carbon Footprint</h3>
            <p className="text-sm text-muted-foreground mb-6">These fun facts are calculated from your AI's total carbon emissions over one month of visits.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {funFacts.map(({ icon, title, value, unit, description, bg }) => (
                <FunFactCard key={title} icon={icon} title={title} value={`${value} ${unit}`} description={description} bgColor={bg} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Zap className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Energy Impact Perspective</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                    Your AI's carbon footprint of <strong>{(totalCO2g / 1000).toFixed(2)} kg CO₂</strong> is equivalent to running a microwave for <strong>{(totalCO2g / rates.microwave).toFixed(1)} uses</strong> or watching TV for <strong>{(totalCO2g / rates.tv).toFixed(1)} hours</strong>. Small optimizations can make a big difference!
                  </p>

                  {/* NEW: offset sentence + energy-equivalent highlight */}
                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed mt-3">
                    Additionally, <strong>{formatNumber(offsetKg)} kg</strong> ({formatNumber(offsetPerc)}%) of this CO₂ has been offset. This corresponds to approximately <strong>{formatNumber(energyOffsetKWh)} kWh</strong> of energy offset from the selected providers — about <strong>{formatNumber(energyOffsetPerc)}</strong>% of the total energy used, calculated using the provider emission factor you supplied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function FunFactCard({
  icon,
  title,
  value,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className={`${bgColor} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <p className="text-xs text-muted-foreground leading-tight">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytesString: string) {
  const bytes = parseInt(bytesString, 10);
  if (isNaN(bytes)) return "Invalid input";

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
function formatWeight(grams: number) {
  const units = ["g", "kg", "t"];
  let size = grams;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(3)} ${units[unitIndex]}`;
}
function formatLitres(litres: number) {
  const units = ["L", "mL"];
  let size = litres;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(3)} ${units[unitIndex]}`;
}

function formatNumber(n: any) {
  if (typeof n === "number") return n.toFixed(2);
  if (typeof n === "string" && !isNaN(parseFloat(n))) return parseFloat(n).toFixed(2);
  return "N/A";
}
