'use client';
import UI_header from '@/components/UI_header'
import gem from '@/assets/imgs/gem.png'
import { useUser } from '@/context/User.context';
import { useCallback, useEffect, useState } from 'react';
import { getCheckInTransactionsAPI, spinWheelAPI } from '@/services/Transaction';
import { showToast } from '@/utils/alert';
import { AxiosError } from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { Icon } from '@iconify-icon/react';

const CheckIn = () => {
   const dayNumber = new Date().getDay()
   const { loading, userData, refreshUser } = useUser();
   const [isSpinning, setIsSpinning] = useState(false);
   const [transaction, setTransaction] = useState<UserTransaction[]>([])
   const [totalTransaction, setTotalTransaction] = useState(0)
   const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)

   const handleSpin = useCallback(async () => {
      // Start spinning animation
      setIsSpinning(true);

      try {
         if (loading) return;
         const response = await spinWheelAPI();

         // Wait for spin animation to complete (3-5 seconds)
         await new Promise(resolve => setTimeout(resolve, 4000));

         refreshUser()
         console.log(response.data)
         showToast('success', 'Reward Claimed Successfully')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      } finally {
         // Stop spinning animation
         setIsSpinning(false);
      }
   }, [loading])

   const fetchTransactions = async (page: number = 1) => {
      try {
         const res = await getCheckInTransactionsAPI({ limit: 10, page: page });
         setTransaction(res.transactions);
         setTotalTransaction(res.total)
         setCurrentTransactionPage(res.page)
         setTotalPages(res.totalPages)
      } catch (err) {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         showToast('error', message);
      }
   }

   useEffect(() => {
      fetchTransactions();
   }, []);

   const next = () => {
      const offset = totalPages - currentTransactionPage
      if (offset <= 0) return
      try {
         const page = currentTransactionPage + 1
         fetchTransactions(page)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }
   }

   const previous = () => {
      const offset = totalPages - currentTransactionPage
      if (offset > 0) return
      try {
         const page = currentTransactionPage ? currentTransactionPage - 1 : 1
         fetchTransactions(page)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }
   }

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
      if (userData && userData.spinWheelTimerStart) {
         return calculateTimeRemaining(userData.spinWheelTimerStart);
      }
      return { hours: 0, minutes: 0, seconds: 0, canSpin: true };
   })

   useEffect(() => {
      if (!userData || !userData.spinWheelTimerStart) return;

      const timer = setInterval(() => {
         const newTimeLeft = calculateTimeRemaining(userData.spinWheelTimerStart);
         setTimeLeft(newTimeLeft);

         if (newTimeLeft.canSpin) {
            clearInterval(timer);
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [userData?.spinWheelTimerStart])

   return (
      <div>
         <UI_header title='Daily' description='Check-in Reward system' image={gem} containerStyle='items-center' />

         <div className='py-5 rounded-lg bg-[#4DB6AC] mx-4'>
            <h1 className='text-center text-[#1D1D1F] mb-2'>Everyday of the week</h1>
            <div className='flex justify-center items-center gap-3.5'>
               {Array.from({ length: 7 }, (_, i) => i).map(i => (
                  <div key={'_' + i} className={`w-10 h-10 rounded-full text-[#1D1D1F] flex items-center justify-center ${dayNumber === i ? 'bg-white' : 'bg-white/30'}`}>{i + 1}</div>
               ))}
            </div>
         </div>

         <div className="flex justify-between mt-4" hidden={totalPages == 1}>
            <button onClick={previous} className={`flex items-center ${currentTransactionPage == 1 ? 'invisible' : 'visible'}`}><Icon icon='fluent:chevron-left-24-filled' className="text-2xl" /><span className='leading-tight'>prev</span></button>
            <button onClick={next} className={`flex items-center ${currentTransactionPage == totalPages ? ' invisible' : 'visible'}`}><span className='leading-tight'>next</span><Icon icon='fluent:chevron-right-24-filled' className="text-2xl" /></button>
         </div>

         <div className='px-4 flex flex-col gap-3 mt-4'>
            {transaction.length ? transaction.map((item, index) => (
               <div key={item.type + index} className='flex flex-col py-2.5 px-5 bg-[#F5F5F7]/7 text-[#C3C3C3] gap-3 rounded-lg'>
                  <div className='flex justify-between'>
                     <h1 className='text-sm font-semibold mb-1 capitalize'>
                        {item.type === 'tier' ? 'rebate' : item.type} {item.status === 'pending' ? 'pending' : item.status === 'completed' ? 'successful' : 'failed'}
                     </h1>
                  </div>

                  <div className='flex flex-col'>
                     <p className='text-[#9EA4AA]'>Main Amount: ${item.amount.toLocaleString()}</p>
                     {item.displayAmount && <p className='text-[#9EA4AA]'>Amount Recieved: ${item.displayAmount.toLocaleString()}</p>}
                  </div>

                  <div className='flex justify-between text-xs font-normal text-[#9EA4AA]'>
                     <p>{formatInTimeZone(item.date ?? Date.now(), 'Africa/Lagos', 'HH:mm')}</p>
                     <p>{formatInTimeZone(item.date ?? Date.now(), 'Africa/Lagos', 'dd/MM/yy')}</p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
         </div>

         <div className='px-4 flex flex-col my-4'>
            <button
               className='flex items-center justify-center py-3 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50 disabled:cursor-not-allowed'
               disabled={!timeLeft.canSpin || isSpinning}
               onClick={handleSpin}
            >
               {isSpinning
                  ? 'Spinning...'
                  : timeLeft.canSpin
                     ? 'Spin now'
                     : `Next Spin in ${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`
               }
            </button>
         </div>
      </div>
   )
}

export default CheckIn