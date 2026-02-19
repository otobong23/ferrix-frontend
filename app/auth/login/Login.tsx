'use client';
import Image from 'next/image'
import logo from '@/assets/vectors/Logo.svg'
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import GoogleLogin from '@/components/google/GoogleLogin';
import { showToast } from '@/utils/alert';
import { useMutation } from '@tanstack/react-query';
import { loginUserAPI } from '@/services/Authentication';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Auth.context';

interface formStateType {
  email: string;
  password: string
  [key: string]: string; // Add this line
}

const Login = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [formState, setFormState] = useState<formStateType>({
    email: '',
    password: '',
  })

  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }, [])

  // Signup mutation using React Query
  const loginMutation = useMutation({
    mutationFn: (data: loginFormStateType) => loginUserAPI(data),
    onSuccess: (data) => {
      // Handle successful signup
      console.log('Login successful:', data);
      setUser(data);

      // Show success message
      showToast('success', 'Account Logged in successfully!');

      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: any) => {
      // Handle error
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      showToast('error', errorMessage);
    },
  });

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Basic validation
    if (!formState.email || !formState.password) {
      showToast('warning', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      showToast('warning', 'Please enter a valid email address');
      return;
    }

    // Password validation (minimum 6 characters)
    if (formState.password.length < 6) {
      showToast('warning', 'Password must be at least 6 characters long');
      return;
    }

    console.log('Form submitted:', formState)
    // Add your form submission logic here

    // Submit form
    loginMutation.mutate(formState);
  }, [formState, loginMutation])

  const [form_inputs, setForm_inputs] = useState([
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
    { name: 'password', label: 'Set Password', type: 'password', placeholder: '*******', required: true },
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

      <h1 className='text-[#F5F5F7] font-inria-sans font-bold text-5xl mb-4'>Sign In to your</h1>
      <h1 className='text-[#F5F5F7] font-inria-sans font-bold text-5xl mb-4'>Account</h1>
      <p className='text-[#6C7278] text-sm'>Enter your email and password to log in</p>

      <form className='flex flex-col gap-4 pt-10' onSubmit={handleSubmit}>
        {
          form_inputs.map(details => (
            <div className='flex flex-col gap-2' key={details.name}>
              <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
              <div className={`relative ${details.name === 'amount' ? "before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl before:text-[#F5F5F7] before:focus:text-[#62686E]" : ''}`}>
                <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className={`outline-0 border border-[#9EA4AA] px-4 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full ${details.name === 'password' ? 'pr-10' : ''}`} placeholder={details.placeholder} />
                {details.name === "password" && <button type='button' onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>}
              </div>
            </div>
          ))
        }

        <Link href="/auth/password-reset" className='text-investor-gold text-right mt-1'>Forgot Password ?</Link>

        <button type='submit' className='flex items-center justify-center my-6 py-4 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Login</button>
      </form>

      <div className='flex justify-center relative my-3 before:content-[""] before:w-full before:h-0.5 before:bg-[#EDF1F3] before:top-1/2 before:-translate-y-1/2 before:absolute'>
        <p className='px-4 bg-(--background) z-50'>Or</p>
      </div>

      <div className='pb-5'>
        <GoogleLogin auth='login' />
      </div>

      <p className='text-center text-[#6C7278]'>Don't have an account? <Link href="/auth/signup" className='text-investor-gold ml-1'>Sign Up</Link></p>
    </div>
  )
}

export default Login