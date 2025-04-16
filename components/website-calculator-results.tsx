"use client"

import { useState } from "react"
import { Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This is a placeholder component - in a real app, you would receive actual data
export function WebsiteCalculatorResults() {
  // Placeholder state - would be populated from API response
  const [hasResults, setHasResults] = useState(true)

  if (!hasResults) return null

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carbon Emission Results</CardTitle>
          <CardDescription>Analysis for example.com</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EmissionMetric
                  label="Carbon per Page View"
                  value="1.27g"
                  description="CO₂ equivalent per page view"
                  rating="Average"
                  color="amber"
                />
                <EmissionMetric
                  label="Monthly Emissions"
                  value="3.81kg"
                  description="CO₂ equivalent per month"
                  rating="High"
                  color="red"
                />
                <EmissionMetric
                  label="Cleaner than"
                  value="52%"
                  description="of websites tested"
                  rating="Average"
                  color="amber"
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Emissions Breakdown</h3>
                <div className="space-y-4">
                  <EmissionBreakdown label="Server Energy" percentage={42} color="bg-carbon-red" />
                  <EmissionBreakdown label="Network Transfer" percentage={28} color="bg-carbon-purple" />
                  <EmissionBreakdown label="Client Device" percentage={18} color="bg-carbon-deep-red" />
                  <EmissionBreakdown label="Other" percentage={12} color="bg-carbon-magenta" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Page Weight</h3>
                  <p className="text-muted-foreground mb-2">Total page size: 2.4 MB</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Asset Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Images</span>
                            <span className="font-medium">1.2 MB</span>
                          </li>
                          <li className="flex justify-between">
                            <span>JavaScript</span>
                            <span className="font-medium">650 KB</span>
                          </li>
                          <li className="flex justify-between">
                            <span>CSS</span>
                            <span className="font-medium">320 KB</span>
                          </li>
                          <li className="flex justify-between">
                            <span>HTML</span>
                            <span className="font-medium">120 KB</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Fonts</span>
                            <span className="font-medium">110 KB</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Server Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Location</span>
                            <span className="font-medium">United States</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Energy Mix</span>
                            <span className="font-medium">62% Non-renewable</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Response Time</span>
                            <span className="font-medium">420ms</span>
                          </li>
                          <li className="flex justify-between">
                            <span>CDN Used</span>
                            <span className="font-medium">Yes</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Traffic Analysis</h3>
                  <p className="text-muted-foreground mb-4">Estimated monthly visits: 3,000</p>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        Traffic chart placeholder
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-4">
                <RecommendationItem
                  title="Optimize Images"
                  description="Compress and properly size images to reduce page weight by up to 60%."
                  impact="High"
                />
                <RecommendationItem
                  title="Minify JavaScript and CSS"
                  description="Remove unnecessary code and whitespace to reduce file sizes."
                  impact="Medium"
                />
                <RecommendationItem
                  title="Use a Green Hosting Provider"
                  description="Switch to a hosting provider that uses renewable energy."
                  impact="High"
                />
                <RecommendationItem
                  title="Implement Lazy Loading"
                  description="Only load images and content when they're needed."
                  impact="Medium"
                />
                <RecommendationItem
                  title="Reduce Third-party Scripts"
                  description="Evaluate and remove unnecessary third-party scripts."
                  impact="Medium"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share Results</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function EmissionMetric({
  label,
  value,
  description,
  rating,
  color,
}: {
  label: string
  value: string
  description: string
  rating: string
  color: "green" | "amber" | "red"
}) {
  const colorMap = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground mb-2">{description}</div>
      <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${colorMap[color]}`}>{rating}</div>
    </div>
  )
}

function EmissionBreakdown({
  label,
  percentage,
  color,
}: {
  label: string
  percentage: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className={`h-2 ${color}`} />
    </div>
  )
}

function RecommendationItem({
  title,
  description,
  impact,
}: {
  title: string
  description: string
  impact: "Low" | "Medium" | "High"
}) {
  const impactColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${impactColors[impact]}`}>{impact} Impact</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
