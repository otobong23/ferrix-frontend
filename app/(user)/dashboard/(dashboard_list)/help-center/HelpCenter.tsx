'use client';
import UI_header from '@/components/UI_header'
import p1 from '@/assets/imgs/p1.png'


const HelpCenter = () => {
   return (
      <div>
         <UI_header title='Help' description='Center' image={p1} containerStyle='items-center' />

         <div className='flex px-4 gap-3'>
            <div className='flex flex-col flex-1'>
               <label htmlFor="name">Name</label>
               <input type="text" name='name' id='name' placeholder='Loisbecket' className='placeholder:text-[#62686E]' />
            </div>
            <div className='flex flex-col flex-1'>
               <label htmlFor="email">Email</label>
               <input type="text" name='email' id='email' placeholder='Loisbecket@gmail.com' className='placeholder:text-[#62686E]' />
            </div>
         </div>
         <div className='flex flex-col px-4'>
            <label htmlFor="message">Message</label>
            <textarea name='message' id='message' placeholder='Type in your message' className='placeholder:text-[#62686E]' />
         </div>

         
      </div>
   )
}

export default HelpCenter