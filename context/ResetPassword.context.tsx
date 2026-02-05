
'use client';
import { createContext, ReactNode, useContext, useState } from "react";

type ResetContextType = {
  passwordResetToken: string | null;
  passwordResetSetToken: (t: string | null) => void;
  clearPasswordResetToken: () => void;
};

const ResetPasswordContext = createContext<ResetContextType | null>(null);

export const ResetPasswordProvider = ({ children }: { children: ReactNode }) => {
  const [passwordResetToken, passwordResetSetToken] = useState<string | null>(null);

  const clearPasswordResetToken = () => {
   passwordResetSetToken(null);
};

  return (
    <ResetPasswordContext.Provider value={{ passwordResetToken, passwordResetSetToken, clearPasswordResetToken }}>
      {children}
    </ResetPasswordContext.Provider>
  );
};

export const useResetPassword = () => {
  const ctx = useContext(ResetPasswordContext);
  if (!ctx) throw new Error("useResetPassword must be used inside provider");
  return ctx;
};