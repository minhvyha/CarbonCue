"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is a placeholder component - in a real app, you would receive actual data
export function WebsiteCalculatorResults({ data }: { data: any }) {
  // Placeholder state - would be populated from API response

  if (!data) return null;

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carbon Emission Results</CardTitle>
          <CardDescription>
            Analysis for{" "}
            <a
              href={data.websiteCarbon.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.websiteCarbon.url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* let rating: string;
  if      (bytes < 100 * 1024)           rating = "A+";
  else if (bytes < 250 * 1024)           rating = "A";
  else if (bytes < 500 * 1024)           rating = "A-";
  else if (bytes < 1   * 1024 * 1024)    rating = "B";
  else if (bytes < 2   * 1024 * 1024)    rating = "C";
  else if (bytes < 3   * 1024 * 1024)    rating = "D";
  else                                   rating = "F"; */}
                <EmissionMetric
                  label="Carbon per Page View"
                  value={
                    parseFloat(
                      data.websiteCarbon.statistics.co2.grid.grams.toFixed(3)
                    ) + "g"
                  }
                  description="CO₂ equivalent per page view"
                  rating={
                    data.totalBytes < 100 * 1024
                      ? "Great"
                      : data.totalBytes < 250 * 1024
                      ? "Good"
                      : data.totalBytes < 500 * 1024
                      ? "Average"
                      : "Poor"
                  }
                  color="amber"
                />
                <EmissionMetric
                  label="Cleaner than"
                  value={parseFloat(data.websiteCarbon.cleanerThan) * 100 + "%"}
                  description="of websites tested"
                  rating={
                    data.websiteCarbon.cleanerThan > 0.75
                      ? "Great"
                      : data.websiteCarbon.cleanerThan > 0.5
                      ? "Average"
                      : "Poor"
                  }
                  color={
                    data.websiteCarbon.cleanerThan > 0.75
                      ? "green"
                      : data.websiteCarbon.cleanerThan > 0.5
                      ? "amber"
                      : "red"
                  }
                />
                <EmissionMetric
                  label="Website Rating"
                  value={data.websiteCarbon.rating}
                  description="Overall environmental impact"
                  rating={
                    data.websiteCarbon.rating === "A+"
                      ? "Excellent"
                      : data.websiteCarbon.rating === "A"
                      ? "Very Good"
                      : data.websiteCarbon.rating === "A-"
                      ? "Good"
                      : data.websiteCarbon.rating === "B"
                      ? "Fair"
                      : data.websiteCarbon.rating === "C"
                      ? "Poor"
                      : data.websiteCarbon.rating === "D"
                      ? "Very Poor"
                      : "Fail"
                  }
                  color={
                    data.websiteCarbon.rating === "A+"
                      ? "green"
                      : data.websiteCarbon.rating === "A"
                      ? "green"
                      : data.websiteCarbon.rating === "A-"
                      ? "green"
                      : data.websiteCarbon.rating === "B"
                      ? "amber"
                      : data.websiteCarbon.rating === "C"
                      ? "amber"
                      : data.websiteCarbon.rating === "D"
                      ? "red"
                      : "red"
                  }
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Detailed Analysis</h3>
                <p className="text-muted-foreground mb-2">
                  Total page size: {formatBytes(data.websiteCarbon.bytes)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Asset Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {data.breakdown &&
                          Object.entries(data.breakdown).map(([type, size]) => (
                            <li key={type} className="flex justify-between">
                              <span>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </span>
                              <span className="font-medium">
                                {formatBytes(
                                  typeof size === "number"
                                    ? size.toString()
                                    : String(size)
                                )}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Server Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>URL</span>
                          <span className="font-medium">
                            {data.websiteCarbon.url}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Page Weight</span>
                          <span className="font-medium">
                            {formatBytes(data.totalBytes)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Server</span>
                          <span className="font-medium">
                            {data.serverInfo.server}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>IP Address</span>
                          <span className="font-medium">
                            {data.serverInfo.ip}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sustainable Hosting</span>
                          <span className="font-medium">
                            {data.websiteCarbon.green ? "Yes" : "No"}
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  {/* <h3 className="text-lg font-medium mb-2">Page Weight</h3>
                  <p className="text-muted-foreground mb-2">Total page size: {formatBytes(data.websiteCarbon.bytes)}</p> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Asset Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {data.breakdown &&
                            Object.entries(data.breakdown).map(
                              ([type, size]) => (
                                <li key={type} className="flex justify-between">
                                  <span>
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}
                                  </span>
                                  <span className="font-medium">
                                    {formatBytes(
                                      typeof size === "number"
                                        ? size.toString()
                                        : String(size)
                                    )}
                                  </span>
                                </li>
                              )
                            )}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Server Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>URL</span>
                            <span className="font-medium">
                              {data.websiteCarbon.url}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Page Weight</span>
                            <span className="font-medium">
                              {formatBytes(data.totalBytes)}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Server</span>
                            <span className="font-medium">
                              {data.serverInfo.server}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>IP Address</span>
                            <span className="font-medium">
                              {data.serverInfo.ip}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sustainable Hosting</span>
                            <span className="font-medium">
                              {data.websiteCarbon.green ? "Yes" : "No"}
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
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
      </Card>
    </div>
  );
}

function EmissionMetric({
  label,
  value,
  description,
  rating,
  color,
}: {
  label: string;
  value: string;
  description: string;
  rating: string;
  color: "green" | "amber" | "red";
}) {
  const colorMap = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground mb-2">{description}</div>
      <div
        className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${colorMap[color]}`}
      >
        {rating}
      </div>
    </div>
  );
}

function EmissionBreakdown({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className={`h-2 bg-gray-400`} />
    </div>
  );
}

function RecommendationItem({
  title,
  description,
  impact,
}: {
  title: string;
  description: string;
  impact: "Low" | "Medium" | "High";
}) {
  const impactColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{title}</CardTitle>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${impactColors[impact]}`}
          >
            {impact} Impact
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
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
