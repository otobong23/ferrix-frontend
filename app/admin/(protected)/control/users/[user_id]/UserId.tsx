'use client';
import { user_links } from '@/constant/Dasboard.constant';
import { useAdmin } from '@/context/Admin.context';
import { getUserByUserIdAPI, toggleUserBot } from '@/services/Admin';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify-icon/react';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const UserId = () => {
   const { adminData } = useAdmin()
   const router = useRouter()
   const { user_id } = useParams()

   const [user, setUser] = useState<UserType | null>(null)

   const fetchData = async () => {
      if (!user_id) return;
      const getUser = await getUserByUserIdAPI(user_id?.toString())
      setUser(getUser)
   }
   useEffect(() => {
      fetchData()
   }, [adminData])

   const balances = useMemo(() => ({
      Total_Balance: user?.balance ?? 0,
      Total_Deposit: user?.totalDeposit ?? 0,
      Total_Withdrawn: user?.totalWithdraw ?? 0,
   }), [user])

   const handleToggleSuspense = useCallback(async () => {
      if (!user) return;
      try {
         const res = await toggleUserBot(user?.email)
         showToast('success', `User account has been ${res.ActivateBot ? 'unsuspended' : 'suspended'} successfully`)
         fetchData()
      } catch (err) {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         showToast('error', message);
      }
   }, [user])
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
                  <h1 className='text-[#F5F5F7] font-bold text-2xl max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden'>User_{user?.username ?? ''}</h1>
                  <p className='text-[#C3C3C3] text-lg'>ID: {user_id}</p>
                  <p className='text-[#C3C3C3] text-lg flex items-center gap-1.5'><span className="flex items-center"><Icon icon="solar:phone-outline" width="24" /></span> {user?.whatsappNo ?? ''}</p>
               </div>
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
                     <Link key={link.name} href={user_id + '/' + link.href} className="flex flex-col items-center justify-center gap-0.5 theme-button-effect">
                        <Icon icon={link.icon} className="text-investor-gold" width={36} />
                        <p className="text-[#F5F5F7]">{link.name}</p>
                     </Link>
                  ))
               }
            </div>
         </div>

         <div className='flex flex-col mt-10 mb-5'>
            <button onClick={handleToggleSuspense} className='flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>{user?.ActivateBot ? 'Deactivate' : 'Activate'}</button>
         </div>
      </div>
   )
}

export default UserId