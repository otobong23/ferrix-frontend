'use client';
import { Icon } from '@iconify-icon/react'
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gem from '@/assets/imgs/gem.png';
import Link from 'next/link';
import f1 from '@/assets/imgs/f1.png';
import { showToast } from '@/utils/alert';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/User.context';
import { updateProfileAPI } from '@/services/Profile';
import { getTransactionsAPI, mineAPI } from '@/services/Transaction';

const DURATION = 24 * 60 * 60 * 1000 //24 hours
// const DURATION = 1 * 1 * 60 * 1000 //1 minutes

const formatTime = (ms: number | null) => {
   if (ms === null) return '--:--:--';
   const totalSeconds = Math.floor(ms / 1000);
   const h = Math.floor(totalSeconds / 3600);
   const m = Math.floor((totalSeconds % 3600) / 60);
   const s = totalSeconds % 60;
   return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};


const Earnings = () => {
   const router = useRouter();
   const { userData, setUserData } = useUser()
   const [userID, setUserID] = useState<String>("UserID24");
   const [balance, setBalance] = useState<Number>(0)
   const [miningAsset, setMiningAsset] = useState<Number>(0)
   const [totalWithdrawn, setTotalWithdrawn] = useState<Number>(0)
   const [commission, setComission] = useState<Number>(0)
   const [crew, setCrew] = useState<Number>(2)
   const [miningActivated, setMiningActivated] = useState(false);
   const [timeLeft, setTimeLeft] = useState<number | null>(null);
   const [wasActive, setWasActive] = useState(false)

   // Add refs to prevent double execution
   const isProcessingClaim = useRef(false);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const hasInitialized = useRef(false);

   const updateTimer = async (params: string) => {
      try {
         const response = await updateProfileAPI({ twentyFourHourTimerStart: params })
         setUserData(response)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      }
   }

   const [active, setActive] = useState(false)

   const startTimer = useCallback(() => {
      const now = Date.now();
      updateTimer(now.toString()).then(() => {
         setActive(true)
      }).catch(() => {
         setActive(false);
         setTimeLeft(null);
      });
   }, []);

   // useEffect(() => {
   //    const fetchUser = async () => {
   //       try {
   //          const response = await authFetch.get<UserType>('/profile/'); // Make sure this returns the full user
   //          setUserData(response.data);
   //       } catch (err) {
   //          console.error('Failed to fetch user on mount:', err);
   //       }
   //    };

   //    fetchUser();
   // }, []);

   // Fixed timer logic with proper cleanup
   useEffect(() => {
      if (!userData || !userData.twentyFourHourTimerStart) return;
      const startTime = userData.twentyFourHourTimerStart;

      // Clear any existing interval
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }

      if (!startTime) {
         setActive(false);
         setTimeLeft(null);
         setWasActive(false);
         return;
      }

      const startTimeNum = parseInt(startTime);
      if (isNaN(startTimeNum)) {
         setActive(false);
         setTimeLeft(null);
         setWasActive(false);
         return;
      }

      setActive(true);

      const updateTimerState = () => {
         const now = Date.now();
         const endTime = startTimeNum + DURATION;
         const diff = endTime - now;

         if (diff <= 0) {
            setTimeLeft(0);
            setActive(false);

            // Only set wasActive if we haven't already processed this completion
            if (!isProcessingClaim.current) {
               setWasActive(true);
            }

            if (intervalRef.current) {
               clearInterval(intervalRef.current);
               intervalRef.current = null;
            }
         } else {
            setTimeLeft(diff);
            setWasActive(false);
         }
      };

      // Initial update
      updateTimerState();

      // Set up interval
      intervalRef.current = setInterval(updateTimerState, 1000);

      // Mark as initialized after first render
      if (!hasInitialized.current) {
         hasInitialized.current = true;
      }

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      };
   }, [userData]); // Only depend on the timer value

   function roundUpTo3Decimals(num: number) {
      return Math.ceil(num * 1000) / 1000;
   }

   const handleTotalInvested = (param: UserPlan_Type[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.price);
      return total + price;
   }, 0)

   const handleDailyYield = (param: UserPlan_Type[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.daily_rate);
      return total + price;
   }, 0);

   const handleROI = (param: UserPlan_Type[] = []) => param.reduce((total, plan) => {
      const price = Number(plan.total_revenue);
      return total + price;
   }, 0);

   const handleMine = () => {
      if (userData?.ActivateBot) {
         if (!userData.currentPlan.length) {
            showToast('info', 'you do not have an active plan')
            return
         }
         if (timeLeft !== null && timeLeft > 0) return;

         startTimer()
      } else {
         showToast('warning', 'Your account has been suspended. Please Vist Customer Care')
      }
   }

   useEffect(() => {
      if(userData){
         setUserID(userData.userID)
         setBalance(userData.balance)
         setTotalWithdrawn(userData.totalWithdraw)
         setMiningAsset(handleTotalInvested(userData.currentPlan))
         setCrew(userData.referral_count ?? 0)
      }
   }, [userData])

   const handleUseBalance = async () => {
      if (isProcessingClaim.current) {
         return; // Prevent double execution
      }

      isProcessingClaim.current = true;

      try {
         await mineAPI({ amount: handleDailyYield(userData?.currentPlan) });
         showToast('success', 'Daily Yields Claimed successfully')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      } finally {
         isProcessingClaim.current = false;
      }
   };

   // Set mining activated state
   useEffect(() => {
      setMiningActivated(active)
   }, [active])

   // Handle completion with proper cleanup
   useEffect(() => {
      if (wasActive && !isProcessingClaim.current) {
         const delay = setTimeout(() => {
            handleUseBalance().then(() => {
               updateTimer('').then(() => {
                  setWasActive(false);
                  setActive(false);
               });
            });
         }, 500); // wait 500ms before executing

         return () => clearTimeout(delay); // cleanup
      }
   }, [wasActive])


   const [transaction, setTransaction] = useState<UserTransaction[]>()
   const getTransaction = async (page: number = 1) => {
      try {
         const response = await getTransactionsAPI({ limit: 10, page });
         setTransaction(response.transactions)
      } catch (err) {
         if (err instanceof AxiosError) {
            console.log(err)
            showToast('error', err.response?.data.message)
         } else {
            console.error(err)
            showToast('error', 'An error occurred during signup')
         }
      }
   }
   useEffect(() => {
      getTransaction()
   }, [])


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
                           <h1 className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent text-base lg:text-lg font-poppins font-bold">{totalWithdrawn.toLocaleString('en-US', { style: "currency", currency: "USD" })}</h1>
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

            <p className='flex justify-center items-center gap-1 text-lg font-semibold my-3'>
               <span>{miningActivated ? <Icon icon='ri:hourglass-fill' className='text-investor-gold' /> : <Icon icon='gravity-ui:thunderbolt-fill' className='text-investor-gold' />}</span>
               <span>{miningActivated ? 'Time Remaining: ' + formatTime(timeLeft) : 'Daily Earnings'}</span>
            </p>

            <div className='flex flex-col'>
               <button onClick={handleMine} disabled={miningActivated} className={`py-6 mx-5 text-[#E8E3D3] bg-investor-gold theme-button-effect-no-shadow rounded-[20px] ${miningActivated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0000CC]'} transition-colors duration-300 font-semibold text-lg mb-10`}>
               Start Miner
            </button>
            </div>

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