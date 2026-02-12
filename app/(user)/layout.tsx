'use client';
import LayoutWrapper from "@/components/user/LayoutWrapper";
import UserGuard from "@/components/user/UserGuard";
import { UserProvider } from "@/context/User.context";
import { CrewProvider } from "@/context/Crew.context";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LayoutWrapper>
        <UserProvider>
          <CrewProvider>
            {children}
          </CrewProvider>
        </UserProvider>
      </LayoutWrapper>
    </div>
  );
}

export default UserGuard(Layout)