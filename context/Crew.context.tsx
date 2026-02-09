'use client';
import { getCrewAPI } from "@/services/Profile";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserCrewType extends CrewType { }

interface CrewContextType {
   crewData: UserCrewType | null;
   loading: boolean;
   refreshCrewData: () => Promise<void>;
   setCrewData: (crew: UserCrewType | null) => void;
}

const CrewContext = createContext<CrewContextType | undefined>(undefined);

export const CrewProvider = ({ children }: { children: ReactNode }) => {
   const [crewData, setCrewData] = useState<UserCrewType | null>(null);
   const [loading, setLoading] = useState(true);

   // Load from localStorage first
   useEffect(() => {
      const cached = localStorage.getItem("crewData");
      if (cached && cached !== "undefined") {
         try {
            setCrewData(JSON.parse(cached));
         } catch (err) {
            console.error("Invalid cached crewData, clearing storage");
            localStorage.removeItem("crewData");
         }
      }
      setLoading(false);
   }, []);

   // Fetch latest from backend
   const refreshCrewData = async () => {
      try {
         const res = await getCrewAPI()    // user profile Endpoint
         setCrewData(res);
         localStorage.setItem("crewData", JSON.stringify(res));
      } catch (err) {
         console.error("Failed to refresh user profile");
      }
   };

   // Fetch once on app start
   useEffect(() => {
      refreshCrewData();
   }, []);

   return (
      <CrewContext.Provider value={{ crewData, loading, refreshCrewData, setCrewData }}>
         {children}
      </CrewContext.Provider>
   );
}


export const useCrewData = () => {
  const ctx = useContext(CrewContext);
  if (!ctx) throw new Error("useCrewData must be used inside CrewProvider");
  return ctx;
};
