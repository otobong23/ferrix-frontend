'use client';
import { products } from '@/constant/product.constant';
import { useUser } from '@/context/User.context';
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns';
import ProductCard from '@/components/ProductCard';

const getRemainingDays = (date?: string) => {
   if (!date) return 0;
   const expiry = new Date(date);
   if (isNaN(expiry.getTime())) return 0;
   return Math.max(0, differenceInCalendarDays(expiry, new Date()));
};


const YourInvestments = () => {
   const router = useRouter()
   const { userData } = useUser()
   const [amount, setAmount] = useState<number>(0);
   const [tier, setTier] = useState<'active' | 'expired'>('active')
   const No_data_yet = <p className='text-center mt-24'>No Data</p>

   const handleTier = useCallback((selectTier: 'active' | 'expired') => {
      setTier(selectTier)
   }, [])

   useEffect(() => {
      if (userData) {
         setAmount(userData.totalDeposit + userData.totalYield)
      }
   }, [userData])

   const isActiveTier = (checkTier: 'active' | 'expired') => tier === checkTier;

   const plans = [...products]
   let currentPlans = plans.filter(a =>
      userData?.currentPlan?.some(b => b.name === a.name)
   );

   let previousPlans = plans.filter(a =>
      userData?.previousPlan?.some(b => b.name === a.name)
   );

   currentPlans = currentPlans.map(item => {
      const userItem = userData?.currentPlan?.find(b => b.name === item.name)
      return ({
         ...item, duration: getRemainingDays(userItem?.expiringDate ?? '') + ' days'
      })
   })
   previousPlans = previousPlans.map(item => {
      const userItem = userData?.previousPlan?.find(b => b.name === item.name)
      return ({
         ...item, duration: getRemainingDays(userItem?.expiringDate ?? '') + ' days'
      })
   })

   return (
      <div>
         <div className='flex bg-[#44474F] rounded-lg m-4'>
            <div className='flex-1 px-4 py-3 pb-6'>
               <button onClick={() => router.back()} className='flex items-center'>
                  <Icon icon="fluent:ios-arrow-24-regular" />
                  <span>Back</span>
               </button>

               <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-2'>Investments</h1>

               <p className='text-[#9EA4AA]'>{amount.toLocaleString('en-US', { style: "currency", currency: "USD" })}</p>
            </div>
         </div>

         <div className='py-5 px-10 flex items-center gap-10 lg:gap-2.5 lg:w-[392px] mx-auto'>
            {
               ['active', 'expired'].map(item => (
                  <button key={item} onClick={() => handleTier(item as 'active' | 'expired')} className={`flex-1 py-2 rounded-lg text-lg transition-all duration-300 theme-button-effect-no-shadow capitalize ${isActiveTier(item as 'active' | 'expired') ? 'text-black bg-investor-gold' : 'text-[#9EA4AA] bg-linear-to-b from-[#FFFFFF]/40 to-[#FFFFFF]/0 backdrop-blur-2xl border border-white'}`}>{item}</button>
               ))
            }
         </div>

         <div className='max-w-[570px] mx-auto'>
            {tier === 'active' && <div className={`pt-[15px] pb-7 flex flex-col gap-3 overflow-y-hidden ${tier === 'active' ? 'h-fit' : 'h-0'}`}>
               {currentPlans.length ? currentPlans.map((product, index) => <ProductCard handleClick={() => console.log} product={product} key={product + '_' + index} />) : No_data_yet}
            </div>}
            {tier === 'expired' && <div className='pt-[15px] pb-7 flex flex-col gap-3'>
               {previousPlans.length ? previousPlans.map((product, index) => <ProductCard handleClick={() => console.log} product={product} key={product + '_' + index} />) : No_data_yet}
            </div>}
         </div>
      </div>
   )
}

export default YourInvestments