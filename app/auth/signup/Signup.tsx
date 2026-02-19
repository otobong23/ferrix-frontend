'use client';
import { Icon } from '@iconify-icon/react';
import logo from '@/assets/vectors/Logo.svg'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import GoogleLogin from '@/components/google/GoogleLogin';
import { signUpUserAPI } from '@/services/Authentication';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '@/utils/alert';
import { useAuth } from '@/context/Auth.context';


const Signup = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const searchParams = useSearchParams();
   const refCode = searchParams.get('invite');
  const [formState, setFormState] = useState<SignupFormStateType>({
    fullName: '',
    email: '',
    DOB: '',
    phone: '',
    password: '',
    referral_code: refCode ? refCode : ''
  })

  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }, [])

  // Signup mutation using React Query
  const signupMutation = useMutation({
    mutationFn: (data: SignupFormStateType) => signUpUserAPI(data),
    onSuccess: (data) => {
      // Handle successful signup
      console.log('Signup successful:', data);
      setUser(data);

      // Show success message
      showToast('success', 'Account created successfully!');

      // Redirect to login or dashboard
      // router.push('/auth/login');
      // OR redirect to dashboard if auto-login
      router.push('/dashboard');
    },
    onError: (error: any) => {
      // Handle error
      console.error('Signup error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Signup failed. Please try again.';
      showToast('error',errorMessage);
    },
  });


  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formState.fullName || !formState.email || !formState.password) {
      showToast('warning','Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      showToast('warning','Please enter a valid email address');
      return;
    }

    // Password validation (minimum 6 characters)
    if (formState.password.length < 6) {
      showToast('warning','Password must be at least 6 characters long');
      return;
    }

    // Phone validation (basic)
    if (formState.phone && formState.phone.length < 10) {
      showToast('warning','Please enter a valid phone number');
      return;
    }

    // Age validation (must be 18+)
    if (formState.DOB) {
      const birthDate = new Date(formState.DOB);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (age < 18 || (age === 18 && monthDiff < 0)) {
        showToast('warning','You must be at least 18 years old to register');
        return;
      }
    }

    // Submit form
    signupMutation.mutate(formState);
  }, [formState, signupMutation]);


  const [form_inputs, setForm_inputs] = useState([
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Lois Becket', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
    { name: 'DOB', label: 'Date Of Birth', type: 'date', placeholder: 'DOB', required: true },
    { name: 'phone', label: 'WhatsApp Number', type: 'text', placeholder: '(234) 904 382 2819', required: true },
    { name: 'password', label: 'Set Password', type: 'password', placeholder: '*******', required: true },
    { name: 'referral_code', label: 'Referral (Optional)', type: 'text', placeholder: '9847266', required: false },
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

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      const formatted = [match[1], match[2], match[3]]
        .filter(Boolean)
        .join(' ');
      return formatted;
    }
    return value;
  };

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
                <input type={details.type} value={
                  details.name === 'phone' && formState.phone
                    ? formatPhoneNumber(formState.phone)
                    : formState[details.name as keyof SignupFormStateType]
                }
                disabled={details.name === 'referral_code' && refCode ? true : false}
                required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className={`outline-0 border border-[#9EA4AA] px-4 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full ${details.name === 'password' ? 'pr-10' : ''}`} placeholder={details.placeholder} />
                {details.name === "password" && <button onClick={togglePasswordType} type='button' className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>}
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
        <GoogleLogin auth='signup' referrer='refCode' />
      </div>

      <p className='text-center text-[#6C7278]'>Already have an account? <Link href="/auth/login" className='text-investor-gold ml-1'>Login</Link></p>
    </div>
  )
}

export default Signup