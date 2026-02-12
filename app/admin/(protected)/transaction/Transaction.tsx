'use client';
import { Icon } from "@iconify-icon/react";

const Transaction = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
                  <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
                  <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
                     <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
                  </button>
               </div>
    </div>
  )
}

export default Transaction