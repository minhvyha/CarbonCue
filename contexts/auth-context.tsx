"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log("🔍 Fetching user...");
      const res = await fetch("/api/users", {
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("✅ User data received:", userData);
        setUser(userData);
      } else if (res.status === 401) {
        console.log("❌ User not authenticated");
        setUser(null);
      } else {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        console.log("✅ Logged out successfully");
        return true;
      } else {
        console.error("❌ Logout failed");
        return false;
      }
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
