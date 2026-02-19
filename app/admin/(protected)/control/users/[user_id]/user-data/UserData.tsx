'use client';
import SUPPORTED_BANKS from '@/constant/SUPPORTED_BANKS';
import { useAdmin } from '@/context/Admin.context';
import { getUserByUserIdAPI, updateUserByAdminAPI } from '@/services/Admin';
import { Icon } from '@iconify-icon/react'
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface userSettingsType {
   username: string;
   email: string;
   facebook: string;
   telegram: string;
   whatsapp: string;
   [key: string]: string; // Add this line
}

interface walletDetailsType {
   walletAddress: string;
   withdrawal_password: string;
   [key: string]: string;
}

const UserData = () => {
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


   const [userSettings, setUserSettingsState] = useState<userSettingsType>({
      username: '',
      email: '',
      facebook: '',
      telegram: '',
      whatsapp: '',
   })

   const [walletDetails, setWalletDetails] = useState<walletDetailsType>({
      walletAddress: '',
      withdrawal_password: '',
   })

   useEffect(() => {
      if (!user) return;
      setUserSettingsState({
         username: user.username,
         email: user.email,
         facebook: user.facebook ?? '',
         telegram: user.telegram ?? '',
         whatsapp: user.whatsappNo ?? ''
      })
      setWalletDetails({
         walletAddress: user.withdrawalWallet?.walletAddress ?? '',
         withdrawal_password: user.walletPassword ?? ''
      })
   }, [user])

   const handleUserSettingsState = useCallback((name: string, value: string) => {
      setUserSettingsState(prev => ({ ...prev, [name]: value }))
   }, [])
   const handleWalletDetailsState = useCallback((name: string, value: string) => {
      setWalletDetails(prev => ({ ...prev, [name]: value }))
   }, [])

   /* =======================
     UPDATE PROFILE MUTATION
     ======================= */
   const updateProfileMutation = useMutation({
      mutationFn: () => {
         if (!user) throw new Error('User is null');
         return updateUserByAdminAPI(user?.email, {
            facebook: userSettings.facebook,
            telegram: userSettings.telegram,
            whatsappNo: userSettings.whatsapp,
         })
      },

      onMutate: () => {
         toast.loading('Saving profile changes...', {
            id: 'profile-update',
         });
      },

      onSuccess: () => {
         toast.success('Profile updated successfully', {
            id: 'profile-update',
         });
      },

      onError: (error: AxiosError<any>) => {
         toast.error(
            error.response?.data?.message || 'Failed to update profile',
            { id: 'profile-update' }
         );
      },
   });

   const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
         e.preventDefault();
         updateProfileMutation.mutate();
      },
      [updateProfileMutation]
   );

   const userSettings_inputs = [
      { name: 'username', label: 'User Name', type: 'text', placeholder: 'Lois Becket', required: true, editable: false },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true, editable: false },
      { name: 'facebook', label: 'Facebook Profile', type: 'text', placeholder: 'Loisbecket@gmail.com', required: false, editable: true },
      { name: 'telegram', label: 'Telegram Profile', type: 'text', placeholder: '@Loisbecket123', required: false, editable: true },
      { name: 'whatsapp', label: 'WhatsApp Profile', type: 'number', placeholder: '07012345678', required: false, editable: true },
   ]

   const walletDetails_inputs = [
      { name: 'walletAddress', label: 'Wallet Address', type: 'text', placeholder: 'Enter your wallet address', required: true, editable: false },
      { name: 'withdrawal_password', label: 'Withdrawal Password', type: 'password', placeholder: '*******', required: true, editable: false },
   ]
   return (
      <form className="flex flex-col" onSubmit={handleSubmit}>
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
         </div>

         <div className='px-4 flex flex-col gap-4 py-2'>
            {
               userSettings_inputs.map(details => (
                  <div className='flex flex-col gap-2' key={details.name}>
                     <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                     <input type={details.type} value={userSettings[details.name]} disabled={!details.editable} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserSettingsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                  </div>
               ))
            }
         </div>

         <div className='px-4 flex flex-col gap-4'>
            {
               walletDetails_inputs.map(details => (
                  <div className='flex flex-col gap-2' key={details.name}>
                     <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                     <input type={details.type} value={walletDetails[details.name]} disabled={!details.editable} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleWalletDetailsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                  </div>
               ))
            }
         </div>

         <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
         >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
         </button>
      </form>
   )
}

export default UserData