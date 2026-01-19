'use client';

import { Icon } from '@iconify-icon/react'
import Image from 'next/image'
import f3 from '@/assets/imgs/f3.png'
import { useCallback, useState } from 'react';
import Link from 'next/link';

const Team = () => {
   const [level, setLevel] = useState<number>(1)
   const handleLevel = useCallback((lvl: number) => { setLevel(lvl) }, [])
   const referrals = {
      Total_Referral: 0,
      Commission_Count: 0
   }

   const members = [
      {
         userId: '9847266',
         level: 1
      },
      {
         userId: '9847267',
         level: 2
      },
   ]
   return (
      <div className=''>
         <div className='flex bg-[#44474F] rounded-lg m-4'>
            <div className='flex-1 p-4'>
               <div className='flex items-center'>
                  <Icon icon="solar:money-bag-bold" className='text-[#4DB6AC] mr-1' />
                  <span>Current Lv.</span>
               </div>

               <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-4'>LV.0</h1>

               <Link href="/team/upgrade-level" className='px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 mt-2 theme-button-effect'>Upgrade Level</Link>
            </div>

            <div className='flex-1 flex justify-end'>
               <Image src={f3} alt='c2 image' className='w-full max-w-[232px]' />
            </div>
         </div>

         <div className='flex p-1.5 bg-[#2F3033] rounded-lg mx-4 mb-8'>
            {
               Object.entries(referrals).map(([key, value]) => (
                  <div key={key} className='flex-1 flex flex-col justify-center items-center text-base'>
                     <p className='text-[#9EA4AA]'>
                        <Icon icon="mdi:people" />
                     </p>
                     <p className='text-[#9EA4AA]'>{key.split('_').join(' ')}</p>
                     <p className='px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 text-[#9EA4AA]'>{value}</p>
                  </div>
               ))
            }
         </div>

         <div className='px-4 mb-8'>
            <h1 className='px-4 py-1 text-[#9EA4AA] text-lg'>Refer Friends</h1>
            <div className='bg-[#2F3033] rounded-lg px-4 py-[13px] pb-7'>
               <h2 className='mb-[5px] text-sm text-[#F5F5F7]'>Referral Code</h2>
               <div className='px-2.5 py-[9px] bg-[#F5F5F7]/7 rounded-sm flex justify-between items-center'>
                  <p className='text-[#F5F5F7] font-bold text-lg'>2878WR</p>
                  <button className='px-[34px] py-[5px] bg-[#9EA4AA] rounded-xs text-black'>Copy</button>
               </div>


               <h2 className='mb-[5px] text-sm text-[#F5F5F7]'>Referral Link</h2>
               <div className='px-2.5 py-[9px] bg-[#F5F5F7]/7 rounded-sm flex justify-between items-center'>
                  <p className='text-[#F5F5F7] text-sm w-3/5'>https//ferrix.com/pages/auth/register?reg=2878WR</p>
                  <button className='px-[34px] py-[5px] bg-[#9EA4AA] rounded-xs text-black'>Copy</button>
               </div>
            </div>
         </div>

         <div className='px-4'>
            <div className='flex gap-2 mb-5'>
               {
                  Array.from({ length: 3 }, (_, i) => {
                     const lvl = i + 1
                     return (
                        <button key={'level' + lvl} onClick={() => handleLevel(lvl)} className={`flex-1 py-1.5 rounded-lg text-lg theme-button-effect transition-all duration-300 ${level === lvl ? 'bg-[#4DB6AC] text-[#1D1D1F]' : 'bg-[#44474F] text-[#9EA4AA]'}`}>
                           Level {lvl}
                        </button>
                     )
                  })
               }
            </div>

            <div className='flex flex-col'>
               {
                  members.map(member => (
                     <div key={member.userId} className='py-5 px-6 flex items-center gap-3 bg-[#F5F5F7]/7 rounded-[15px]'>
                        <div className='w-[50px] h-[50px] rounded-full bg-[#C7C7C7] flex justify-center items-center'>
                           <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-2xl' />
                        </div>
                        <div>
                           <h1 className='text-[#C3C3C3] text-lg'>User_{member.userId}</h1>
                           <p className='text-[#9EA4AA] text-sm'>Level {member.level}</p>
                        </div>
                     </div>
                  ))
               }
            </div>
         </div>
      </div>
   )
}

export default Team