'use client';
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useCallback, useState } from 'react'

interface formStateType {
   password: string;
   confirm_password: string;
   [key: string]: string; // Add this line
}

const NewPassword = () => {
   const router = useRouter()
   const [formState, setFormState] = useState<formStateType>({
      password: '',
      confirm_password: ''
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
                           <button onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>
                        </div>
                     </div>
                  ))
               }
            </div>
            <button type='submit' className='flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Save</button>
         </form>
      </div>
   )
}

export default NewPassword