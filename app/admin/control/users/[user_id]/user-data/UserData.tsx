'use client';
import SUPPORTED_BANKS from '@/constant/SUPPORTED_BANKS';
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'

interface userSettingsType {
   username: string;
   email: string;
   facebook: string;
   telegram: string;
   whatsapp: string;
   [key: string]: string; // Add this line
}

interface bankDetailsType {
   bank_name: string;
   account_number: string;
   account_name: string;
   withdrawal_password: string;
   [key: string]: string;
}

const UserData = () => {
   const router = useRouter()
   const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
   const [showBankDropdown, setShowBankDropdown] = useState<boolean>(false);

   const [userSettings, setserSettingsState] = useState<userSettingsType>({
      username: '',
      email: '',
      facebook: '',
      telegram: '',
      whatsapp: '',
   })

   const [bankDetails, setBankDetails] = useState<bankDetailsType>({
      bank_name: '',
      account_number: '',
      account_name: '',
      withdrawal_password: '',
   })

   const handleUserSettingsState = useCallback((name: string, value: string) => {
      setserSettingsState(prev => ({ ...prev, [name]: value }))
   }, [])
   const handleBankDetailsState = useCallback((name: string, value: string) => {
      setBankDetails(prev => ({ ...prev, [name]: value }))
   }, [])

   const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Object.entries(formState).forEach(([key, value]) => {
      //   if(!value) alert(key)
      // })
      console.log('Form submitted:', userSettings)
      // Add your form submission logic here
   }, [userSettings, bankDetails])

   const userSettings_inputs = [
      { name: 'username', label: 'User Name', type: 'text', placeholder: 'Lois Becket', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
      { name: 'facebook', label: 'Facebook Profile', type: 'text', placeholder: 'Loisbecket@gmail.com', required: false },
      { name: 'telegram', label: 'Telegram Profile', type: 'text', placeholder: '@Loisbecket123', required: false },
      { name: 'whatsapp', label: 'WhatsApp Profile', type: 'number', placeholder: '07012345678', required: false },
   ]

   const bankDetails_inputs = [
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

   useEffect(() => { handleBankDetailsState("bank_name", selectedBank?.name || '') }, [selectedBank])
   return (
      <div>
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
                     <input type={details.type} value={userSettings[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleUserSettingsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                  </div>
               ))
            }
         </div>

         <div className='px-4 flex flex-col gap-4'>
            {
               bankDetails_inputs.map(details => details.name !== 'bank_name' ? (
                  <div className='flex flex-col gap-2' key={details.name}>
                     <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                     {details.name === "account_number" ?
                        <input type={details.type} value={bankDetails[details.name]} inputMode="numeric" pattern="[0-9]*" required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleBankDetailsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                        : <input type={details.type} value={bankDetails[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleBankDetailsState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
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
      </div>
   )
}

export default UserData