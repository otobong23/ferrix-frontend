import { onsite1, onsite2, onsite3, onsite4, onsite5, onsite6 } from '@/assets/imgs/onsite'
import UI_header from '@/components/UI_header'
import Image from 'next/image'
import React from 'react'

const page = () => {
  const onsiteImages = [onsite1, onsite2, onsite3, onsite4, onsite5, onsite6]
  return (
    <div>
      <UI_header title='Onsite' description='Working site Zones' />

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-4">
        {onsiteImages.map((img, index) => (
          <div key={'image' + index} className="break-inside-avoid">
            <Image
              src={img}
              alt="site image"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default page