'use client';

import { help_center, profile_links, security_center } from "@/constant/Dasboard.constant";
import { useAuth } from "@/context/Auth.context";
import { useUser } from "@/context/User.context";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const { userData } = useUser();
  const [userID, setUserID] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('N/A')

  useEffect(() => {
    if(userData) {
      setUsername(userData.username)
      setUserID(userData.userID)
      setPhone(userData.whatsappNo || 'N/A')
    }
  },[userData])

  const balances = useMemo(() => ({
    Total_Balance: userData?.balance ?? 0,
    Total_Withdrawn: userData?.totalWithdraw ?? 0
  }), [userData])

  
  return (
    <div>
      <div className='py-5 px-6 flex items-center gap-4 bg-[#44474F] rounded-lg mx-4 my-4'>
        <div className='w-20 h-20 rounded-full bg-[#C7C7C7] flex justify-center items-center'>
          <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-4xl' />
        </div>
        <div>
          <h1 className='text-[#F5F5F7] font-bold text-2xl max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden'>{username}</h1>
          <p className='text-[#C3C3C3] text-lg'>ID: {userID}</p>
          <p className='text-[#C3C3C3] text-lg flex items-center gap-1.5'><span className="flex items-center"><Icon icon="solar:phone-outline" width="24" /></span> {phone}</p>
        </div>
        <button className="px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 mt-auto theme-button-effect">ID Setup</button>
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

      <div className="grid grid-cols-3 gap-6 px-4 mb-4">
        {
          profile_links.map(link => (
            <Link key={link.name} href={link.href} className="flex flex-col items-center justify-center gap-0.5 hover:underline theme-button-effect-no-shadow">
              <Icon icon={link.icon} className="text-investor-gold" width={36} />
              <p className="text-[#F5F5F7]">{link.name}</p>
            </Link>
          ))
        }
      </div>

      <div className="px-4">
        <h1 className="px-4 text-[#9EA4AA] text-3xl">Security Center</h1>
        <div className="flex flex-col bg-[#2F3033] px-4 py-3 rounded-lg gap-4 mb-2.5">
          {
            security_center.map(link => (
              <Link key={link.name} href={link.href} className="flex items-center gap-1.5 theme-button-effect-no-shadow hover:underline">
                <Icon icon={link.icon} width={24} />
                <p className="text-xl">{link.name}</p>
                <Icon icon="weui:arrow-outlined" width="12" height="24" className="ml-auto text-[#9EA4AA]" />
              </Link>
            ))
          }
        </div>


        <h1 className="px-4 text-[#9EA4AA] text-3xl">Help Center</h1>
        <div className="flex flex-col bg-[#2F3033] px-4 py-3 rounded-lg gap-4 mb-2.5">
          {
            help_center.map(link => (
              <Link key={link.name} href={link.href} className="flex items-center gap-1.5 theme-button-effect-no-shadow hover:underline">
                <Icon icon={link.icon} width={24} />
                <p className="text-xl">{link.name}</p>
                <Icon icon="weui:arrow-outlined" width="12" height="24" className="ml-auto text-[#9EA4AA]" />
              </Link>
            ))
          }
        </div>


        <h1 className="px-4 text-[#9EA4AA] text-3xl">System Settings</h1>
        <div className="flex flex-col bg-[#2F3033] px-4 py-3 rounded-lg gap-4 mb-2.5">
          <Link href="/" className="flex items-center gap-1.5 theme-button-effect-no-shadow hover:underline">
            <Icon icon="iconamoon:profile-circle-fill" width={24} />
            <p className="text-xl">ID Setup</p>
            <Icon icon="weui:arrow-outlined" width="12" height="24" className="ml-auto text-[#9EA4AA]" />
          </Link>

          <button className="flex items-center gap-1.5 theme-button-effect-no-shadow hover:underline">
            <Icon icon="majesticons:logout-line" width={24} />
            <p className="text-xl">Logout</p>
            <Icon icon="weui:arrow-outlined" width="12" height="24" className="ml-auto text-[#9EA4AA]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile