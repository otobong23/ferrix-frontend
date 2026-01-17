"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";

const LayoutWrapper = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   const navRef = useRef<HTMLDivElement>(null)
   const [contentPaddingBottom, setContentPaddingBottom] = useState<number>(0);
   useEffect(() => {
      setContentPaddingBottom(navRef.current?.offsetHeight || 0);
   })
   return (
      <div className="min-h-screen relative lg:flex lg:gap-11">

         <div className="hidden lg:block lg:w-80 relative">
            <Sidebar />
         </div>

         <div style={{
            paddingBottom: contentPaddingBottom
         }} className="xl:pb-0! lg:basis-2/3 mx-auto">
            {children}
         </div>
         
         <div className="fixed -bottom-px left-0 right-0 z-50 lg:hidden" ref={navRef}>
            <Navbar />
         </div>
      </div>
   )
}

export default LayoutWrapper