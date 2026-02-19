'use client';
import { useAdmin } from "@/context/Admin.context";
import { useAuth } from "@/context/Auth.context";
import { updateAdminAPI } from "@/services/Admin";
import { Icon } from "@iconify-icon/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface userSettingsType {
   email: string;
   password: string;
   whatsapp: string;
   telegram: string;
   secondTelegramLink: string;
   [key: string]: string; // Add this line
}

const Settings = () => {
   const { adminData } = useAdmin()
   const { logout } = useAuth()
   const router = useRouter()

   const [adminSettings, setadminSettingsState] = useState<userSettingsType>({
      email: '',
      password: '',
      whatsapp: '',
      telegram: '',
      secondTelegramLink: ''
   })

   useEffect(() => {
      if (!adminData) return;
      setadminSettingsState({
         email: adminData.email,
         password: adminData.password,
         whatsapp: adminData.whatsappLink ?? '',
         telegram: adminData.telegramLink ?? '',
         secondTelegramLink: adminData.secondTelegramLink ?? '',
      })
   }, [adminData])

   const handleUserSettingsState = useCallback((name: string, value: string) => {
      setadminSettingsState(prev => ({ ...prev, [name]: value }))
   }, [])

   const adminSettings_inputs = [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true, editable: false },
      { name: 'password', label: 'Password', type: 'password', placeholder: '*******', required: true, editable: true },
      { name: 'whatsapp', label: 'WhatsApp Link', type: 'text', placeholder: '07012345678', required: false, editable: true },
      { name: 'telegram', label: 'Telegram Profile', type: 'text', placeholder: '@Loisbecket123', required: false, editable: true },
      { name: 'secondTelegramLink', label: 'Telegram Profile2', type: 'text', placeholder: '@Loisbecket1234', required: false, editable: true },
   ]

   const updateProfileMutation = useMutation({
      mutationFn: () => {
         if (!adminData) throw new Error('admin is null');
         return updateAdminAPI({
            password: adminSettings.facebook,
            telegramLink: adminSettings.telegram,
            secondTelegramLink: adminSettings.secondTelegramLink,
            whatsappLink: adminSettings.whatsapp,
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
               adminSettings_inputs.map(details => (
                  <div className='flex flex-col gap-2' key={details.name}>
                     <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                     <input type={details.type} value={adminSettings[details.name]} disabled={!details.editable} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserSettingsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
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

         <button type="button" className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-[#C0C0C063] theme-button-effect disabled:opacity-50" onClick={logout}>Logout</button>
      </form>
   )
}

export default Settings