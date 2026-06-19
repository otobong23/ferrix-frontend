import AuthWrapper from "@/components/AuthWrapper";


export default function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div>
         <AuthWrapper>
            {children}
         </AuthWrapper>
      </div>
   )
}