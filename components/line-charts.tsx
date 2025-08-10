"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useState, useEffect } from "react";
import { useActivity } from "@/contexts/activity-context";
import { useAuth } from "@/contexts/auth-context";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  totalEmissions: {
    label: "Total Emissions",
    color: "hsl(var(--bright-red))",
  },
} satisfies ChartConfig;

export function ChartLineLabel() {
  const { user, loading } = useAuth();
  if (!user && !loading) {
    return null;
  }

  const [chartData, setChartData] = useState([]);
  const { activityLogs, refreshActivityLogs } = useActivity();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/activity-tracker/trends");
      const data = await response.json();
      console.log(data);

      // Step 1: Create a map from API
      const emissionMap = new Map(
        data.totalEmissions.map((item: any) => [
          item.month,
          item.totalEmissions,
        ])
      );

      // Step 2: Build full data with missing months as null
      const fullData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i + 1;
        return {
          month: monthNames[i],
          totalEmissions: emissionMap.get(monthIndex) ?? null, // use null if missing
        };
      });
      console.log("📈 Final chart data:", fullData);

      setChartData(fullData);
    }
    fetchData();
  }, [activityLogs]);

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[280px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          left: 20,
          right: 25,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          interval={0}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="totalEmissions"
          type="monotone"
          stroke="hsl(var(--bright-red))"
          strokeWidth={2}
          dot={{
            fill: "hsl(var(--bright-red))",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
}
