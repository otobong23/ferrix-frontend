'use client';
import { useResetPassword } from '@/context/ResetPassword.context';
import { newPasswordAPI } from '@/services/Authentication';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify-icon/react'
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface formStateType {
   password: string;
   confirm_password: string;
   [key: string]: string; // Add this line
}

const NewPassword = () => {
   const router = useRouter()
   const { passwordResetToken, clearPasswordResetToken } = useResetPassword()
   const [loading, setLoading] = useState(false)
   const [formState, setFormState] = useState<formStateType>({
      password: '',
      confirm_password: ''
   })
   const handleFormState = useCallback((name: string, value: string) => {
      setFormState(prev => ({ ...prev, [name]: value }))
   }, [])

   useEffect(() => {
      if (!passwordResetToken) {
         showToast('error', "Unauthorized access");
         router.replace('/auth/login');
         return;
      }

      return () => clearPasswordResetToken()
   }, []);

   const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const toastId = toast.loading('Processing...');
      setLoading(true)
      if (formState.password !== formState.confirm_password) {
         toast.error("password and confirm password must be the same", { id: toastId })
         setLoading(false)
         return
      }
      try {
         if (!passwordResetToken) {
            console.error("Password reset token is missing")
            throw new Error("Password reset token is missing");
         }
         const response = await newPasswordAPI({ newPassword: formState.password }, passwordResetToken);
         toast.success(response.data.message, { id: toastId })
         router.replace('/auth/login')
      } catch (err) {
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : err instanceof Error ? err.message : 'An unexpected error occurred';
         toast.error(message, { id: toastId })
      } finally {
         setLoading(false)
      }
   }, [formState, passwordResetToken, router])

   const [form_inputs, setForm_inputs] = useState([
      { name: 'password', label: 'Password', type: 'password', placeholder: '*******', required: true },
      { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: '*******', required: true },
   ])

   const togglePasswordType = useCallback(() => {
      setForm_inputs(prev => prev.map(item => {
         return {
            ...item,
            type: item.type === 'password' ? 'text' : 'password'
         }
      }))
   }, [])

   return (
      <div className='mx-4 py-12'>
         <p className='pt-11 pb-24'>
            <button onClick={() => router.back()}>
               <Icon icon="solar:arrow-left-outline" width={24} className='text-[#e1e5ef]' />
            </button>
         </p>
         <h1 className='text-[#F5F5F7] font-inria-sans font-bold text-5xl mb-4'>Password <br /> recovery</h1>

         <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='px-4 flex flex-col gap-4'>
               {
                  form_inputs.map(details => (
                     <div className='flex flex-col gap-2' key={details.name}>
                        <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                        <div className="relative">
                           <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full pr-10' placeholder={details.placeholder} />
                           <button type='button' onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>
                        </div>
                     </div>
                  ))
               }
            </div>
            <button type='submit' className={`flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect ${loading && !formState.password && !formState.confirm_password ? 'opacity-50' : 'opacity-100'}`} disabled={loading && !formState.password && !formState.confirm_password}>Save</button>
         </form>
      </div>
   )
}

export default NewPassword