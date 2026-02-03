'use client';
import LayoutWrapper from "@/components/user/LayoutWrapper";
import AuthGuard from "@/components/AuthGuard";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </div>
  );
}

export default AuthGuard(Layout)