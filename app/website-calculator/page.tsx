"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteCalculatorForm } from "@/components/website-calculator-form";
import { WebsiteCalculatorResults } from "@/components/website-calculator-results";
import type { WebsiteCalculation } from "@/lib/website-emissions";

export default function WebsiteCalculatorPage() {
  const [data, setData] = useState<WebsiteCalculation | null>(null);
  const [monthlyPageviews, setMonthlyPageviews] = useState("10000");
  return <div className="container py-10">
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Website Carbon Emission Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Estimate a page load's carbon footprint from transferred data using Sustainable Web Design Model v4.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Choose how to measure the page</CardTitle><CardDescription>Scan an accessible URL, privately import a browser capture, or enter a transferred size. Browser capture works with pages you can open normally, including protected sites.</CardDescription></CardHeader>
        <CardContent><WebsiteCalculatorForm setData={setData} monthlyPageviews={monthlyPageviews} setMonthlyPageviews={setMonthlyPageviews} /></CardContent>
      </Card>
      {data && <WebsiteCalculatorResults data={data} monthlyPageviews={monthlyPageviews} />}
      <div className="pt-6 space-y-5">
        <h2 className="text-2xl font-bold">How the estimate works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-lg">Measured data, estimated emissions</CardTitle><CardDescription>Transferred bytes are the model input. SWDM v4 estimates data-centre, network and device operations, plus allocated embodied emissions. It does not measure a website's actual electricity use.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-lg">Your capture stays local</CardTitle><CardDescription>HAR files are processed in a browser worker and discarded after a minimal summary is created. Private headers, content, URL paths and query strings are neither displayed nor uploaded.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-lg">Keep scenarios comparable</CardTitle><CardDescription>A cold load, cached load and video session can transfer very different amounts. The calculator uses your supplied bytes without applying another caching discount.</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle className="text-lg">Explicit assumptions</CardTitle><CardDescription>Unknown locations use the model's global grid defaults. Green hosting is a user declaration affecting data-centre operations only. The results show the model version and assumptions.</CardDescription></CardHeader></Card>
        </div>
        <p className="text-sm text-muted-foreground">Methodology: <a href="https://developers.thegreenwebfoundation.org/co2js/models/overview/" target="_blank" rel="noreferrer" className="underline">Green Web Foundation CO2.js</a> and <a href="https://sustainablewebdesign.org/estimating-digital-emissions/" target="_blank" rel="noreferrer" className="underline">Sustainable Web Design Model v4</a>.</p>
      </div>
    </div>
  </div>;
}
