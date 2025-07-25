"use client";
import { Cloud, FileText, Globe, Server } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteCalculatorForm } from "@/components/website-calculator-form";
import { WebsiteCalculatorResults } from "@/components/website-calculator-results";

export default function WebsiteCalculatorPage() {
  const [data, setData] = useState({
    url: "https://www.websitecarbon.com/",
    serverInfo: {
      ip: "172.67.178.71",
      server: "cloudflare",
    },
    totalBytes: 311046,
    breakdown: {
      document: 53720,
      script: 154552,
      stylesheet: 76031,
      image: 3977,
      font: 21376,
      other: 1390,
    },
    websiteCarbon: {
      url: "https://www.websitecarbon.com/",
      green: true,
      bytes: 174823,
      cleanerThan: 0.96,
      rating: "A+",
      statistics: {
        adjustedBytes: 131991.365,
        energy: 0.00009957049568183721,
        co2: {
          grid: {
            grams: 0.04401015909137205,
            litres: 0.024478450486621128,
          },
          renewable: {
            grams: 0.03815541394528002,
            litres: 0.021222041236364744,
          },
        },
      },
      timestamp: 1752400673,
    },
  });
  const [manualData, setManualData] = useState<any>(null);
  const [bytes, setBytes] = useState<number | undefined>();
  const [green, setGreen] = useState<boolean | undefined>(true);

  useEffect(() => {
    // This effect can be used to fetch initial data if needed
    // For example, you could fetch some default values or settings
    // setData(initialData);
    console.log("Website Calculator initialized with data:", data);
  }, [data]);

  async function manualCalculation(e: React.FormEvent) {
    e.preventDefault();
    if(!bytes || bytes <= 0 || green === undefined) {
      console.log("Bytes:", bytes, "Green:", green);
      return;
    }
    // Simulate API call
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    console.log(`${baseUrl}/api/websitecarbon/${bytes}/${green}}`)
    fetch(`${baseUrl}/api/manual/${bytes}/${green}}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setManualData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {});
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Website Carbon Emission Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your website based on file size,
            server location, and client location.
          </p>
        </div>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="url">Website URL</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle>Calculate by URL</CardTitle>
                <CardDescription>
                  Enter your website URL and we'll analyze its carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteCalculatorForm setData={setData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Calculation</CardTitle>
                <CardDescription>
                  Enter website details manually to calculate carbon emissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="page-size">Page Size (KB)</Label>
                    <Input
                      id="page-size"
                      type="number"
                      placeholder="e.g., 2500"
                      value={bytes}
                      onChange={(e) => setBytes(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="model-type">Sustainable Hosting</Label>
                    <select
                      id="model-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setGreen(e.target.value === "true")}
                      value={green ? "true" : "false"}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <Button className="w-full bg-carbon-red hover:bg-carbon-deep-red" onClick={manualCalculation} disabled={!bytes || bytes <= 0 || green === undefined}>
                    Calculate Emissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {data && <WebsiteCalculatorResults data={data} />}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-carbon-red mb-2" />
                <CardTitle>File Size Analysis</CardTitle>
                <CardDescription>
                  We analyze the total file size of your website, including
                  HTML, CSS, JavaScript, images, and other assets.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-carbon-purple mb-2" />
                <CardTitle>Server Location</CardTitle>
                <CardDescription>
                  The location of your server affects carbon emissions based on
                  the energy mix of that region.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-carbon-deep-red mb-2" />
                <CardTitle>Client Location</CardTitle>
                <CardDescription>
                  The distance data travels between server and client impacts
                  the energy used for transmission.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="h-8 w-8 text-carbon-magenta mb-2" />
                <CardTitle>Energy Mix</CardTitle>
                <CardDescription>
                  We factor in the energy mix of different regions to calculate
                  more accurate carbon emissions basedd on renewable vs.
                  non-renewable sources.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
