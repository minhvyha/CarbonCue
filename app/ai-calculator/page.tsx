"use client";

import { Cpu, Database, LineChart, Server } from "lucide-react";
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

import { useLoading } from "@/contexts/loading-context";
import { useToast } from "@/components/toast-provider";

import { AiResults } from "@/components/ai-results";

interface ProviderType {
  providerName: string;
  name: string;
}

interface RegionType {
  regionName: string;
  offsetRatio: string | number;
  impact: number;
  country?: string;
}

export default function AICalculatorPage() {
  const [data, setData] = useState<any>(null);

  const [gpus, setGpus] = useState<string[]>([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [regions, setRegions] = useState<RegionType[]>([]);

  const [selectedGpu, setSelectedGpu] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [hours, setHours] = useState<number>(100);
  const [offset, setOffset] = useState<number>(100);
  const [impact, setImpact] = useState<number>(0);

  const { show, hide } = useLoading();
  const { toast } = useToast();

  useEffect(() => {
    // initial load
    let mounted = true;
    const init = async () => {
      show();
      try {
        const [gpuRes, providerRes] = await Promise.all([
          fetch("/api/ai-calculator/gpus"),
          fetch("/api/ai-calculator/providers"),
        ]);

        const gpuData = (await gpuRes.json()) ?? {};
        const providerData = (await providerRes.json()) ?? {};

        if (!mounted) return;

        setGpus(gpuData.gpus || []);
        setProviders(providerData.providers || []);

        const firstGpu = gpuData.gpus?.[0] ?? "";
        const firstProvider = providerData.providers?.[0]?.name ?? "";

        setSelectedGpu(firstGpu);
        setSelectedProvider(firstProvider);
        // fetchRegions will be triggered by the selectedProvider effect below
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast?.({
          title: "Load Error",
          description: "Failed to load GPU/provider data.",
          variant: "destructive",
        });
      } finally {
        hide();
      }
    };
    setTimeout(() => {
      init();
    }, 100);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchRegions(selectedProvider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider]);

  async function fetchRegions(providerName: string) {
    if (!providerName) return;
    show();
    try {
      const response = await fetch("/api/ai-calculator/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerName }),
      });

      if (!response.ok) throw new Error("Failed to fetch regions");

      const data = await response.json();
      const regionsData: RegionType[] = data.regions || [];
      setRegions(regionsData);

      const first = regionsData[0];
      if (first) {
        setSelectedRegion(first.regionName);
        setOffset(Number(first.offsetRatio) || 100);
        setImpact(first.impact ?? 0);
      } else {
        setSelectedRegion("");
        setOffset(100);
        setImpact(0);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
      toast?.({
        title: "Regions Error",
        description: "Could not load regions for selected provider.",
        variant: "destructive",
      });
    } finally {
      hide();
    }
  }

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGpu || !selectedProvider || !selectedRegion || hours <= 0) {
      return toast?.({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      });
    }

    show();
    try {
      const response = await fetch("/api/ai-calculator/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpu: selectedGpu,
          provider: selectedProvider,
          region: selectedRegion,
          hours,
          customImpact: impact,
          customOffset: offset,
        }),
      });

      if (!response.ok) throw new Error("Failed to calculate emissions");

      const result = await response.json();
      console.log("Calculation result:", result);
      setData(result);
      toast?.({
        title: "Calculation Successful",
        description: `Estimated emissions: ${result.co2} kg CO2`,
      });
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast?.({
        title: "Calculation Failed",
        description: "An error occurred while calculating emissions.",
        variant: "destructive",
      });
    } finally {
      hide();
    }
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">AI Carbon Emission Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your AI workloads including model training and inference.
          </p>
        </div>
            <Card>
              <CardHeader>
                <CardTitle>Model Training Emissions</CardTitle>
                <CardDescription>
                  Calculate the carbon footprint of training your AI models
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleCalculate} className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="gpu-type">GPU Type</Label>
                    <select
                      id="gpu-type"
                      value={selectedGpu}
                      onChange={(e) => setSelectedGpu(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    >
                      {gpus.length === 0 ? (
                        <option value="">No GPUs available</option>
                      ) : (
                        gpus.map((gpu) => (
                          <option key={gpu} value={gpu}>
                            {gpu}
                          </option>
                        ))
                      )}
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
                      max={100000}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    >
                      {providers.length === 0 ? (
                        <option value="">No providers</option>
                      ) : (
                        providers.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.providerName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="region">Region</Label>
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedRegion(val);
                        const found = regions.find((r) => r.regionName === val);
                        setOffset(Number(found?.offsetRatio ?? 100));
                        setImpact(found?.impact ?? 0);
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    >
                      {regions.length === 0 ? (
                        <option value="">No regions</option>
                      ) : (
                        regions.map((r) => (
                          <option key={`${r.regionName}-${r.country ?? ""}`} value={r.regionName}>
                            {r.regionName}
                          </option>
                        ))
                      )}
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
                      min={0}
                      max={1000}
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
                      min={0}
                      max={100000}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
                    Calculate Training Emissions
                  </Button>
                </form>
              </CardContent>
            </Card>
            {data && <AiResults data={data} />}


        <div className="mt-16">
  <h2 className="text-2xl font-bold mb-6">Understanding AI Carbon Emissions</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <Cpu className="h-8 w-8 text-carbon-purple mb-2" />
        <CardTitle>Energy Grid Carbon Intensity</CardTitle>
        <CardDescription>
          The carbon intensity of the electricity used matters a lot — it can vary by orders of
          magnitude between locations. Training the same model in a low-carbon region can produce
          dramatically less CO₂e than training in a fossil-heavy grid.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <Server className="h-8 w-8 text-carbon-red mb-2" />
        <CardTitle>Data Center Efficiency & Location</CardTitle>
        <CardDescription>
          Choose data center regions consciously: local grid mix and data center efficiency (PUE)
          influence total emissions. Providers also use offsets/RECs — region selection still changes
          direct emissions significantly.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <Database className="h-8 w-8 text-carbon-deep-red mb-2" />
        <CardTitle>Compute, Model Size & Training Time</CardTitle>
        <CardDescription>
          Model size, hardware choice and total training time are primary drivers of energy use.
          Larger models or long runs on many GPUs produce far more CO₂e — using efficient hardware
          or fine-tuning pre-trained models can greatly reduce footprint.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <LineChart className="h-8 w-8 text-carbon-magenta mb-2" />
        <CardTitle>Reduce & Measure — Practical Steps</CardTitle>
        <CardDescription>
          Measure CO₂e (use calculators/tools), prefer low-carbon regions, pick efficient hardware
          (higher TFLOPS/W), reduce wasted experiments (fewer failed runs), and apply model compression
          (distillation, quantization, pruning) to lower inference and training costs.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>

  {/* Credit / source line */}
  <div className="mt-4 text-sm text-gray-500">
    <span className="block">
      Sources: Lacoste et al., <em>Quantifying the Carbon Emissions of Machine Learning</em>, and the
      ML CO₂ dataset/impact page —{' '}
      <a
        href="https://mlco2.github.io/impact/#learn"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        mlco2.github.io/impact/#learn
      </a>
      .
    </span>
  </div>
</div>

      </div>
    </div>
  );
}
