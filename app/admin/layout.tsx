import AdminWrapper from "@/components/admin/AdminWrapper";

export default function Layout({
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