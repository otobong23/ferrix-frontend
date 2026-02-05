import { ResetPasswordProvider } from "@/context/ResetPassword.context";


function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div>
         <ResetPasswordProvider>
            {children}
         </ResetPasswordProvider>
      </div>
   );
}

export default Layout;