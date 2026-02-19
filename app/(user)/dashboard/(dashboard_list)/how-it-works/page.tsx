import UI_header from '@/components/UI_header'
import p1 from '@/assets/imgs/p1.png'
import { howItWorks } from '@/constant/Remark.constant'

const page = () => {
  return (
    <div>
      <UI_header title='HOW' description='it works' image={p1} containerStyle='items-center' />

      <div className='px-4 flex flex-col gap-3'>
        {
          Object.entries(howItWorks).map(([key, value]) => (
            <div key={key} className='bg-[#2F3033] px-4 py-6 rounded-lg'>
              <h1 className='text-xl mb-1 capitalize'>{key.split('_').join(' ')}</h1>
              {Array.isArray(value) ? <ol className='list-decimal list-outside pl-4 space-y-2'>
                {
                  value.map((item, index) => <li key={key+index} className='text-[#9EA4AA]'>{item}</li>)
                }
              </ol>
                : <p className='text-[#9EA4AA]'>{value}</p>}
            </div>
          ))
        }
      </div>

      <div>
        {/* <iframe src="" frameborder="0"></iframe> */}
      </div>
    </div>
  )
}

export default page