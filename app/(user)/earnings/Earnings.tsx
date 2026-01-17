'use client';
import { Icon } from '@iconify-icon/react'
import Image from 'next/image';
import { useState } from 'react';
import gem from '@/assets/imgs/gem.png';
import Link from 'next/link';
import f1 from '@/assets/imgs/f1.png';

const Earnings = () => {
   const [userID] = useState<String>("UserID24");
   const [balance] = useState<Number>(200000)
   const [miningAsset] = useState<Number>(360000)
   const [crew] = useState<Number>(2)
   const [commission] = useState<Number>(20)
   const [isSpinning, setIsSpinning] = useState(false);

   // Calculate time REMAINING until 24 hours
   const calculateTimeRemaining = (startTime: number) => {
      const now = Date.now();
      const elapsed = now - startTime;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      // const fiveMinutes = 5 * 60 * 1000;
      const remaining = twentyFourHours - elapsed;

      if (remaining <= 0) {
         return { hours: 0, minutes: 0, seconds: 0, canSpin: true };
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, canSpin: false };
   }

   const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number, canSpin: boolean }>(() => {
      // if (user && user.spinWheelTimerStart) {
      //    return calculateTimeRemaining(user.spinWheelTimerStart);
      // }
      if (true) return calculateTimeRemaining(Date.now());
      return { hours: 0, minutes: 0, seconds: 0, canSpin: true };
   })
   return (
      <div>
         <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
            <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">{userID}</h1>
            <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
               <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
            </button>
         </div>

         <aside className="flex justify-between mx-4 py-3 pb-8 lg:py-[35px] px-4 rounded-lg bg-[linear-gradient(153.15deg,rgba(255,255,255,0.4)-49.92%,rgba(255,255,255,0)103.38%)]">
            <div className="flex flex-col gap-2">

               {/* Total Assets */}
               <div className="flex items-center gap-0.5">
                  <Icon icon="solar:money-bag-bold" className="text-xs text-[#4DB6AC] leading-tight" />
                  <h1 className="text-[#9EA4AA] text-[9px] lg:text-xs font-poppins">Total Assets</h1>
               </div>

               {/* Total balance */}
               <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">{balance.toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h1>

               <div className='flex gap-16'>
                  <div>
                     {/* Mining Details */}
                     <div className="flex gap-1.5 mb-2">
                        <Icon icon="mdi:pickaxe" className="text-base lg:text-lg text-[#9EA4AA] leading-tight" />
                        <div className="flex flex-col">
                           <h1 className="text-[#9EA4AA] text-base lg:text-lg font-poppins">Total investment</h1>
                           <h1 className="text-investor-gold text-base lg:text-lg font-poppins font-bold">{miningAsset.toLocaleString('en-US', { style: "currency", currency: "USD" })}</h1>
                        </div>
                     </div>

                     {/* Withdrawawn Details */}
                     <div className="flex gap-1.5">
                        <Icon icon="mdi:pickaxe" className="text-base lg:text-lg text-[#9EA4AA] leading-tight" />
                        <div className="flex flex-col">
                           <h1 className="text-[#9EA4AA] text-base lg:text-lg font-poppins">Total Withdrawn</h1>
                           <h1 className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent text-base lg:text-lg font-poppins font-bold">{miningAsset.toLocaleString('en-US', { style: "currency", currency: "USD" })}</h1>
                        </div>
                     </div>
                  </div>

                  <div>
                     {/* Commission Details */}
                     <div className="flex gap-1.5">
                        <Icon icon="mdi:people" className="text-base lg:text-lg text-[#9EA4AA] leading-tight" />
                        <div className="flex flex-col">
                           <h1 className="text-[#9EA4AA] text-base lg:text-lg font-poppins">{crew.toLocaleString()}</h1>
                           <h1 className="text-[#9EA4AA] font-bold text-base lg:text-lg font-poppins">{commission.toLocaleString('en-US', { style: "currency", currency: "USD" })}</h1>
                        </div>
                     </div>

                     <button className='px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 mt-2 theme-button-effect'>Claim Commission</button>
                  </div>
               </div>
            </div>
         </aside>

         <div>
            <div>
               <Image src={gem} alt='gem' className='object-cover mx-auto w-[171px] transform -translate-y-11' />
            </div>
            <p className='text-center mb-2.5'>Earnings: <span className='px-[15px] py-1 rounded-[20px] bg-[#4DB6AC]'>Running</span></p>
            <p className='text-center mb-[27px]'>Time Remaining: <span className='text-investor-gold font-bold'>
               {isSpinning
                  ? 'Spinning...'
                  : timeLeft.canSpin
                     ? 'Spin now'
                     : `Next Spin in ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`
               }
            </span></p>

            {/* packages bought could be arrayed and displayed here */}
            <div className={`bg-[url('/rectangle2.png')] bg-cover bg-no-repeat flex px-5 py-2 mx-5`}>
               <div>
                  <Image src={f1} className='w-full object-cover' alt='details' />
               </div>
               <div>
                  <h1 className="font-bold text-white font-inria-sans text-2xl">Iron Seed</h1>
                  <h2 className="text-sm bg-[#50535B] inline-block rounded-sm p-1">
                     <span className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent">Entry-level packages</span>
                  </h2>
               </div>
            </div>

            <div className='py-5 px-10 flex items-center gap-10 lg:gap-2.5 lg:w-[392px] mx-auto'>
               <Link href='/' className={`flex-1 text-center py-2 rounded-lg text-lg transition-all duration-300 theme-button-effect-no-shadow capitalize text-black bg-investor-gold`}>Deposit</Link>
               <Link href='/' className={`flex-1 text-center py-2 rounded-lg text-lg transition-all duration-300 theme-button-effect-no-shadow capitalize text-black bg-investor-gold`}>Withdraw</Link>
            </div>
         </div>
      </div>
   )
}

export default Earnings