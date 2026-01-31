'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import SUPPORTED_BANKS from "@/constant/SUPPORTED_BANKS";
import UI_header from "@/components/UI_header";
import { Icon } from "@iconify-icon/react";

interface formStateType {
   bank_name: string;
   account_number: string;
   account_name: string;
   withdrawal_password: string;
   [key: string]: string;
}

const BankDetails = () => {
   // const [selectedBank, setSelectedBank] = useState<Bank | null>(SUPPORTED_BANKS.find(bank => bank.name === user.bankName) || null);
   const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
   const [showBankDropdown, setShowBankDropdown] = useState<boolean>(false);
   const [error, setError] = useState<ErrorType>({})

   const [formState, setFormState] = useState<formStateType>({
      bank_name: '',
      account_number: '',
      account_name: '',
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
      { name: 'account_number', label: 'Account', type: 'text', placeholder: 'Enter bank account number', required: true },
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

   useEffect(() => { handleFormState("bank_name", selectedBank?.name || '') }, [selectedBank])
   return (
      <div>
         <UI_header title="BCD" description="Setup Bank details" />

         <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='px-4 flex flex-col gap-4'>
               {
                  form_inputs.map(details => details.name !== 'bank_name' ? (
                     <div className='flex flex-col gap-2' key={details.name}>
                        <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                        {details.name === "account_number" ?
                           <input type={details.type} value={formState[details.name]} inputMode="numeric" pattern="[0-9]*" required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                           : <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                        }
                     </div>
                  ) : (
                     <div className='relative' key={details.name}>
                        <p className='text-xl text-[#F5F5F7] mb-2'>{details.label}</p>
                        <div
                           onClick={() => setShowBankDropdown(!showBankDropdown)}
                           className={`w-full px-3 py-3 rounded-xl outline-0 border border-[#9EA4AA] cursor-pointer flex justify-between items-center bg-none text-lg`}
                        >
                           <div className='flex items-center gap-2'>
                              {selectedBank && (
                                 <img
                                    src={selectedBank.logo}
                                    alt={selectedBank.name}
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                       e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                    }}
                                 />
                              )}
                              <span className={selectedBank ? 'text-[#F5F5F7]' : 'text-[#62686E]'}>
                                 {selectedBank ? selectedBank.name : 'Select Bank'}
                              </span>
                           </div>
                           <Icon icon={showBankDropdown ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="text-xl" />
                        </div>

                        {showBankDropdown && (
                           <div className='absolute z-10 w-full mt-1 bg-(--background) border-2 border-[#424545] rounded-[15px] max-h-80 overflow-y-auto shadow-lg'>
                              {SUPPORTED_BANKS.map((bank) => (
                                 <div
                                    key={bank.code}
                                    onClick={() => handleBankSelect(bank)}
                                    className='flex items-center gap-3 px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-[#62686E] last:border-b-0'
                                 >
                                    <img
                                       src={bank.logo}
                                       alt={bank.name}
                                       className="w-8 h-8 object-contain"
                                       onError={(e) => {
                                          e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                       }}
                                    />
                                    <span className='text-[#F5F5F7] text-sm'>{bank.name}</span>
                                 </div>
                              ))}
                           </div>
                        )}
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