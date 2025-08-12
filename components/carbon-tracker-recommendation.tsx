"use client";

import {
  Award,
  Car,
  Home,
  Target,
  TreePine,
  TrendingDown,
  Utensils,
  ShoppingBag,
  Smartphone,
  Loader2,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { updateUserStats, UserStats } from "@/lib/userStatsApi";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/toast-provider";

// Interface for recommendation from API
interface RecommendationFromAPI {
  _id: string;
  title: string;
  description: string;
  category:
    | "transportation"
    | "homeenergy"
    | "fooddiet"
    | "shopping"
    | "digitalusage";
  impact: string;
  impactValue: number;
  difficulty: "Easy" | "Medium" | "Hard";
  treesEarned: number;
  completed?: boolean; // Added from API when user is provided
}

const activityTypes = {
  transportation: {
    icon: Car,
    color: "bg-blue-500",
    bg: "dark:bg-blue-950/20",
    factor: 0.25,
  },
  homeenergy: {
    icon: Home,
    color: "bg-yellow-500",
    bg: "dark:bg-yellow-950/20",
    factor: 0.4,
  },
  fooddiet: {
    icon: Utensils,
    color: "bg-green-500",
    bg: "dark:bg-green-950/20",
    factor: 0.8,
  },
  shopping: {
    icon: ShoppingBag,
    color: "bg-purple-500",
    bg: "dark:bg-purple-950/20",
    factor: 0.15,
  },
  digitalusage: {
    icon: Smartphone,
    color: "bg-indigo-500",
    bg: "dark:bg-indigo-950/20",
    factor: 0.05,
  },
};

const CarbonTrackerRecommendation = ({
  value,
  onStatsUpdate,
}: {
  value?: string;
  onStatsUpdate?: (stats: UserStats) => void;
}) => {
  const { user, loading } = useAuth();
  const [userRecommendations, setUserRecommendations] = useState<
    RecommendationFromAPI[]
  >([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();
  // Fetch recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`/api/recommendations?userId=${user?._id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUserRecommendations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user?._id) {
      fetchRecommendations();
    } else {
      setLoadingData(false);
    }
  }, [user?._id]);

  // Don't render recommendations if user is not logged in and not currently loading
  if (!loading && !user) {
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Please login to see your recommendations.
        </p>
      </div>
    );
  }

  // Map tab values to category names
  const categoryMap: { [key: string]: string } = {
    transportation: "transportation",
    home_energy: "homeenergy",
    food_diet: "fooddiet",
    shopping: "shopping",
    digital_usage: "digitalusage",
  };

  // Filter recommendations based on tab value
  const filteredRecommendations = (() => {
    const tabValue = value || "recommendations";
    const category = categoryMap[tabValue];

    console.log("Tab value:", tabValue, "Category:", category);
    console.log(
      "Available recommendations:",
      userRecommendations.map((r) => r.category)
    );

    if (tabValue === "recommendations") {
      const transportationRec = userRecommendations.find(
        (r) => r.category === "transportation"
      );
      const homeEnergyRec = userRecommendations.find(
        (r) => r.category === "homeenergy"
      );
      const foodDietRec = userRecommendations.find(
        (r) => r.category === "fooddiet"
      );
      return [transportationRec, homeEnergyRec, foodDietRec].filter(
        (rec): rec is NonNullable<typeof rec> => rec !== undefined
      );
    }

    // For specific tabs, show all recommendations from that category
    if (category) {
      const filtered = userRecommendations
        .filter((r) => r.category === category)
        .slice(0, 3);
      console.log("Filtered results for", category, ":", filtered);
      return filtered;
    }

    // Fallback: return all recommendations if no match
    console.log("No category match, returning all");
    return userRecommendations;
  })();

  // Handle recommendation completion
  const handleCompleteRecommendation = async (id: string) => {
    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      console.log(
        "👤 Completing recommendation for user:",
        user._id,
        "recommendation:",
        id
      );

      // Call the complete recommendation API
      const response = await fetch("/api/recommendations/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user._id,
          recommendationId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete recommendation");
      }

      const result = await response.json();
      console.log("✅ Complete API response:", result);

      // Refetch recommendations from API to get updated completed status
      const recommendationsResponse = await fetch(
        `/api/recommendations?userId=${user._id}`
      );
      if (recommendationsResponse.ok) {
        const updatedRecommendations = await recommendationsResponse.json();
        setUserRecommendations(updatedRecommendations);
      }

      // Update parent component with the new stats from the API response
      if (onStatsUpdate && result.userStats) {
        console.log("🎯 Calling onStatsUpdate with:", result.userStats);
        onStatsUpdate(result.userStats);
      }
    } catch (error) {
      console.error("Error completing recommendation:", error);
      // Handle error - maybe show a toast notification
    } finally {
      toast({
        title: `${
          userRecommendations.find((r) => r._id === id)?.title
        } completed successfully`,
        description: "You've completed this recommendation",
        variant: "default",
      });

      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {loadingData ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : (
        filteredRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation._id}
            recommendation={recommendation}
            onComplete={handleCompleteRecommendation}
            isLoading={loadingIds.has(recommendation._id)}
          />
        ))
      )}
    </div>
  );
};

export default CarbonTrackerRecommendation;

const RecommendationCard = ({
  recommendation,
  onComplete,
  isLoading,
}: {
  recommendation: RecommendationFromAPI;
  onComplete: (id: string) => void;
  isLoading: boolean;
}) => {
  const Icon =
    activityTypes[recommendation.category as keyof typeof activityTypes]
      ?.icon || Target;
  const isCompleted = recommendation.completed;

  return (
    <div
      className={`${
        activityTypes[recommendation.category as keyof typeof activityTypes]?.bg
      } rounded-xl p-6 bg-white border transition-all duration-200 hover:shadow-md h-full flex flex-col`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          activityTypes[recommendation.category as keyof typeof activityTypes]
            ?.color || "bg-gray-500"
        }`}
      >
        <Icon className="w-6 h-6 text-white dark:text-white" />
      </div>

      {/* Title and Difficulty */}
      <div className="mb-3">
        <h4
          className={`font-semibold text-gray-900 mb-2 dark:text-white dark:font-bold ${
            isCompleted ? "line-through" : ""
          }`}
        >
          {recommendation.title}
        </h4>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            recommendation.difficulty === "Easy"
              ? "bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300"
              : recommendation.difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/50 dark:text-yellow-300"
              : "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300"
          }`}
        >
          {recommendation.difficulty}
        </span>
      </div>

      {/* Description Activity*/}
      <p className="text-sm text-gray-600 mb-4 flex-grow dark:text-gray-300">
        {recommendation.description}
      </p>

      {/* Impact and Trees Earned */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-1">
          <TrendingDown className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {recommendation.impact}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <TreePine className="w-4 h-4 text-green-500 dark:text-green-300" />
          <span className="text-sm text-green-600 font-medium dark:text-green-300">
            {recommendation.treesEarned} tree
            {recommendation.treesEarned > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <button
          onClick={() => onComplete(recommendation._id)}
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 `}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isLoading ? "Completing..." : "Complete"}</span>
        </button>
      ) : (
        <div className="flex items-center justify-center space-x-2 text-green-600 py-2">
          <Award className="w-5 h-5" />
          <span className="font-medium text-sm">Completed</span>
        </div>
      )}
    </div>
  );
};
