'use client';
import UI_header from '@/components/UI_header'
import p1 from '@/assets/imgs/p1.png'
import { Icon } from '@iconify-icon/react';
import { FormEvent, useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { sendSupportmailAPI } from '@/services/Profile';
import { showToast } from '@/utils/alert';


const HelpCenter = () => {
   const [formState, setFormstate] = useState({
      email: '',
      name: '',
      message: ''
   })

   const handleFormState = useCallback((name: 'name' | 'email' | 'message', value: string) => {
      setFormstate(prev => ({ ...prev, [name]: value }))
   }, [])

   const messageMutation = useMutation({
      mutationFn: () => {
         return sendSupportmailAPI(formState)
      },

      onMutate: () => {
         toast.loading('Send Mail...', {
            id: 'help-message',
         });
      },

      onSuccess: () => {
         toast.success('Help Message sent successfully', {
            id: 'help-message',
         });
      },

      onError: (error: AxiosError<any>) => {
         toast.error(
            error.response?.data?.message || 'Failed to send Help Message',
            { id: 'help-message' }
         );
      },
   });

   const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
         e.preventDefault();
         messageMutation.mutate();
      },
      [messageMutation]
   );

   return (
      <div>
         <UI_header title='Help' description='Center' image={p1} containerStyle='items-center' />

         <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className='flex px-4 gap-3 mb-2.5'>
               <div className='flex flex-col flex-1'>
                  <label htmlFor="name" className='mb-1.5'>Name</label>
                  <input required type="text" onChange={e => handleFormState("name", e.target.value)} value={formState['name']} name='name' id='name' placeholder='Loisbecket' className='placeholder:text-[#62686E] bg-[#F5F5F7]/7 px-3.5 py-3 outline-0' />
               </div>
               <div className='flex flex-col flex-1'>
                  <label htmlFor="email" className='mb-1.5'>Email</label>
                  <input required type="text" onChange={e => handleFormState("email", e.target.value)} value={formState['email']} name='email' id='email' placeholder='Loisbecket@gmail.com' className='placeholder:text-[#62686E] bg-[#F5F5F7]/7 px-3.5 py-3 outline-0' />
               </div>
            </div>
            <div className='flex flex-col px-4'>
               <label htmlFor="message" className='mb-1.5'>Message</label>
               <textarea required name='message' onChange={e => handleFormState("message", e.target.value)} value={formState['message']} rows={7} id='message' placeholder='Type in your message' className='placeholder:text-[#62686E] bg-[#F5F5F7]/7 px-3.5 py-3 outline-0 resize-none overflow-auto no-scrollbar' />
            </div>

            <button
               type="submit"
               disabled={messageMutation.isPending}
               className="flex items-center justify-center mx-4 my-6 py-3 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
            >
               {messageMutation.isPending ? 'Sending...' : 'Send'}
            </button>
         </form>
      </div>
   )
}

export default HelpCenter