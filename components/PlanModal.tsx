import { useUser } from '@/context/User.context'
import { updatePlanAPI } from '@/services/Profile'
import { getPlanAPI } from '@/services/Transaction'
import { showToast } from '@/utils/alert'
import { AxiosError } from 'axios'
import Image from 'next/image'
import c2 from '@/assets/imgs/c2.png'
import { Dispatch, SetStateAction, useState } from 'react'

const PlanModal = ({ purchaseDetails, confirmModal, setConfirmModal }: { purchaseDetails: Product_Type, confirmModal: boolean, setConfirmModal: Dispatch<SetStateAction<boolean>> }) => {
   const [processingModal, setProcessingModal] = useState(false)
   const [seconds, setSeconds] = useState(0); // countdown
   const { userData, setUserData } = useUser()


   const handleModalButton = async (action: 'proceed' | 'cancel') => {
      if (action === 'cancel') {
         return setConfirmModal(false);
      }

      if (action === 'proceed') {
         setConfirmModal(false);

         try {
            if (userData?.ActivateBot) {
               await validateUserBalance();
               await beginProcessing();

               await startCountdown(10); // 30 seconds for demo

               await finalizePurchase();
            } else {
               showToast('warning', 'Your account has been suspended. Please Vist Customer Care')
            }
         } catch (error: any) {
            showToast('error', error.message || 'Something went wrong.');
            setProcessingModal(false);
         }
      }
   };

   const validateUserBalance = (): Promise<void> => {
      return new Promise((resolve, reject) => {
         if (!userData?.balance || userData?.balance < (Number(purchaseDetails?.price) || 0)) {
            reject(new Error('Insufficient deposit balance. Please fund your account.'));
         } else {
            resolve();
         }
      });
   };

   const beginProcessing = (): Promise<void> => {
      return new Promise((resolve) => {
         setProcessingModal(true);
         resolve();
      });
   };

   const startCountdown = (duration: number): Promise<void> => {
      return new Promise((resolve) => {
         setSeconds(duration);
         const countdown = setInterval(() => {
            setSeconds((prev) => {
               if (prev <= 1) {
                  clearInterval(countdown);
                  resolve();
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      });
   };


   const finalizePurchase = (): Promise<void> => {
      return new Promise(async (resolve) => {
         try {
            const useBalance = await getPlanAPI({ amount: Number(purchaseDetails?.price), plan: purchaseDetails?.name || '' })
            console.log(useBalance)
            if (!purchaseDetails) throw new Error("Purchase details missing");

            const expiringDate = new Date();
            expiringDate.setDate(
               expiringDate.getDate() + purchaseDetails.contract_duration_in_days
            );

            const response = await updatePlanAPI(
               purchaseDetails,
               expiringDate,
            );
            setUserData(response)
            showToast('success', 'Your pack has been successfully activated. Daily yields will now begin.');
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
         setProcessingModal(false);
         resolve();
      });
   };


   return (
      <>
         <div className={`fixed top-0 left-0 min-w-screen h-screen bg-black/70 z-99 items-center justify-center ${confirmModal ? 'flex' : 'hidden'}`}>
            <div className={`py-[63px] px-[50px] w-full md:max-w-[400px] flex flex-col justify-center bg-no-repeat bg-top md:bg-cover bg-[url('/modal_image.png')]`}>
               <div className="card_image">
                  <Image src={purchaseDetails?.image ?? c2} alt="f1_image" className="object-cover w-32" />
               </div>

               <div className="flex flex-col gap-2.5 items-start">
                  <h1 className="font-bold text-white font-inria-sans text-5xl">{purchaseDetails?.name}</h1>
                  <h2 className="text-base bg-[#50535B] inline-block rounded-sm p-1">
                     <span className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent">{purchaseDetails?.package_level}</span>
                  </h2>
                  <p className="text-base font-bold text-[#F5F5F7]">{purchaseDetails?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                  <p className="text-base text-[#F5F5F7]">
                     <span>Contract Duration:</span>
                     <span className="font-bold ml-1">{purchaseDetails?.contract_duration_in_days}Days</span>
                  </p>
                  <p className="text-base text-[#F5F5F7]">
                     <span>Daily Rate:</span>
                     <span className="font-bold ml-1">{purchaseDetails?.daily_rate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                  </p>
                  <p className="text-base text-[#F5F5F7]">
                     <span>Total Revenue:</span>
                     <span className="font-bold ml-1">{purchaseDetails?.total_revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                  </p>
                  <div className='flex gap-2.5'>
                     {(['proceed', 'cancel'] as ('proceed' | 'cancel')[]).map(item => (
                        <button onClick={() => handleModalButton(item)} className="px-[15px] py-[5px] text-[#1D1D1F] text-base rounded-sm bg-linear-to-br outline-0 from-[#4DB6AC] to-investor-gold theme-button-effect">
                           {item}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-99 items-center justify-center ${processingModal ? 'flex' : 'hidden'}`}>
            <div className='w-full md:max-w-[400px] py-[75px] text-(--color2) text-sm rounded-4xl border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col item-center px-[50px]'>
               <h1 className='text-center text-[40px] font-bold'>Processing</h1>
               <p className='text-center flex flex-col items-center'>
                  <span>Purchase processing & will be uploaded in</span>
                  <span className='flex'>
                     {seconds > 0 ? `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}` : '00:00'}
                     <span className='w-5 h-5 border border-r-transparent border-amber-100 rounded-full flex items-center justify-center animate-spin'>
                        <span className='w-3 h-3 block border border-l-transparent border-amber-100 rounded-full animate-spin'></span>
                     </span>
                  </span>
               </p>

            </div>
         </div>
      </>
   )
}

export default PlanModal