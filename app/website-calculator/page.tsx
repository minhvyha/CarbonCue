'use client'
import { Cloud, FileText, Globe, Server } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebsiteCalculatorForm } from "@/components/website-calculator-form"
import { WebsiteCalculatorResults } from "@/components/website-calculator-results"

export default function WebsiteCalculatorPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // This effect can be used to fetch initial data if needed
    // For example, you could fetch some default values or settings
    // setData(initialData);
    console.log("Website Calculator initialized with data:", data);

    
  }, [data]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Website Carbon Emission Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your website based on file size, server location, and client location.
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
                <CardDescription>Enter your website URL and we'll analyze its carbon footprint</CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteCalculatorForm setData={setData}/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Calculation</CardTitle>
                <CardDescription>Enter website details manually to calculate carbon emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="page-size">Page Size (KB)</Label>
                    <Input id="page-size" type="number" placeholder="e.g., 2500" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="server-location">Server Location</Label>
                    <Input id="server-location" placeholder="e.g., United States" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="monthly-visits">Monthly Visits</Label>
                    <Input id="monthly-visits" type="number" placeholder="e.g., 10000" />
                  </div>

                  <Button className="w-full bg-carbon-red hover:bg-carbon-deep-red">Calculate Emissions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <WebsiteCalculatorResults />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-carbon-red mb-2" />
                <CardTitle>File Size Analysis</CardTitle>
                <CardDescription>
                  We analyze the total file size of your website, including HTML, CSS, JavaScript, images, and other
                  assets.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-carbon-purple mb-2" />
                <CardTitle>Server Location</CardTitle>
                <CardDescription>
                  The location of your server affects carbon emissions based on the energy mix of that region.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-carbon-deep-red mb-2" />
                <CardTitle>Client Location</CardTitle>
                <CardDescription>
                  The distance data travels between server and client impacts the energy used for transmission.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="h-8 w-8 text-carbon-magenta mb-2" />
                <CardTitle>Energy Mix</CardTitle>
                <CardDescription>
                  We factor in the energy mix of different regions to calculate more accurate carbon emissions basedd on
                  renewable vs. non-renewable sources.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
