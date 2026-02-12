'use client';
import AdminGuard from "@/components/admin/AdminGuard";
import AdminWrapper from "@/components/admin/AdminWrapper";
import { AdminProvider } from "@/context/Admin.context";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminProvider>
        <AdminWrapper>
          {children}
        </AdminWrapper>
      </AdminProvider>
    </div>
  );
}

export default AdminGuard(Layout)