'use client';
import { Icon } from '@iconify-icon/react';
import logo from '@/assets/vectors/Logo.svg'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import GoogleLogin from '@/components/google/GoogleLogin';


const Signup = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<loginFormStateType>({
    fullName: '',
    email: '',
    DOB: '',
    phone: '',
    password: '',
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

  const [form_inputs, setForm_inputs] = useState([
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Lois Becket', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
    { name: 'DOB', label: 'Date Of Birth', type: 'date', placeholder: 'DOB', required: true },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '(234) 904 382 2819', required: true },
    { name: 'password', label: 'Set Password', type: 'password', placeholder: '*******', required: true },
    { name: 'referral', label: 'Referral (Optional)', type: 'text', placeholder: '9847266', required: false },
  ])

  const togglePasswordType = useCallback(() => {
    setForm_inputs(prev => prev.map(item => {
      if (item.name === 'password') {
        return {
          ...item,
          type: item.type === 'password' ? 'text' : 'password'
        }
      }
      return item
    }))
  }, [])

  return (
    <div className='mx-4 py-12'>
      <div id='sidebar_logo' className='flex pt-11 pb-24'>
        <Image src={logo} alt='gem dark' className='object-cover' />
      </div>

      <h1 className='text-[#F5F5F7] font-inria-sans font-bold text-5xl mb-4'>Register</h1>
      <p className='text-[#6C7278] text-sm'>Create an account to continue!</p>

      <form className='flex flex-col gap-4 pb-5 pt-10' onSubmit={handleSubmit}>
        {
          form_inputs.map(details => (
            <div className='flex flex-col gap-2' key={details.name}>
              <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
              <div className={`relative ${details.name === 'amount' ? "before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl before:text-[#F5F5F7] before:focus:text-[#62686E]" : ''}`}>
                <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className={`outline-0 border border-[#9EA4AA] px-4 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full ${details.name === 'password' ? 'pr-10' : ''}`} placeholder={details.placeholder} />
                {details.name === "password" && <button onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>}
              </div>
            </div>
          ))
        }

        <button type='submit' className='flex items-center justify-center my-6 py-4 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Register</button>
      </form>

      <div className='flex justify-center relative my-3 before:content-[""] before:w-full before:h-0.5 before:bg-[#EDF1F3] before:top-1/2 before:-translate-y-1/2 before:absolute'>
        <p className='px-4 bg-(--background) z-50'>Or</p>
      </div>

      <div className='pb-5'>
        <GoogleLogin auth='signup' />
      </div>

      <p className='text-center text-[#6C7278]'>Already have an account? <Link href="/auth/login" className='text-investor-gold ml-1'>Login</Link></p>
    </div>
  )
}

export default Signup