'use client';
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react"
import gemImage from "@/assets/imgs/gem.png"
import Image from "next/image";
import { DashboardMenus } from "@/constant/Dasboard.constant";
import Link from "next/link";
import { products } from "@/constant/product.constant";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/Auth.context";
import { useUser } from "@/context/User.context";


export default () => {
   const { user } = useAuth()
   const { userData } = useUser()
   const [userID, setUserID] = useState<String>("UserID1");
   const [balance, setBalance] = useState<Number>(0)
   const [miningAsset, setMiningAsset] = useState<Number>(0)
   const [crew, setCrew] = useState<Number>(0)

   useEffect(() => {
      if (user) {
         setUserID(user.userID)
      }
      if (userData) {
         setBalance(userData.balance)
         setMiningAsset(userData.totalDeposit)
         setCrew(userData.referral_count ?? 0)
      }
   }, [user, userData])
   return (
      <section className="overflow-x-hidden">
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">{userID}</h1>
            <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </button>
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
               <div className="absolute -top-10 -right-8">
                  <Image src={gemImage} alt="alt" className="object-cover w-[135px] drop-shadow-xl drop-shadow-investor-gold" />
               </div>
            </div>
         </aside>

         <p className="flex items-center text-xs md:text-lg text-black mx-4 mt-5 bg-investor-gold px-[19px] py-3 rounded-lg mb-7 md:mb-10">
            <Icon icon="bi:shield-fill" className="text-[15px] lg:text-[21px] mr-2" />
            A strong team has many players

            <Link href="/team" className="flex justify-center items-center ml-auto text-[#F5F5F7] text-nowrap bg-[linear-gradient(158.16deg,rgba(255,255,255,0.4)3.02%,rgba(145,145,145,0)134.13%)] p-[5px] md:p-[8px_15px] border-gradient rounded-sm theme-button-effect">
               Invite Now
               <Icon icon="iconoir:nav-arrow-right" />
            </Link>
         </p>

         <div className="grid grid-cols-4 md:grid-cols-8 px-4 justify-items-center gap-y-11 mb-8 md:mb-10">
            {
               DashboardMenus.map(menu => (
                  <Link href={menu.link} key={menu.icon} className="flex flex-col items-center theme-button-effect">
                     <Icon icon={menu.icon} className="text-[#9EA4AA] text-[30px]" />
                     <p className="text-xs">{menu.title}</p>
                  </Link>
               ))
            }
         </div>

         <div className="bg-[#44474F] rounded-lg p-2 md:px-7 md:py-3 mx-4 flex justify-between mb-[25px] md:mb-8">
            <Link href="/investments/plans" className="px-[15px] py-2 text-lg text-[#F5F5F7] rounded-sm bg-investor-gold theme-button-effect">Popular</Link>
            <Link href="/investments/plans" className="px-[15px] py-2 text-lg text-[#F5F5F7] bg-[#F5F5F7]/7 rounded-sm flex items-center theme-button-effect">
               <span>See all</span>
               <Icon icon="iconoir:nav-arrow-right" />
            </Link>
         </div>

         <div className="card_section mx-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {
               products.map((product, index) => <ProductCard handleClick={() => console.log('dashbord product link clicked')} product={product} key={product + '_' + index} />)
            }
         </div>

         <p className="mx-7 my-3 lg:my-8">2025, Ferrix co. Copyright</p>
      </section>
   )
}

