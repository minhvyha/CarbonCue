import type React from "react"
import { BarChart, Car, Home, Leaf, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarbonTrackerForm } from "@/components/carbon-tracker-form"

export default function CarbonTrackerPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Daily Carbon Footprint Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor and reduce your personal carbon footprint with our interactive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Carbon Footprint</CardTitle>
                <CardDescription>Track your daily emissions and see how you compare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">8.2 kg</div>
                    <div className="text-sm text-muted-foreground">CO₂e today</div>
                    <div className="mt-4 flex justify-center">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        12% below your average
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Breakdown by Category</h3>
                    <CategoryBreakdown
                      icon={<Home className="h-4 w-4" />}
                      label="Home Energy"
                      value="3.1 kg"
                      percentage={38}
                      color="bg-carbon-red"
                    />
                    <CategoryBreakdown
                      icon={<Car className="h-4 w-4" />}
                      label="Transportation"
                      value="2.7 kg"
                      percentage={33}
                      color="bg-carbon-purple"
                    />
                    <CategoryBreakdown
                      icon={<ShoppingBag className="h-4 w-4" />}
                      label="Consumption"
                      value="1.5 kg"
                      percentage={18}
                      color="bg-carbon-deep-red"
                    />
                    <CategoryBreakdown
                      icon={<BarChart className="h-4 w-4" />}
                      label="Digital"
                      value="0.9 kg"
                      percentage={11}
                      color="bg-carbon-magenta"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  Carbon emissions chart placeholder
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Log Activity</CardTitle>
                <CardDescription>Add your daily activities to track emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonTrackerForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Tips</CardTitle>
                <CardDescription>Personalized recommendations to reduce your footprint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SustainabilityTip
                    title="Switch to LED Bulbs"
                    description="Replace your home lighting with LED bulbs to save energy."
                    icon={<Leaf className="h-5 w-5 text-green-600" />}
                  />
                  <SustainabilityTip
                    title="Reduce Meat Consumption"
                    description="Try having one meat-free day per week to reduce emissions."
                    icon={<Leaf className="h-5 w-5 text-green-600" />}
                  />
                  <SustainabilityTip
                    title="Use Public Transport"
                    description="Take public transport for your commute twice a week."
                    icon={<Leaf className="h-5 w-5 text-green-600" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Reduction Goals</CardTitle>
              <CardDescription>Track your progress towards your sustainability targets</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GoalCard title="Reduce Home Energy" target="15 kg CO₂e" current="12.4 kg CO₂e" percentage={83} />
                    <GoalCard
                      title="Lower Transportation Emissions"
                      target="20 kg CO₂e"
                      current="18.9 kg CO₂e"
                      percentage={95}
                    />
                    <GoalCard title="Digital Carbon Diet" target="5 kg CO₂e" current="3.2 kg CO₂e" percentage={64} />
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    Monthly goals chart placeholder
                  </div>
                </TabsContent>

                <TabsContent value="yearly">
                  <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    Yearly goals chart placeholder
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CategoryBreakdown({
  icon,
  label,
  value,
  percentage,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  percentage: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">{icon}</span>
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Progress value={percentage} className={`h-2 ${color}`} />
    </div>
  )
}

function SustainabilityTip({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function GoalCard({
  title,
  target,
  current,
  percentage,
}: {
  title: string
  target: string
  current: string
  percentage: number
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <Progress value={percentage} className="h-2 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current: {current}</span>
          <span>Target: {target}</span>
        </div>
      </CardContent>
    </Card>
  )
}
