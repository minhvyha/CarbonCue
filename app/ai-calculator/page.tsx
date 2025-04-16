import { Cpu, Database, LineChart, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AICalculatorPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">AI Carbon Emission Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the carbon footprint of your AI workloads including model training and inference.
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
                <CardDescription>Calculate the carbon footprint of training your AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="model-type">Model Type</Label>
                    <select
                      id="model-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="transformer">Transformer (LLM)</option>
                      <option value="cnn">Convolutional Neural Network</option>
                      <option value="rnn">Recurrent Neural Network</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="gpu-hours">GPU Hours</Label>
                    <Input id="gpu-hours" type="number" placeholder="e.g., 100" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="gpu-type">GPU Type</Label>
                    <select
                      id="gpu-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="v100">NVIDIA V100</option>
                      <option value="a100">NVIDIA A100</option>
                      <option value="t4">NVIDIA T4</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="data-center">Data Center Location</Label>
                    <Input id="data-center" placeholder="e.g., US East" />
                  </div>

                  <Button className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
                    Calculate Training Emissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inference">
            <Card>
              <CardHeader>
                <CardTitle>Model Inference Emissions</CardTitle>
                <CardDescription>
                  Calculate the carbon footprint of running inference with your AI models
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
                    <Input id="monthly-requests" type="number" placeholder="e.g., 10000" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="avg-tokens">Average Tokens per Request</Label>
                    <Input id="avg-tokens" type="number" placeholder="e.g., 1000" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="inference-location">Inference Location</Label>
                    <Input id="inference-location" placeholder="e.g., US East" />
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
          <h2 className="text-2xl font-bold mb-6">Understanding AI Carbon Emissions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Cpu className="h-8 w-8 text-carbon-purple mb-2" />
                <CardTitle>Computational Resources</CardTitle>
                <CardDescription>
                  AI models, especially large ones, require significant computational resources that consume energy and
                  produce carbon emissions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Server className="h-8 w-8 text-carbon-red mb-2" />
                <CardTitle>Data Center Impact</CardTitle>
                <CardDescription>
                  The location and energy mix of data centers where models are trained and deployed significantly
                  affects carbon footprint.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-carbon-deep-red mb-2" />
                <CardTitle>Model Size Matters</CardTitle>
                <CardDescription>
                  Larger models with more parameters require more energy for both training and inference operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <LineChart className="h-8 w-8 text-carbon-magenta mb-2" />
                <CardTitle>Efficiency Improvements</CardTitle>
                <CardDescription>
                  Techniques like model distillation, quantization, and pruning can significantly reduce the carbon
                  footprint of AI systems.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
