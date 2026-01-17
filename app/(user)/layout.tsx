import LayoutWrapper from "@/components/LayoutWrapper";


export default function Layout({
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