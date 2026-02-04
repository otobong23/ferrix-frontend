'use client';
import LayoutWrapper from "@/components/user/LayoutWrapper";
import AuthGuard from "@/components/AuthGuard";
import { UserProvider } from "@/context/User.context";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LayoutWrapper>
        <UserProvider>
          {children}
        </UserProvider>
      </LayoutWrapper>
    </div>
  );
}

export default AuthGuard(Layout)