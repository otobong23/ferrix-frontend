'use client';
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'


const YourInvestments = () => {
   const router = useRouter()
   const [amount, setAmount] = useState<number>(360000);
   const [tier, setTier] = useState<'active' | 'expired'>('active')
   const handleTier = useCallback((selectTier: 'active' | 'expired') => {
      setTier(selectTier)
   }, [])
   const isActiveTier = (checkTier: 'active' | 'expired') => tier === checkTier;
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

         <p className='text-center mt-24'>No Data</p>
      </div>
   )
}

export default YourInvestments