'use client';
import { Icon } from '@iconify-icon/react'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const TeamId = () => {
  const router = useRouter()
  const { team_id } = useParams()
  const [level, setLevel] = useState<number>(1)
  const handleLevel = useCallback((lvl: number) => { setLevel(lvl) }, [])

  const balances = {
    Total_Balance: 0,
    Total_Withdrawn: 0
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

      <div className='px-4 mb-5'>
        <button onClick={() => router.back()} className='flex items-center mb-1'>
          <Icon icon="fluent:ios-arrow-24-regular" />
          <span>Back</span>
        </button>

        <p className='text-5xl font-bold font-inria-sans'>Team_{team_id}</p>
        <p className='text-[#9EA4AA]'>Created Nov 1 By <span className='text-[#4DB6AC] mb-5'>User_{team_id}</span></p>
      </div>

      <div className='flex p-2 bg-[#2F3033] rounded-lg mx-4 mb-8'>
        {
          Object.entries(balances).map(([key, value], index) => (
            <div key={key} className='flex-1 flex flex-col justify-center items-center'>
              <p className='text-[#9EA4AA] text-xl'>
                {index === 0 ? <Icon icon="ri:wallet-fill" width={24} /> : <Icon icon="heroicons:wallet-16-solid" width={24} />}
              </p>
              <p className='text-[#9EA4AA] text-xl'>{key.split('_').join(' ')}</p>
              <p className='px-2.5 py-[5px] rounded-sm text-xl bg-[#F5F5F7]/7 text-[#9EA4AA]'>{value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
          ))
        }
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

        <div className='flex flex-col gap-1.5'>
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

export default TeamId