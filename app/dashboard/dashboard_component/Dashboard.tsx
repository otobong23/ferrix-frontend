'use client';
import { useState } from "react";
import { Icon } from "@iconify-icon/react"
import gemImage from "@/assets/imgs/gem.png"
import Image from "next/image";

export default () => {
   const [userID] = useState<String>("UserID24");
   const [balance] = useState<Number>(200000)
   const [miningAsset] = useState<Number>(360000)
   const [crew] = useState<Number>(0)
   return (
      <section className="overflow-hidden h-screen">
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">{userID}</h1>
            <span className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </span>
         </div>

         <aside className="flex justify-between mx-4 py-3 lg:py-[35px] px-4 rounded-lg bg-[linear-gradient(153.15deg,rgba(255,255,255,0.4)-49.92%,rgba(255,255,255,0)103.38%)]">
            <div className="flex flex-col gap-2">

               {/* Total Assets */}
               <div className="flex items-center gap-0.5">
                  <Icon icon="solar:money-bag-bold" className="text-xs text-[#4DB6AC] leading-tight" />
                  <h1 className="text-[#9EA4AA] text-[9px] lg:text-xs font-poppins">Total Assets</h1>
               </div>

               {/* Total balance */}
               <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{balance.toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

               {/* Mining Details */}
               <div className="flex gap-4">
                  <div className="flex items-center gap-0.5">
                     <Icon icon="mdi:pickaxe" className="text-xs lg:text-base text-[#9EA4AA] leading-tight" />
                     <h1 className="text-[#9EA4AA] text-xs lg:text-base font-poppins">{miningAsset.toLocaleString('en-US', { style: "currency", currency: "USD" })}</h1>
                  </div>

                  <div className="flex items-center gap-2.5">
                     <Icon icon="mdi:people" className="text-xs lg:text-base text-[#9EA4AA] leading-tight" />
                     <h1 className="text-[#9EA4AA] text-xs lg:text-base font-poppins">{crew.toLocaleString('en-US')}</h1>
                  </div>
               </div>
            </div>
            <div className="relative w-[145px]">
               <div className="absolute -top-11 -right-8">
                  <Image src={gemImage} alt="alt" className="object-cover w-[145px] drop-shadow-xl drop-shadow-[#E6A500]" />
               </div>
            </div>
         </aside>
      </section>
   )
}