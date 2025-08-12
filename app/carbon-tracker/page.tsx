"use client";

import type React from "react";
import {
  BarChart,
  Car,
  Home,
  Leaf,
  ShoppingBag,
  TrendingDown,
  TreePine,
  Flame,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarbonTrackerForm } from "@/components/carbon-tracker-form";
import { getCurrentUser } from "@/lib/getCurrentUser";
import CarbonTrackerDaily from "@/components/carbon-tracker-daily";
import { ActivityProvider } from "@/contexts/activity-context";
import { ChartLineLabel } from "@/components/line-charts";
import CarbonTrackerRecommendation from "@/components/carbon-tracker-recommendation";
import { useState, useEffect } from "react";
import { fetchUserStats, UserStats } from "@/lib/userStatsApi";
import { useAuth } from "@/contexts/auth-context";
import CarbonQuote from "@/components/carbon_quote";

export default function CarbonTrackerPage() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState("recommendations");
  const [userStats, setUserStats] = useState<UserStats>({
    carbonReduced: 0,
    treesPlanted: 0,
    streak: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch user stats on component mount (only when user is authenticated)
  useEffect(() => {
    const loadUserStats = async () => {
      setIsLoadingStats(true);
      try {
        const stats = await fetchUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error("Failed to load user stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    // Only fetch stats if user is authenticated and not loading
    if (!loading && user) {
      loadUserStats();
    } else if (!loading && !user) {
      // Reset stats if user is not authenticated
      setUserStats({
        carbonReduced: 0,
        treesPlanted: 0,
        streak: 0,
      });
      setIsLoadingStats(false);
    }
  }, [user, loading]);

  // Handle stats updates from API
  const handleStatsUpdate = (newStats: UserStats) => {
    console.log("📊 Page received stats update:", newStats);
    setUserStats(newStats);
  };

  return (
    <ActivityProvider>
      <div className="container py-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">
              Daily Carbon Footprint Tracker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor and reduce your personal carbon footprint with our
              interactive dashboard.
            </p>
          </div>

          {/* User Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
                      Carbon Reduced
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-200">
                      {isLoadingStats
                        ? "..."
                        : userStats.carbonReduced.toFixed(1)}{" "}
                      kg
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      CO₂ saved total
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-300">
                      Trees Planted
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                      {isLoadingStats ? "..." : userStats.treesPlanted}
                    </p>
                    <p className="text-xs text-green-500 dark:text-green-400">
                      Virtual trees earned
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-300">
                      Current Activity Streak
                    </p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-200">
                      {isLoadingStats ? "..." : userStats.streak}
                    </p>
                    <p className="text-xs text-orange-500 dark:text-orange-400">
                      Activities completed
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-800/50 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CarbonTrackerDaily />

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>
                    Track your progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    <ChartLineLabel />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Log Activity</CardTitle>
                  <CardDescription>
                    Add your daily activities to track emissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonTrackerForm />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex gap-2 pb-2">
                  <CardTitle className="text-bold font-semibold dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Green Tip of the Day
                  </CardTitle>
                  <CardDescription className="font-bold">
                    Small actions, big impact.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonQuote />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-10">
            <Card>
              <CardHeader>
                <CardTitle>
                  Sustainability Tips{" "}
                  <Leaf className="w-6 h-6 inline-block text-green-600" />
                </CardTitle>
                <CardDescription>
                  Personalized recommendations to reduce your footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <div className="w-full mb-6 overflow-x-auto">
                    <TabsList className="w-max min-w-full h-auto p-1 flex sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:w-full">
                      <TabsTrigger
                        value="recommendations"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Recommendations
                      </TabsTrigger>
                      <TabsTrigger
                        value="transportation"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Transportation
                      </TabsTrigger>
                      <TabsTrigger
                        value="home_energy"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Home Energy
                      </TabsTrigger>
                      <TabsTrigger
                        value="food_diet"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Food & Diet
                      </TabsTrigger>
                      <TabsTrigger
                        value="shopping"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Shopping
                      </TabsTrigger>
                      <TabsTrigger
                        value="digital_usage"
                        className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:flex-1"
                      >
                        Digital Usage
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="mt-6">
                    <CarbonTrackerRecommendation
                      value={currentTab}
                      onStatsUpdate={handleStatsUpdate}
                    />
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ActivityProvider>
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
      <Progress value={percentage} className={`h-2 ${color}`} />
    </div>
  );
}

function SustainabilityTip({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function GoalCard({
  title,
  target,
  current,
  percentage,
}: {
  title: string;
  target: string;
  current: string;
  percentage: number;
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
  );
}
