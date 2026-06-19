'use client';
import React from 'react'

const AuthWrapper = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <div className='h-screen flex'>
         <div className='basis-full lg:basis-3/5 flex justify-center items-center'>
            <div className='w-full lg:w-2/3'>{children}</div>
         </div>
         <div className='hidden lg:block lg:basis-2/5 lg:bg-[#9EA4AA]'></div>
      </div>
   )
}

export default AuthWrapper