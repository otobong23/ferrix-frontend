'use client';
import { useAdmin } from '@/context/Admin.context';
import { getCrewsAPI, getUsersAPI } from '@/services/Admin';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'

const Control = () => {
   const { adminData } = useAdmin()
   const [tier, setTier] = useState<'team' | 'users'>('team')
   const handleTier = useCallback((selectTier: 'team' | 'users') => {
      setTier(selectTier)
   }, [])
   const isActiveTier = (checkTier: 'team' | 'users') => tier === checkTier;

   const [Crews, setCrews] = useState<Array<CrewType>>([])

   const [users, setUsers] = useState<Array<UserType>>([])

   useEffect(() => {
      const fetchData = async () => {
         const getCrews = await getCrewsAPI()
         setCrews(getCrews.crews)

         const getUsers = await getUsersAPI()
         setUsers(getUsers.users)
      }
      fetchData()
   }, [adminData])

   return (
      <div>
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
            <div className='flex items-center gap-2.5'>
               <button className="w-8 h-8 flex items-center justify-center">
                  <Icon icon="material-symbols:search" className="text-2xl text-white leading-tight" />
               </button>
               <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
                  <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
               </button>
            </div>
         </div>

         <div className='py-5 px-10 flex items-center gap-10 lg:gap-2.5 lg:w-[392px] mx-auto'>
            {
               ['team', 'users'].map(item => (
                  <button key={item} onClick={() => handleTier(item as 'team' | 'users')} className={`flex-1 py-2 rounded-lg text-lg transition-all duration-300 theme-button-effect-no-shadow capitalize ${isActiveTier(item as 'team' | 'users') ? 'text-black bg-investor-gold' : 'text-[#9EA4AA] bg-linear-to-b from-[#FFFFFF]/40 to-[#FFFFFF]/0 backdrop-blur-2xl border border-white'}`}>{item}</button>
               ))
            }
         </div>

         {tier === "team" &&
            <div className='flex flex-col px-4 gap-1.5'>
               {
                  Crews.length ? Crews.map(member => (
                     <Link href={`/admin/control/team/${member.userID}`} key={member.userID} className='py-5 px-6 flex items-center gap-3 bg-[#F5F5F7]/7 rounded-[15px]'>
                        <div className='w-[50px] h-[50px] rounded-full bg-[#C7C7C7] flex justify-center items-center'>
                           <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-2xl' />
                        </div>
                        <div>
                           <h1 className='text-[#C3C3C3] text-lg'>Team_{member.userID}</h1>
                           <p className='text-[#9EA4AA] text-sm'>1st Created on {new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '')}</p>
                        </div>
                     </Link>
                  )) : <p className="text-center text-sm text-white/60">No Team Found yet.</p>
               }
            </div>
         }

         {tier === "users" &&
            <div className='flex flex-col px-4 gap-1.5'>
               {
                  users.length ? users.map(user => (
                     <Link href={`/admin/control/users/${user.userID}`} key={user.userID} className='py-5 px-6 flex items-center gap-3 bg-[#F5F5F7]/7 rounded-[15px]'>
                        <div className='w-[50px] h-[50px] rounded-full bg-[#C7C7C7] flex justify-center items-center'>
                           <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-2xl' />
                        </div>
                        <div>
                           <h1 className='text-[#C3C3C3] text-lg'>User_{user.userID}</h1>
                           <p className='text-[#9EA4AA] text-sm'>Level {user.meter}</p>
                        </div>
                     </Link>
                  )) : <p className="text-center text-sm text-white/60">No Users Found yet.</p>
               }
            </div>
         }
      </div>
   )
}

export default Control