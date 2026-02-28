// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getProfileAPI } from "@/services/Profile";

export interface UserProfile extends UserType { }

interface UserContextType {
  userData: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUserData: (user: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage first
  useEffect(() => {
    const cached = localStorage.getItem("userData");
    if (cached && cached !== "undefined") {
      try {
        setUserData(JSON.parse(cached));
      } catch (err) {
        console.error("Invalid cached userData, clearing storage");
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  // Fetch latest from backend
  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await getProfileAPI();
      setUserData(res);
      localStorage.setItem("userData", JSON.stringify(res));
    } catch (err) {
      console.error("Failed to refresh user profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch once on app start
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, refreshUser, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
