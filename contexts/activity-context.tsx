"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the type for activity log data from the API
interface ActivityLogCategory {
  activityType: string;
  totalEmissions: number;
}

interface ActivityContextType {
  activityLogs: ActivityLogCategory[];
  isLoading: boolean;
  refreshActivityLogs: () => Promise<void>;
  setActivityLogs: (logs: ActivityLogCategory[]) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activityLogs, setActivityLogs] = useState<ActivityLogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshActivityLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/activity-tracker/categories", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setActivityLogs(data.total_emissions_based_categories || []);
    } catch (err) {
      console.error("Failed to fetch activity data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ActivityContext.Provider value={{
      activityLogs,
      isLoading,
      refreshActivityLogs,
      setActivityLogs
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
} 