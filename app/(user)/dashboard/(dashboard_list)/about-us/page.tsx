import UI_header from '@/components/UI_header'
import d from '@/assets/imgs/d.png'
import { aboutUs } from '@/constant/Remark.constant'


const page = () => {
  return (
    <div>
      <UI_header title='About us' description='Company' image={d} containerStyle='items-center' />

      <div className='px-4 flex flex-col gap-3'>
         {
            Object.entries(aboutUs).map(([key, value]) => (
               <div key={key} className='bg-[#2F3033] px-4 py-6 rounded-lg'>
                  <h1 className='text-xl mb-1 capitalize'>{key}</h1>
                  <p className='text-[#9EA4AA]'>{value}</p>
               </div>
            ))
         }
      </div>
    </div>
  )
}

export default page