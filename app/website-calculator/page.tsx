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
  const [data, setData] = useState<any>(null);
  const [manualData, setManualData] = useState<any>(null);
  const [monthlyVisitors, setMonthlyVisitors] = useState("10000")
  const [bytes, setBytes] = useState<number | undefined>();
  const [green, setGreen] = useState<boolean>(false);

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
          <h1 className="text-4xl font-bold mb-4">
            Website Carbon Emission Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your website based on file size,
            server location, and client location.
          </p>
        </div>

     

            <Card>
              <CardHeader className="pb-[1rem]">
                <CardTitle>Calculate by URL or Manual Input</CardTitle>
                <CardDescription>
                  Provide your website URL or manually input the total byte size to estimate its carbon emissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteCalculatorForm setData={setData} monthlyVisitors={monthlyVisitors} setMonthlyVisitors={setMonthlyVisitors} />
              </CardContent>
            </Card>

 

        {data && <WebsiteCalculatorResults data={data} monthlyVisitors={monthlyVisitors} />}
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
