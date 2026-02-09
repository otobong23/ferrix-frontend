'use client';
import { Icon } from '@iconify-icon/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import c2 from '@/assets/imgs/c2.png'
import f1_image from '@/assets/imgs/f1.png';
import { useCrewData } from '@/context/Crew.context';
import { useEffect, useMemo, useState } from 'react';


const UpgradeLevel = () => {
  const { crewData } = useCrewData()
  const router = useRouter()
  const [level_1_referrals, setLevel_1_referrals] = useState(0)
  const [total_referrals, setTotal_referrals] = useState(0)

  useEffect(() => {
    if(crewData) {
      setLevel_1_referrals(crewData.members.level_1.length)
      setTotal_referrals(crewData.totalMembers)
    }
  }, [crewData])
  
  const levels = useMemo(() => [
  {
    level: 1,
    reached: level_1_referrals >= 10 && total_referrals >= 50,
    requirements: {
      referrals_required: 10,
      team_members_required: 50,
      reward: 10
    }
  },
  {
    level: 2,
    reached: level_1_referrals >= 30 && total_referrals >= 100,
    requirements: {
      referrals_required: 30,
      team_members_required: 100,
      reward: 30
    }
  },
  {
    level: 3,
    reached: level_1_referrals >= 50 && total_referrals >= 200,
    requirements: {
      referrals_required: 50,
      team_members_required: 200,
      reward: 100
    }
  }
], [level_1_referrals, total_referrals]);

  return (
    <div>
      <div className='flex bg-[#44474F] rounded-lg m-4'>
        <div className='flex-1 px-4 py-3'>
          <button onClick={() => router.back()} className='flex items-center'>
            <Icon icon="fluent:ios-arrow-24-regular" />
            <span>Back</span>
          </button>

          <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-2'>LV.0</h1>

          <p className='text-[#9EA4AA]'>Meet Target and Grow</p>
        </div>

        <div className='flex-1'>
          <Image src={c2} alt='c2 image' className='w-full' />
        </div>
      </div>

      <div className='px-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>

        {levels.map(lvl => (
          <div className='flex rounded-lg py-4 bg-[#2F3033]' key={'level_' + lvl.level}>
            <div className="card_image">
              <Image src={f1_image} alt="f1_image" className="object-cover" />
            </div>
            <div className="card_content flex flex-col gap-1 items-start">
              <h1 className="font-medium text-white font-inria-sans text-2xl">LV. {lvl.level}</h1>

              <h2 className="text-sm bg-[#50535B] inline-block rounded-sm p-1 px-3">
                {lvl.reached ? <span className="text-[#4DB6AC]">Reached</span> : <span className="text-investor-gold">In Progress</span>}
              </h2>
              <p className="text-base font-bold text-[#F5F5F7]">Requirements</p>
              <p className="text-[#F5F5F7]">LV. {lvl.level} referrals Required: <span className='font-bold'>{level_1_referrals}/{lvl.requirements.referrals_required}</span></p>
              <p className="text-[#F5F5F7]">Team Members Required: <span className='font-bold'>{total_referrals}/{lvl.requirements.team_members_required}</span></p>
              <p className="text-[#F5F5F7]">Reward: <span className='font-bold'>{lvl.requirements.reward.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default UpgradeLevel