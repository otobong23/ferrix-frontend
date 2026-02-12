'use client';
import AdminGuard from "@/components/admin/AdminGuard";
import AdminWrapper from "@/components/admin/AdminWrapper";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminWrapper>
        {children}
      </AdminWrapper>
    </div>
  );
}

export default AdminGuard(Layout)