'use client';
import { user_links } from '@/constant/Dasboard.constant';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const UserId = () => {
   const router = useRouter()
   const { user_id } = useParams()

   const balances = {
      Total_Balance: 0,
      Total_Withdrawn: 0,
      Commission: 0,
   }
   return (
      <div>
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
            <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </button>
         </div>

         <div className='px-4 mb-5'>
            <button onClick={() => router.back()} className='flex items-center mb-1'>
               <Icon icon="fluent:ios-arrow-24-regular" />
               <span>Back</span>
            </button>

            <div className='py-5 px-6 flex items-center gap-4 bg-[#44474F] rounded-lg my-4'>
               <div className='w-20 h-20 rounded-full bg-[#C7C7C7] flex justify-center items-center'>
                  <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-4xl' />
               </div>
               <div>
                  <h1 className='text-[#F5F5F7] font-bold text-2xl'>User_{user_id}</h1>
                  <p className='text-[#C3C3C3] text-lg'>ID: 2878WR</p>
                  <p className='text-[#C3C3C3] text-lg'>8048378291</p>
               </div>
               <button className="px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 mt-auto theme-button-effect">ID Setup</button>
            </div>

            <div className='flex p-2 bg-[#2F3033] rounded-lg mb-8'>
               {
                  Object.entries(balances).map(([key, value], index) => (
                     <div key={key} className='flex-1 flex flex-col justify-center items-center'>
                        <p className='text-[#9EA4AA] text-xl'>
                           {index === 0 ? <Icon icon="ri:wallet-fill" width={24} /> : <Icon icon="heroicons:wallet-16-solid" width={24} />}
                        </p>
                        <p className='text-[#9EA4AA] text-base text-center'>{key.split('_').join(' ')}</p>
                        <p className='px-2.5 py-[5px] rounded-sm text-xl bg-[#F5F5F7]/7 text-[#9EA4AA]'>{value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                     </div>
                  ))
               }
            </div>

            <div className="grid grid-cols-3 gap-6 px-4 mb-4">
               {
                  user_links.map(link => (
                     <Link key={link.name} href={user_id+'/'+link.href} className="flex flex-col items-center justify-center gap-0.5 theme-button-effect">
                        <Icon icon={link.icon} className="text-investor-gold" width={36} />
                        <p className="text-[#F5F5F7]">{link.name}</p>
                     </Link>
                  ))
               }
            </div>
         </div>

         <div className='flex flex-col mt-10 mb-5'>
            <button className='flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Suspend</button>
         </div>
      </div>
   )
}

export default UserId