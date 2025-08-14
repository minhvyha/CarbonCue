"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Tv, Home, Plane, Lightbulb, Droplets } from "lucide-react";

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
  // Inside WebsiteCalculatorResults(), just before the `return(...)`:
  let totalCO2g = 0;
  if(data.emissionDetails.green){

     totalCO2g =
      data.emissionDetails.statistics.co2.renewable.grams *
      parseInt(monthlyVisitors, 10);
  }
  else{
      totalCO2g =
        data.emissionDetails.statistics.co2.grid.grams *
        parseInt(monthlyVisitors, 10);
  }

  // Define per-unit CO₂ rates (all in grams):
  const rates = {
    microwave: 400, // g per use
    tv: 170, // g per hour
    household: 42000, // g per day (42 kg/day)
    flight: 160, // g per km
    bulb: 6.1, // g per hour (10 W)
    waterHeater: 16.2, // g per litre (0.0162 kg/L)
  };

  const funFacts = [
    {
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      title: "Microwave Uses",
      // number of uses = totalCO2g ÷ rate
      value: `${(totalCO2g / rates.microwave).toFixed(1)}`,
      unit: "uses",
      description: "Full-power microwave cycles",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: <Tv className="h-6 w-6 text-indigo-600" />,
      title: "TV Watching",
      value: `${(totalCO2g / rates.tv).toFixed(1)}`,
      unit: "hours",
      description: "Watching a 50″ LED TV",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      icon: <Home className="h-6 w-6 text-emerald-600" />,
      title: "Household Days",
      // convert CO₂ to days: divide by g/day
      value: `${(totalCO2g / rates.household).toFixed(2)}`,
      unit: "days",
      description: "Avg. Australian household footprint",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: <Plane className="h-6 w-6 text-sky-600" />,
      title: "Flight Distance",
      value: `${(totalCO2g / rates.flight).toFixed(0)}`,
      unit: "km",
      description: "Economy-class air travel",
      bg: "bg-sky-50 dark:bg-sky-950/20",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
      title: "LED Bulb Hours",
      value: `${(totalCO2g / rates.bulb).toFixed(0)}`,
      unit: "hours",
      description: "10 W LED bulb runtime",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: <Droplets className="h-6 w-6 text-cyan-600" />,
      title: "Water Heating",
      value: `${(totalCO2g / rates.waterHeater).toFixed(1)}`,
      unit: "L",
      description: "Water heated from cold to boiling",
      bg: "bg-cyan-50 dark:bg-cyan-950/20",
    },
  ];
  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carbon Emission Results</CardTitle>
          <CardDescription>
            Analysis for{" "}
            <a href={data.url || "#"} target="_blank" rel="noopener noreferrer">
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
                    data.totalBytes < 1 * 1024 * 1024
                      ? "Great"
                      : data.totalBytes < 2 * 1024 * 1024
                      ? "Good"
                      : data.totalBytes < 3 * 1024 * 1024
                      ? "Average"
                      : "Poor"
                  }
                  color={
                    data.totalBytes < 1 * 1024 * 1024
                      ? "green"
                      : data.totalBytes < 2 * 1024 * 1024
                      ? "amber"
                      : data.totalBytes < 3 * 1024 * 1024
                      ? "amber"
                      : "red"
                  }
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

              {data.emissionDetails.url && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">
                    Detailed Analysis
                  </h3>
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
                            Object.entries(data.breakdown).map(
                              ([type, size]) => (
                                <li key={type} className="flex justify-between">
                                  <span>{type.toUpperCase()}</span>
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
              )}

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
                          <span className="text-sm">
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
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">
                    Fun Facts About Your Carbon Footprint
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                  These fun facts are calculated from your website’s total carbon emissions over one month of visits.
                </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {funFacts.map(
                      ({ icon, title, value, unit, description, bg }) => (
                        <FunFactCard
                          key={title}
                          icon={icon}
                          title={title}
                          value={`${value} ${unit}`}
                          description={description}
                          bgColor={bg}
                        />
                      )
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
  <div className="flex items-start gap-3">
    <Zap className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
        Energy Impact Perspective
      </h4>
      <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
        Your site’s monthly carbon footprint of{' '}
        <strong>{(totalCO2g / 1000).toFixed(2)} kg CO₂</strong> is equivalent to running a
        microwave for{' '}
        <strong>{(totalCO2g / rates.microwave).toFixed(1)} minutes</strong> or watching TV for{' '}
        <strong>{(totalCO2g / rates.tv).toFixed(1)} hours</strong>. Small optimizations can make a big difference!
      </p>
    </div>
  </div>
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

function FunFactCard({
  icon,
  title,
  value,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className={`${bgColor} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <p className="text-xs text-muted-foreground leading-tight">
              {description}
            </p>
          </div>
        </div>
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
