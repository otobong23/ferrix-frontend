// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authFetch from "@/utils/api";
import { logoutUser } from "@/services/Authentication";

interface UserType {
   accessToken: string
   userID: string;
   email: string;
   sub: string;
   expires_in: number;
};

interface AuthContextType {
   user: UserType | null;
   setUser: (user: UserType | null) => void;
   logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<UserType | null>(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
   });

   useEffect(() => {
      // Set default Authorization header if user exists
      if (user?.sub && user.accessToken) {
         authFetch.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;
      }
   }, [user]);

   const logout = () => {
      logoutUser()
      setUser(null);
   };

   useEffect(() => {
      if (!user) return;

      const timeout = setTimeout(() => {
         logout();
         alert("Session expired. Please login again.");
      }, user.expires_in * 1000);

      return () => clearTimeout(timeout);
   }, [user]);

   return (
      <AuthContext.Provider value={{ user, setUser, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error("useAuth must be used inside AuthProvider");
   return context;
};
