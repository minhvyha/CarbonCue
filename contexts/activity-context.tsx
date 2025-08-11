"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./auth-context";

// Define the type for activity log data from the API
interface ActivityLogCategory {
  activityType: string;
  totalEmissions: number;
}

interface ActivityContextType {
  activityLogs: ActivityLogCategory[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshActivityLogs: () => Promise<void>;
  setActivityLogs: (logs: ActivityLogCategory[]) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [activityLogs, setActivityLogs] = useState<ActivityLogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshActivityLogs = useCallback(async () => {
    try {
      // If already loaded once, show refreshing instead of loading
      if (activityLogs.length > 0) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const res = await fetch("/api/activity-tracker/categories", {
        method: "GET",
        credentials: "include",
      });

      // Handle 401 Unauthorized (user not logged in) gracefully
      if (res.status === 401) {
        console.log("User not authenticated, clearing activity logs");
        setActivityLogs([]);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setActivityLogs(data.total_emissions_based_categories || []);
    } catch (err) {
      console.error("Failed to fetch activity data:", err);
      // Clear activity logs on error
      setActivityLogs([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activityLogs.length]);

  // Auto-fetch activity logs when user authentication changes
  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, fetch activity logs
      refreshActivityLogs();
    } else if (!loading && !user) {
      // User is not authenticated, clear activity logs
      setActivityLogs([]);
      setIsLoading(false);
    }
  }, [user, loading, refreshActivityLogs]);

  return (
    <ActivityContext.Provider
      value={{
        activityLogs,
        isLoading,
        isRefreshing,
        refreshActivityLogs,
        setActivityLogs,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
