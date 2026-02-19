'use client';
import { Icon } from '@iconify-icon/react'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'
import c2 from '@/assets/imgs/c2.png'

const UI_header = ({ title, description, image = c2, containerStyle = '' }: { title: string, description: string, image?: StaticImageData, containerStyle?: string }) => {
   const router = useRouter()
   return (
      <div className={`flex bg-[#44474F] rounded-lg m-4 ${containerStyle}`}>
         <div className='flex-1 px-4 py-3'>
            <button onClick={() => router.back()} className='flex items-center'>
               <Icon icon="fluent:ios-arrow-24-regular" />
               <span>Back</span>
            </button>

            <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-2'>{title}</h1>

            <p className='text-[#9EA4AA]'>{description}</p>
         </div>

         <div className='flex-1'>
            <Image src={image} alt='c2 image' className='w-full' />
         </div>
      </div>
   )
}

export default UI_header