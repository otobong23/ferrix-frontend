'use client';

import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

interface formStateType {
  username: string;
  email: string;
  facebook: string;
  telegram: string;
  whatsapp: string;
  [key: string]: string; // Add this line
}

const Settings = () => {
  const router = useRouter()
  const [formState, setFormState] = useState<formStateType>({
    username: '',
    email: '',
    facebook: '',
    telegram: '',
    whatsapp: '',
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
  },[formState])

  const form_inputs = [
    { name: 'username', label: 'User Name', type: 'text', placeholder: 'Lois Becket', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
    { name: 'facebook', label: 'Facebook Profile', type: 'text', placeholder: 'Loisbecket@gmail.com', required: false },
    { name: 'telegram', label: 'Telegram Profile', type: 'text', placeholder: '@Loisbecket123', required: false },
    { name: 'whatsapp', label: 'WhatsApp Profile', type: 'number', placeholder: '07012345678', required: false },
  ]
  return (
    <div>
      <div className='py-5 px-6 flex flex-col items-center gap-4 bg-[#44474F] rounded-lg mx-4 my-4'>
        <button onClick={() => router.back()} className='flex items-center self-start'>
          <Icon icon="fluent:ios-arrow-24-regular" />
          <span>Back</span>
        </button>

        <button className='w-20 h-20 rounded-full bg-[#C7C7C7] flex justify-center items-center relative theme-button-effect'>
          <Icon icon="fluent:person-12-filled" className='text-[#44474F] text-4xl' />
          <span className='absolute right-0 bottom-1/3 translate-y-1/2'>
            <Icon icon="mingcute:edit-3-line" className='text-[#44474F]' width={20} />
          </span>
        </button>

        <div>
          <p className='text-[#C3C3C3] text-center text-lg'>ID: 2878WR</p>
          <p className='text-[#C3C3C3] text-center text-lg'>Phone: 8048378291</p>
        </div>
      </div>

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

export default Settings