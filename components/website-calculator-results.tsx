"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is a placeholder component - in a real app, you would receive actual data
export function WebsiteCalculatorResults({
  data,
  monthlyVisitors,
}: {
  data: any;
  monthlyVisitors: string;
}) {
  // Placeholder state - would be populated from API response

  if (!data) return null;
  console.log("WebsiteCalculatorResults data:", data);

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carbon Emission Results</CardTitle>
          <CardDescription>
            Analysis for{" "}
            <a
              href={data.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.url || data.totalBytes + " bytes"}
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
                      data.emissionDetails.statistics.co2.grid.grams.toFixed(3)
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
                  value={
                    parseFloat(data.emissionDetails.cleanerThan) * 100 + "%"
                  }
                  description="of websites tested"
                  rating={
                    data.emissionDetails.cleanerThan > 0.75
                      ? "Great"
                      : data.emissionDetails.cleanerThan > 0.5
                      ? "Average"
                      : "Poor"
                  }
                  color={
                    data.emissionDetails.cleanerThan > 0.75
                      ? "green"
                      : data.emissionDetails.cleanerThan > 0.5
                      ? "amber"
                      : "red"
                  }
                />
                <EmissionMetric
                  label="Website Rating"
                  value={data.emissionDetails.rating}
                  description="Overall environmental impact"
                  rating={
                    data.emissionDetails.rating === "A+"
                      ? "Excellent"
                      : data.emissionDetails.rating === "A"
                      ? "Very Good"
                      : data.emissionDetails.rating === "A-"
                      ? "Good"
                      : data.emissionDetails.rating === "B"
                      ? "Fair"
                      : data.emissionDetails.rating === "C"
                      ? "Poor"
                      : data.emissionDetails.rating === "D"
                      ? "Very Poor"
                      : "Fail"
                  }
                  color={
                    data.emissionDetails.rating === "A+"
                      ? "green"
                      : data.emissionDetails.rating === "A"
                      ? "green"
                      : data.emissionDetails.rating === "A-"
                      ? "green"
                      : data.emissionDetails.rating === "B"
                      ? "amber"
                      : data.emissionDetails.rating === "C"
                      ? "amber"
                      : data.emissionDetails.rating === "D"
                      ? "red"
                      : "red"
                  }
                />
              </div>

              {data.emissionDetails.url &&<div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Detailed Analysis</h3>
                <p className="text-muted-foreground mb-2">
                  Total page size: {formatBytes(data.emissionDetails.bytes)}
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
                            {data.emissionDetails.url}
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
                            {data.emissionDetails.green ? "Yes" : "No"}
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div> }
              

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  CO₂ Emission Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Energy Source Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Adjusted Bytes</span>
                          <span className="font-medium">
                            {formatBytes(
                              data.emissionDetails.statistics.adjustedBytes
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Green Hosting</span>
                          <span
                            className={`font-medium ${
                              data.emissionDetails.green
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {data.emissionDetails.green ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Grid Energy Emissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>CO₂ from Grid Energy</span>
                          <span
                            className={`font-medium ${
                              data.emissionDetails.green ? "" : "text-red-600"
                            }`}
                          >
                            {formatWeight(
                              data.emissionDetails.statistics.co2.grid.grams
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equivalent in Liters</span>
                          <span
                            className={`font-medium ${
                              data.emissionDetails.green ? "" : "text-red-600"
                            }`}
                          >
                            {formatLitres(
                              data.emissionDetails.statistics.co2.grid.litres
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Green Energy Emissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>CO₂ from Green Energy</span>
                          <span
                            className={`font-medium ${
                              data.emissionDetails.green ? "text-green-600" : ""
                            }`}
                          >
                            {formatWeight(
                              data.emissionDetails.statistics.co2.renewable
                                .grams
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equivalent in Liters</span>
                          <span
                            className={`font-medium ${
                              data.emissionDetails.green ? "text-green-600" : ""
                            }`}
                          >
                            {formatLitres(
                              data.emissionDetails.statistics.co2.renewable
                                .litres
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Emission Projections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>
                            Monthly ({monthlyVisitors.toLocaleString()}{" "}
                            visitors)
                          </span>
                          <span className="font-medium">
                            {data.emissionDetails.green
                              ? formatWeight(
                                  data.emissionDetails.statistics.co2.renewable
                                    .grams * parseInt(monthlyVisitors)
                                )
                              : formatWeight(
                                  data.emissionDetails.statistics.co2.grid
                                    .grams * parseInt(monthlyVisitors)
                                )}{" "}
                            CO₂
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            Yearly ({monthlyVisitors.toLocaleString()}{" "}
                            visitors/month)
                          </span>
                          <span className="font-medium">
                            {data.emissionDetails.green
                              ? formatWeight(
                                  data.emissionDetails.statistics.co2.renewable
                                    .grams *
                                    parseInt(monthlyVisitors) *
                                    12
                                )
                              : formatWeight(
                                  data.emissionDetails.statistics.co2.grid
                                    .grams *
                                    parseInt(monthlyVisitors) *
                                    12
                                )}{" "}
                            CO₂
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  {/* <h3 className="text-lg font-medium mb-2">Page Weight</h3>
                  <p className="text-muted-foreground mb-2">Total page size: {formatBytes(data.emissionDetails.bytes)}</p> */}
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
                              {data.emissionDetails.url}
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
                              {data.emissionDetails.green ? "Yes" : "No"}
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
function formatWeight(grams: number) {
  const units = ["g", "kg", "t"];
  let size = grams;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(3)} ${units[unitIndex]}`;
}
function formatLitres(litres: number) {
  const units = ["L", "mL"];
  let size = litres;
  let unitIndex = 0;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(3)} ${units[unitIndex]}`;
}
