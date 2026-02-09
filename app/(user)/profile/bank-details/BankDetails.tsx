'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import SUPPORTED_BANKS from "@/constant/SUPPORTED_BANKS";
import UI_header from "@/components/UI_header";
import { Icon } from "@iconify-icon/react";
import { useUser } from "@/context/User.context";
import { showToast } from "@/utils/alert";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { updateProfileAPI } from "@/services/Profile";

interface formStateType {
   withdrawal_wallet: string;
   withdrawal_password: string;
   [key: string]: string;
}

const BankDetails = () => {
   const { userData, refreshUser } = useUser()
   const [formState, setFormState] = useState<formStateType>({
      withdrawal_wallet: '',
      withdrawal_password: '',
   })

   useEffect(() => {
      if (userData) {
         if (!userData.walletPassword) showToast('warning', 'Please set up your wallet password in profile to use this feature');
         setFormState(prev => ({ ...prev, withdrawal_wallet: userData.withdrawalWallet || '' }))
      }
   }, [userData])


   const handleFormState = useCallback((name: string, value: string) => {
      if (userData && !userData.walletPassword) {
         showToast('warning', 'Please set up your wallet password in profile to use this feature')
         return;
      };
      setFormState(prev => ({ ...prev, [name]: value }))
   }, [])


   const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (formState.withdrawal_password !== userData?.walletPassword) {
         showToast('error', 'Incorrect wallet password');
         return;
      }
      const toastId = toast.loading('Loading...')
      try {
         const res = updateProfileAPI({ withdrawalWallet: formState.withdrawal_wallet })
         console.log(res)
         refreshUser();
         toast.success('Wallet details updated successfully', { id: toastId })
      } catch (err) {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         toast.error(message, { id: toastId });
      }
      // Add your form submission logic here
   }, [formState])


   const [form_inputs, setForm_inputs] = useState([
      { name: 'withdrawal_wallet', label: 'Withdrawal Wallet', type: 'text', placeholder: 'Your Wallet Address', required: true },
      { name: 'withdrawal_password', label: 'Withdrawal Password', type: 'password', placeholder: '*******', required: true },
   ])

   const togglePasswordType = useCallback(() => {
      setForm_inputs(prev => prev.map(item => {
         if (item.name === 'withdrawal_password') {
            // Create a NEW object instead of mutating
            return {
               ...item,
               type: item.type === 'password' ? 'text' : 'password'
            }
         }
         return item
      }))
   }, [])
   return (
      <div>
         <UI_header title="BCD" description="Setup Wallet details" />

         <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='px-4 flex flex-col gap-4'>
               {
                  form_inputs.map(details => (
                     <div className='flex flex-col gap-2' key={details.name}>
                        <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                        <div className="relative">
                           <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className={`outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]  w-full ${details.name === 'withdrawal_password' ? 'pr-10' : ''}`} placeholder={details.placeholder} />
                           {details.name === "withdrawal_password" && <button type="button" onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>}
                        </div>
                     </div>
                  ))
               }
            </div>
            <button type='submit' className={`flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect ${!formState.withdrawal_wallet && !formState.withdrawal_password ? 'opacity-50' : ''}`} disabled={!formState.withdrawal_wallet && !formState.withdrawal_password}>Save</button>
         </form>
      </div>
   )
}

export default BankDetails