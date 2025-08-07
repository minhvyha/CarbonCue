"use client";

import { Cpu, Database, LineChart, Server } from "lucide-react";

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
import { useEffect, useState } from "react";

import { useLoading } from "@/contexts/loading-context";
import { useToast } from "@/components/toast-provider";

interface provider {
  providerName: string;
  value: string;
}

interface region {
  regionName: string;
  offsetRatio: string;
  impact: number;
}

export default function AICalculatorPage() {
  const [gpus, setGpus] = useState<string[]>([]);

  const [providers, setProviders] = useState<provider[]>([]);
  const [regions, setRegions] = useState<region[]>([]);

  const [selectedGpu, setSelectedGpu] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [hours, setHours] = useState<number>(0);
  const [offset, setOffset] = useState<number>(100);
  const [impact, setImpact] = useState<number>(0);

  const { show, hide } = useLoading();
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      show();
      fetchData();
    }, 100);
  }, []);

  async function fetchData() {
    try {
      const gpuResponse = await fetch("/api/ai-calculator/gpus");
      const gpuData = await gpuResponse.json();
      setGpus(gpuData.gpus || []);

      const providerResponse = await fetch("/api/ai-calculator/providers");
      const providerData = await providerResponse.json();
      setProviders(providerData.providers || []);
      
      setSelectedGpu(gpuData.gpus[0]);
      setSelectedProvider(providerData.providers[0].value);

      fetchRegions(providerData.providers[0].value);
    } catch (error) {
      console.error("Error fetching impact data:", error);
      setImpact(0);
    } finally {
      hide();
    }
  }

  useEffect(() => {
    if (selectedProvider) {
      fetchRegions(selectedProvider);
    }
  }, [selectedProvider]);

  async function fetchRegions(providerName: string) {
    try {
      show();
      const response = await fetch("/api/ai-calculator/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ providerName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch regions");
      }

      const data = await response.json();
      setRegions(data.regions || []);

      setSelectedRegion(data.regions[0].regionName);

      setOffset(Number(data.regions[0].offsetRatio));
      setImpact(data.regions[0].impact);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
    } finally {
      hide();
    }
  }

  const handleCalculate = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGpu || !selectedProvider || !selectedRegion || hours <= 0)
      return toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });

    show();
    try {
      const response = await fetch("/api/ai-calculator/calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gpu: selectedGpu,
          provider: selectedProvider,
          region: selectedRegion,
          hours,
          customImpact: impact,
          customOffset: offset,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate emissions");
      }

      const result = await response.json();
      console.log("Calculation result:", result);
      toast({
        title: "Calculation Successful",
        description: `Estimated emissions: ${result.emissions} kg CO2`,
      });
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast({
        title: "Calculation Failed",
        description: "An error occurred while calculating emissions.",
        variant: "destructive",
      });
    }
    hide();
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            AI Carbon Emission Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your AI workloads including model
            training and inference.
          </p>
        </div>

        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="training">Model Training</TabsTrigger>
            <TabsTrigger value="inference">Model Inference</TabsTrigger>
          </TabsList>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Model Training Emissions</CardTitle>
                <CardDescription>
                  Calculate the carbon footprint of training your AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action="" onSubmit={handleCalculate}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="gpu-type">GPU Type</Label>
                      <select
                        id="gpu-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {gpus.map((gpu) => (
                        <option key={gpu} value={gpu}>
                          {gpu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="gpu-hours">GPU Hours</Label>
                    <Input
                      id="gpu-hours"
                      type="number"
                      placeholder="e.g., 100"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      min={1}
                      max={10000}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                    >
                      {providers.map((provider) => (
                        <option key={provider.value} value={provider.value}>
                          {provider.providerName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="region">Region</Label>
                    <select
                      id="region"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setOffset(
                          Number(
                            regions.find(
                              (region) => region.regionName === e.target.value
                            )?.offsetRatio || 1
                          )
                        );
                        setImpact(
                          regions.find(
                            (region) => region.regionName === e.target.value
                          )?.impact || 0
                        );
                      }}
                    >
                      {regions.map((region) => {
                        return (
                          <option
                            key={region.regionName}
                            value={region.regionName}
                          >
                            {region.regionName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="offset-ratio">Offset Ratio</Label>
                    <Input
                      id="offset-ratio"
                      type="number"
                      placeholder="e.g., 100"
                      value={offset}
                      onChange={(e) => setOffset(Number(e.target.value))}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="impact">Impact</Label>
                    <Input
                      id="impact"
                      type="number"
                      placeholder="e.g., 100"
                      value={impact}
                      onChange={(e) => setImpact(Number(e.target.value))}
                      min={1}
                      max={1000}
                    />
                  </div>
                  <Button className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
                    Calculate Training Emissions
                  </Button>
                </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inference">
            <Card>
              <CardHeader>
                <CardTitle>Model Inference Emissions</CardTitle>
                <CardDescription>
                  Calculate the carbon footprint of running inference with your
                  AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="inference-model">Model Type</Label>
                    <select
                      id="inference-model"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5">GPT-3.5</option>
                      <option value="llama">LLaMA</option>
                      <option value="custom">Custom Model</option>
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="monthly-requests">Monthly Requests</Label>
                    <Input
                      id="monthly-requests"
                      type="number"
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="avg-tokens">
                      Average Tokens per Request
                    </Label>
                    <Input
                      id="avg-tokens"
                      type="number"
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="inference-location">
                      Inference Location
                    </Label>
                    <Input
                      id="inference-location"
                      placeholder="e.g., US East"
                    />
                  </div>

                  <Button className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
                    Calculate Inference Emissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Understanding AI Carbon Emissions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Cpu className="h-8 w-8 text-carbon-purple mb-2" />
                <CardTitle>Computational Resources</CardTitle>
                <CardDescription>
                  AI models, especially large ones, require significant
                  computational resources that consume energy and produce carbon
                  emissions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-carbon-red mb-2" />
                <CardTitle>Data Center Impact</CardTitle>
                <CardDescription>
                  The location and energy mix of data centers where models are
                  trained and deployed significantly affects carbon footprint.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-carbon-deep-red mb-2" />
                <CardTitle>Model Size Matters</CardTitle>
                <CardDescription>
                  Larger models with more parameters require more energy for
                  both training and inference operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <LineChart className="h-8 w-8 text-carbon-magenta mb-2" />
                <CardTitle>Efficiency Improvements</CardTitle>
                <CardDescription>
                  Techniques like model distillation, quantization, and pruning
                  can significantly reduce the carbon footprint of AI systems.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
