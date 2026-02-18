'use client';
import { useAdmin } from '@/context/Admin.context';
import { getUserByUserIdAPI, updateUserByAdminAPI } from '@/services/Admin';
import { Icon } from '@iconify-icon/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const EditBalance = () => {
   const { adminData } = useAdmin()
   const router = useRouter()
   const [amount, setAmount] = useState<number>(0)
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

   useEffect(() => {
      if (!user) return;
      setAmount(user.balance);
   }, [user])


   /* =======================
     UPDATE PROFILE MUTATION
     ======================= */
   const updateProfileMutation = useMutation({
      mutationFn: () => {
         if (!user) throw new Error('User is null');
         return updateUserByAdminAPI(user?.email, {
            balance: amount,
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
      <div>
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
            <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </button>
         </div>

         <div className='px-4 mb-10'>
            <button onClick={() => router.back()} className='flex items-center mb-1'>
               <Icon icon="fluent:ios-arrow-24-regular" />
               <span>Back</span>
            </button>

            <p className='text-5xl font-bold font-inria-sans'>Edit Balance</p>
            <p className='text-[#9EA4AA]'>Gift this user</p>
         </div>

         <form className='px-4 mb-5 flex flex-col' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
               <label htmlFor="amount" className='text-xl text-[#F5F5F7]'>Current Amount</label>
               <div className="relative before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl before:text-[#F5F5F7] before:focus:text-[#62686E]">
                  <input type="number" value={amount} required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} name="amount" id="amount" className='outline-0 border border-[#9EA4AA] pr-3.5 pl-8 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full' placeholder="Enter Deposit Amount" />
               </div>
            </div>

            <p className="px-2.5 py-3.5 rounded-sm bg-[#F5F5F7]/7 my-5">Amount in the edit field is the user current Original Balance</p>
            <button
               type="submit"
               disabled={updateProfileMutation.isPending}
               className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
            >
               {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
            </button>
         </form>

      </div>
   )
}

export default EditBalance