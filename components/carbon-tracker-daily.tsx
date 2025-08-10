"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BarChart, Car, Home, Info, ShoppingBag, Utensils } from "lucide-react";
import { useEffect } from "react";
import { useActivity } from "../contexts/activity-context";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { LoadingOverlay } from "./loading-overlay";
import { useAuth } from "@/contexts/auth-context";

const colorsType = {
  home_energy: "bg-carbon-red",
  transportation: "bg-carbon-purple",
  shopping: "bg-carbon-deep-red",
  digital_usage: "bg-carbon-magenta",
  food_diet: "bg-carbon-bright-red",
};

// Custom Progress component that accepts color
const ColoredProgress = ({
  value,
  color,
  className,
}: {
  value: number;
  color: string;
  className?: string;
}) => (
  <ProgressPrimitive.Root
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 transition-all", color)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);

export default function CarbonTrackerDaily() {
  const { activityLogs, isLoading, refreshActivityLogs } = useActivity();
  const { user } = useAuth();

  useEffect(() => {
    refreshActivityLogs();
  }, [refreshActivityLogs]);

  console.log(activityLogs);

  const categoryIcons: Record<string, React.ReactNode> = {
    home_energy: <Home className="h-4 w-4" />,
    transportation: <Car className="h-4 w-4" />,
    shopping: <ShoppingBag className="h-4 w-4" />,
    digital_usage: <BarChart className="h-4 w-4" />,
    food_diet: <Utensils className="h-4 w-4" />, // Fixed: food_diet instead of food
  };

  return (
    <Card className="mb-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-carbon-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <CardHeader>
            <CardTitle>{user?.name}'s Carbon Footprint</CardTitle>
            <CardDescription>
              Track your daily emissions and see how you compare
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLogs.length === 0 ? (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  No activity today. Start logging your activities to see your
                  footprint!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {activityLogs
                      .reduce((sum, cat) => sum + cat.totalEmissions, 0)
                      .toFixed(1)}{" "}
                    kg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    CO₂e total
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Breakdown by Category</h3>
                  {activityLogs.map((cat) => (
                    <CategoryBreakdown
                      key={cat.activityType}
                      icon={
                        categoryIcons[cat.activityType] || (
                          <BarChart className="h-4 w-4" />
                        )
                      } // fallback icon
                      label={cat.activityType
                        .replace("_", " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      value={`${cat.totalEmissions.toFixed(1)} kg`}
                      percentage={Math.min(
                        100,
                        Math.round((cat.totalEmissions / 10) * 100)
                      )} // placeholder logic
                      color={
                        colorsType[cat.activityType as keyof typeof colorsType]
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}

function CategoryBreakdown({
  icon,
  label,
  value,
  percentage,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
            {icon}
          </span>
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <ColoredProgress value={percentage} color={color} />
    </div>
  );
}
