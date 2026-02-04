// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authFetch from "@/utils/api";
import { logoutUser } from "@/services/Authentication";
import { showToast } from "@/utils/alert";

interface AuthContextType {
  user: UserMetaType | null;
  loading: boolean;
  setUser: (user: UserMetaType | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserMetaType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false); // 🔥 auth is now initialized
  }, []);

  useEffect(() => {
    if (user?.accessToken) {
      authFetch.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;
    }
  }, [user]);

  const logout = () => {
    logoutUser();
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    if (!user) return;

    const checkExpiry = () => {
      if (Date.now() >= user.expires_at) {
        logout();
        showToast("error", "Session expired. Please login again.");
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
