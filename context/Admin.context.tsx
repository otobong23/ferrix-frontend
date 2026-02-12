// context/UserContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAdminAPI } from "@/services/Admin";

export interface AdminProfile extends AdminType { }

interface AdminContextType {
  adminData: AdminProfile | null;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
  setAdminData: (user: AdminProfile | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage first
  useEffect(() => {
    const cached = localStorage.getItem("adminData");
    if (cached && cached !== "undefined") {
      try {
        setAdminData(JSON.parse(cached));
      } catch (err) {
        console.error("Invalid cached adminData, clearing storage");
        localStorage.removeItem("adminData");
      }
    }
    setLoading(false);
  }, []);

  // Fetch latest from backend
  const refreshAdmin = async () => {
    try {
      const res = await getAdminAPI()    // user profile Endpoint
      setAdminData(res);
      localStorage.setItem("adminData", JSON.stringify(res));
    } catch (err) {
      console.error("Failed to refresh admin profile");
    }
  };

  // Fetch once on app start
  useEffect(() => {
    refreshAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ adminData, loading, refreshAdmin, setAdminData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
