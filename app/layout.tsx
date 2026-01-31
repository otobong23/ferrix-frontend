import type { Metadata, Viewport } from "next";
import { Inria_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import QueryLayout from "@/components/QueryLayout";

// Inria Sans
const InriaSans = Inria_Sans({
  variable: "--font-inria-sans",
  weight: ["300", "400", "700"],
  subsets: ["latin"]
})

// Poppins
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true
})

export const metadata: Metadata = {
  title: "Ferrix App",
  description: "Ferrix app used for investment purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${InriaSans.variable} ${poppins.variable} antialiased`}
      >
        <QueryLayout>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_OAuth_Client_ID!}>
            {children}
          </GoogleOAuthProvider>
        </QueryLayout>
      </body>
    </html>
  );
}