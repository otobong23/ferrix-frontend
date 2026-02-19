'use client';
import { useAdmin } from '@/context/Admin.context';
import { Icon } from '@iconify-icon/react'
import { useEffect, useState } from 'react';


const Dashboard = () => {
   const {adminData} = useAdmin()
   const [totalDeposit, setTotalDeposit] = useState(0)
   const [totalWithdraw, setTotalWithdraw] = useState(0)
   const [totalTransactions, setTotalTransactions] = useState(0)

   useEffect(() => {
      if(!adminData) return;
      setTotalDeposit(adminData.totalDeposit)
      setTotalWithdraw(adminData.totalWithdraw)
      setTotalTransactions(adminData.totalTransactions)
   })
   return (
      <div>
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
            <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </button>
         </div>

         <div className='flex flex-col gap-4'>
            <aside className="flex flex-col gap-2 mx-4 py-3 lg:py-[35px] px-4 rounded-lg bg-[#4DB6AC]">
            {/* Total Assets */}
            <div className="flex items-center gap-0.5">
               <Icon icon="solar:money-bag-bold" className="text-xs text-[#1D1D1F] leading-tight" />
               <h1 className="text-[#1D1D1F] text-[9px] lg:text-xs font-poppins">Total Deposited</h1>
            </div>

            {/* Total balance */}
            <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{totalDeposit.toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

            {/* Mining Details */}
            <div className="flex gap-4">
               <h1 className="text-[#1D1D1F] text-xs lg:text-base font-poppins">Since <strong>Feb 1</strong></h1>
            </div>
         </aside>

         <aside className="flex flex-col gap-2 mx-4 py-3 lg:py-[35px] px-4 rounded-lg bg-[#44474F]">
            {/* Total Assets */}
            <div className="flex items-center gap-0.5">
               <Icon icon="solar:money-bag-bold" className="text-xs text-[#4DB6AC] leading-tight" />
               <h1 className="text-[#9EA4AA] text-[9px] lg:text-xs font-poppins">Total Withdrawn</h1>
            </div>

            {/* Total balance */}
            <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{totalWithdraw.toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

            {/* Mining Details */}
            <div className="flex gap-4">
               <h1 className="text-[#9EA4AA] text-xs lg:text-base font-poppins">Since <strong>Feb 1</strong></h1>
            </div>
         </aside>

         <aside className="flex flex-col gap-2 mx-4 py-3 lg:py-[35px] px-4 rounded-lg bg-[#2F3033]">
            {/* Total Assets */}
            <div className="flex items-center gap-0.5">
               <Icon icon="solar:money-bag-bold" className="text-xs text-[#4DB6AC] leading-tight" />
               <h1 className="text-[#9EA4AA] text-[9px] lg:text-xs font-poppins">Calculated Balance</h1>
            </div>

            {/* Total balance */}
            <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{(totalDeposit - totalWithdraw).toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

            {/* Mining Details */}
            <div className="flex gap-4">
               <h1 className="text-[#9EA4AA] text-xs lg:text-base font-poppins">This <strong>Feb 1</strong></h1>
            </div>
         </aside>

         <aside className="flex flex-col gap-2 mx-4 py-3 lg:py-[35px] px-4 rounded-lg bg-[#2F3033]">
            {/* Total Assets */}
            <div className="flex items-center gap-0.5">
               <Icon icon="solar:money-bag-bold" className="text-xs text-[#4DB6AC] leading-tight" />
               <h1 className="text-[#9EA4AA] text-[9px] lg:text-xs font-poppins">Total Transactions</h1>
            </div>

            {/* Total balance */}
            <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{totalTransactions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

            {/* Mining Details */}
            <div className="flex gap-4">
               <h1 className="text-[#9EA4AA] text-xs lg:text-base font-poppins">This <strong>Feb 1</strong></h1>
            </div>
         </aside>
         </div>
      </div>
   )
}

export default Dashboard