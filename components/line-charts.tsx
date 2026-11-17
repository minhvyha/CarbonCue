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

  const [chartData, setChartData] = useState<{ month: string; totalEmissions: number | null }[]>([]);
  const { activityLogs } = useActivity();

  useEffect(() => {
    if (loading || !user) return;
    let active = true;
    async function fetchData() {
      try {
        const response = await fetch(`/api/activity-tracker/trends?year=${new Date().getFullYear()}`);
        if (!response.ok) throw new Error("Could not load monthly trends.");
        const data = await response.json();
        const emissionMap = new Map<number, number>(
          (data.totalEmissions || []).map((item: { month: number; totalEmissions: number }) => [item.month, item.totalEmissions])
        );
        if (active) setChartData(monthNames.map((month, i) => ({ month, totalEmissions: emissionMap.get(i + 1) ?? null })));
      } catch (error) {
        console.error(error);
        if (active) setChartData([]);
      }
    }
    fetchData();
    return () => { active = false; };
  }, [activityLogs, user, loading]);

  if (!user) return <p className="p-4 text-sm">Sign in to view your monthly trends.</p>;

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
