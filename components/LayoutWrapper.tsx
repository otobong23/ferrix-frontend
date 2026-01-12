"use client";
import Navbar from "@/components/Navbar";
import { use, useEffect, useRef, useState } from "react";

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
      <div className="min-h-screen relative">
         <div style={{
            paddingBottom: contentPaddingBottom
         }} className="xl:pb-0!">
            {children}
         </div>
         <div className="fixed -bottom-px left-0 right-0 z-50" ref={navRef}>
            <Navbar />
         </div>
      </div>
   )
}

export default LayoutWrapper