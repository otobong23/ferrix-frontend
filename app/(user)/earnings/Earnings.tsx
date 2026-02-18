'use client';
import { Icon } from '@iconify-icon/react'
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gem from '@/assets/imgs/gem.png';
import Link from 'next/link';
import { showToast } from '@/utils/alert';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/User.context';
import { updateProfileAPI } from '@/services/Profile';
import { getTransactionsAPI, mineAPI } from '@/services/Transaction';

const DURATION = 24 * 60 * 60 * 1000;

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
   const { userData, setUserData, loading } = useUser();

   const [userID, setUserID] = useState<string>('UserID24');
   const [balance, setBalance] = useState<number>(0);
   const [miningAsset, setMiningAsset] = useState<number>(0);
   const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
   const [commission, setComission] = useState<number>(0);
   const [crew, setCrew] = useState<number>(0);

   const [active, setActive] = useState(false);
   const [timeLeft, setTimeLeft] = useState<number | null>(null);
   const [wasActive, setWasActive] = useState(false);

   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const isProcessingClaim = useRef(false);
   const processedTimerRef = useRef<string | null>(null);

   const updateTimer = async (params: string) => {
      try {
         const response = await updateProfileAPI({ twentyFourHourTimerStart: params });
         setUserData(response);
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message);
         } else {
            showToast('error', 'An error occurred');
         }
      }
   };

   const startTimer = useCallback(async () => {
      if (active) return;

      const now = Date.now().toString();
      setActive(true);
      processedTimerRef.current = null;

      try {
         await updateTimer(now);
      } catch {
         setActive(false);
      }
   }, [active]);

   function handleTotalInvested(param: UserPlan_Type[] = []) {
      return param.reduce((total, plan) => total + Number(plan.price), 0);
   }

   function handleDailyYield(param: UserPlan_Type[] = []) {
      return param.reduce((total, plan) => total + Number(plan.daily_rate), 0);
   }

   // Sync UI values
   useEffect(() => {
      if (!userData) return;
      setUserID(userData.userID);
      setBalance(userData.balance);
      setTotalWithdrawn(userData.totalWithdraw);
      setMiningAsset(handleTotalInvested(userData.currentPlan));
      setCrew(userData.referral_count ?? 0);
   }, [userData]);

   // TIMER LOGIC (SAFE)
   useEffect(() => {
      if (loading) return;

      const startTime = userData?.twentyFourHourTimerStart;
      if (!startTime) {
         setActive(false);
         setTimeLeft(null);
         setWasActive(false);
         return;
      }

      const startTimeNum = parseInt(startTime);
      if (isNaN(startTimeNum)) return;

      if (intervalRef.current) {
         clearInterval(intervalRef.current);
      }

      setActive(true);

      const updateTimerState = () => {
         const now = Date.now();
         const endTime = startTimeNum + DURATION;
         const diff = endTime - now;

         if (diff <= 0) {
            setTimeLeft(0);
            setActive(false);

            // prevent duplicate trigger for same timer
            if (processedTimerRef.current !== startTime) {
               processedTimerRef.current = startTime;
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

      updateTimerState();
      intervalRef.current = setInterval(updateTimerState, 1000);

      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, [loading, userData?.twentyFourHourTimerStart]);

   
   const handleMine = () => {
      if (!userData?.ActivateBot) {
         showToast('warning', 'Your account has been suspended. Please Visit Customer Care');
         return;
      }

      if (!userData.currentPlan.length) {
         showToast('info', 'you do not have an active plan');
         return;
      }

      if (timeLeft !== null && timeLeft > 0) return;

      startTimer();
   };

   const handleUseBalance = async () => {
      if (isProcessingClaim.current) return;
      isProcessingClaim.current = true;

      try {
         await mineAPI({ amount: handleDailyYield(userData?.currentPlan) });
         showToast('success', 'Daily Yields Claimed successfully');
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message);
         } else {
            showToast('error', 'An error occurred');
         }
      } finally {
         isProcessingClaim.current = false;
      }
   };

   // CLAIM EXECUTION (ONCE PER TIMER)
   useEffect(() => {
      if (!wasActive) return;
      if (isProcessingClaim.current) return;

      isProcessingClaim.current = true;

      const run = async () => {
         try {
            await handleUseBalance();
            await updateTimer('');
            processedTimerRef.current = null;
            setWasActive(false);
            setActive(false);
         } finally {
            isProcessingClaim.current = false;
         }
      };

      run();
   }, [wasActive]);

   const [transaction, setTransaction] = useState<UserTransaction[]>();

   const getTransaction = async (page: number = 1) => {
      try {
         const response = await getTransactionsAPI({ limit: 10, page });
         setTransaction(response.transactions);
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message);
         } else {
            showToast('error', 'An error occurred');
         }
      }
   };

   useEffect(() => {
      getTransaction();
   }, []);

   const miningActivated = active;

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
               <h1 className="font-inria-sans font-bold leading-tight text-4xl lg:text-6xl">
                  {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
               </h1>
            </div>
         </aside>

         <div>
            <Image src={gem} alt="gem" className="object-cover mx-auto w-[171px] transform -translate-y-11" />

            <p className="flex justify-center items-center gap-1 text-lg font-semibold my-3">
               <span>
                  {miningActivated
                     ? <Icon icon="ri:hourglass-fill" className="text-investor-gold" />
                     : <Icon icon="gravity-ui:thunderbolt-fill" className="text-investor-gold" />}
               </span>
               <span>{miningActivated ? 'Time Remaining: ' + formatTime(timeLeft) : 'Daily Earnings'}</span>
            </p>

            <button
               onClick={handleMine}
               disabled={miningActivated}
               className={`py-6 mx-5 text-[#E8E3D3] bg-investor-gold rounded-[20px] ${
                  miningActivated ? 'opacity-50 cursor-not-allowed' : ''
               }`}
            >
               Start Miner
            </button>

            <div className="py-5 px-10 flex items-center gap-10 lg:gap-2.5 lg:w-[392px] mx-auto">
               <Link href="/profile/deposit" className="flex-1 text-center py-2 rounded-lg text-lg bg-investor-gold text-black">
                  Deposit
               </Link>
               <Link href="/profile/withdraw" className="flex-1 text-center py-2 rounded-lg text-lg bg-investor-gold text-black">
                  Withdraw
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Earnings;
