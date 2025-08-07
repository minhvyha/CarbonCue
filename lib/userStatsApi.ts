// Utility functions for user stats API calls

export interface UserStats {
  carbonReduced: number;
  treesPlanted: number;
  streak: number;
}

// Fetch user stats from API
export async function fetchUserStats(): Promise<UserStats> {
  try {
    const response = await fetch("/api/users/stats", {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    // Handle 401 Unauthorized (user not logged in) gracefully
    if (response.status === 401) {
      console.log("User not authenticated, returning default stats");
      return {
        carbonReduced: 0,
        treesPlanted: 0,
        streak: 0,
      };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Return default values if API call fails
    return {
      carbonReduced: 0,
      treesPlanted: 0,
      streak: 0,
    };
  }
}

// Update user stats when completing a recommendation
export async function updateUserStats(params: {
  carbonReduced?: number;
  treesPlanted?: number;
  incrementStreak?: boolean;
}): Promise<UserStats> {
  try {
    const response = await fetch("/api/users/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
}
