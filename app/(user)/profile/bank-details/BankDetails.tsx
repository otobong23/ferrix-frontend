'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import SUPPORTED_BANKS from "@/constant/SUPPORTED_BANKS";
import UI_header from "@/components/UI_header";

interface formStateType {
   bank: string;
   account: string;
   name: string;
   withdrawal_password: string;
   [key: string]: string;
}

const BankDetails = () => {
   // const [selectedBank, setSelectedBank] = useState<Bank | null>(SUPPORTED_BANKS.find(bank => bank.name === user.bankName) || null);
   const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
   const [showBankDropdown, setShowBankDropdown] = useState<boolean>(false);

   const [formState, setFormState] = useState<formStateType>({
      bank: '',
      account: '',
      name: '',
      withdrawal_password: '',
   })


   const handleFormState = useCallback((name: string, value: string) => {
      setFormState(prev => ({ ...prev, [name]: value }))
   }, [])


   const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Object.entries(formState).forEach(([key, value]) => {
      //   if(!value) alert(key)
      // })
      console.log('Form submitted:', formState)
      // Add your form submission logic here
   }, [formState])


   const form_inputs = [
      { name: 'bank_name', label: 'Bank', type: 'text', placeholder: 'Kuda', required: true },
      { name: 'account_number', label: 'Account', type: 'number', placeholder: 'Enter bank account number', required: true },
      { name: 'account_name', label: 'Name', type: 'text', placeholder: 'Enter account name', required: true },
      { name: 'withdrawal_password', label: 'Withdrawal Password', type: 'password', placeholder: '*******', required: true },
   ]

   const handleBankSelect = (bank: Bank) => {
      setSelectedBank(bank);
      setShowBankDropdown(false);
      // setError({ ...error, bank_name: '' });

      // Auto-resolve account if account number is already entered
      // resolveAccountName(form.account_number, bank.code);
   };
   return (
      <div>
         <UI_header title="BCD" description="Setup Bank details" />

         <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='px-4 flex flex-col gap-4'>
               {
                  form_inputs.map(details => (
                     <div className='flex flex-col gap-2' key={details.name}>
                        <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                        <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                     </div>
                  ))
               }
            </div>
            <button type='submit' className='flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Save</button>
         </form>
      </div>
   )
}

export default BankDetails