'use client';

import { useUser } from '@/context/User.context';
import { updatePlanAPI } from '@/services/Profile';
import { getPlanAPI } from '@/services/Transaction';
import { AxiosError } from 'axios';
import Image from 'next/image';
import c2 from '@/assets/imgs/c2.png';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const PlanModal = ({
  purchaseDetails,
  confirmModal,
  setConfirmModal,
}: {
  purchaseDetails: Product_Type;
  confirmModal: boolean;
  setConfirmModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { userData, refreshUser } = useUser();

  const [processingModal, setProcessingModal] = useState(false);
  const [seconds, setSeconds] = useState(0);

  /* ============================
     COUNTDOWN EFFECT
  ============================ */
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  /* ============================
     PURCHASE MUTATION
  ============================ */
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!purchaseDetails) throw new Error('Purchase details missing');

      // Step 1: Deduct balance / register purchase
      await getPlanAPI({
        amount: Number(purchaseDetails.price),
        plan: purchaseDetails.name,
      });

      // Step 2: Calculate expiration
      const expiringDate = new Date();
      expiringDate.setDate(
        expiringDate.getDate() +
          purchaseDetails.contract_duration_in_days
      );

      const expiring_At = expiringDate.toISOString();

      // Step 3: Activate plan
      return await updatePlanAPI(purchaseDetails, expiring_At);
    },

    onMutate: () => {
      toast.loading('Processing purchase...', { id: 'plan-purchase' });
      setProcessingModal(true);
      setSeconds(10); // demo countdown
    },

    onSuccess: (data) => {
      refreshUser();

      toast.success(
        'Your pack has been successfully activated. Daily yields will now begin.',
        { id: 'plan-purchase' }
      );
    },

    onError: (err: AxiosError<any> | Error) => {
      toast.error(
        err instanceof AxiosError
          ? err.response?.data?.message || 'Purchase failed'
          : err.message,
        { id: 'plan-purchase' }
      );
    },

    onSettled: () => {
      setProcessingModal(false);
      setSeconds(0);
    },
  });

  /* ============================
     HANDLE BUTTON
  ============================ */
  const handleModalButton = (action: 'proceed' | 'cancel') => {
    if (action === 'cancel') {
      setConfirmModal(false);
      return;
    }

    if (!userData?.ActivateBot) {
      toast.error(
        'Your account has been suspended. Please visit Customer Care.'
      );
      return;
    }

    if (
      !userData?.balance ||
      userData.balance < Number(purchaseDetails?.price)
    ) {
      toast.error(
        'Insufficient deposit balance. Please fund your account.'
      );
      return;
    }

    setConfirmModal(false);
    purchaseMutation.mutate();
  };

  return (
    <>
      {/* ================= CONFIRM MODAL ================= */}
      <div
        className={`fixed top-0 left-0 min-w-screen h-screen bg-black/70 z-50 items-center justify-center ${
          confirmModal ? 'flex' : 'hidden'
        }`}
      >
        <div className="py-[63px] px-[50px] w-full md:max-w-[400px] flex flex-col justify-center bg-no-repeat bg-top md:bg-cover bg-[url('/modal_image.png')]">
          <div>
            <Image
              src={purchaseDetails?.image ?? c2}
              alt="plan_image"
              className="object-cover w-32"
            />
          </div>

          <div className="flex flex-col gap-2.5 items-start">
            <h1 className="font-bold text-white text-5xl">
              {purchaseDetails?.name}
            </h1>

            <h2 className="text-base bg-[#50535B] rounded-sm p-1">
              <span className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent">
                {purchaseDetails?.package_level}
              </span>
            </h2>

            <p className="font-bold text-white">
              {purchaseDetails?.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </p>

            <p className="text-white">
              Contract Duration:{' '}
              <span className="font-bold">
                {purchaseDetails?.contract_duration_in_days} Days
              </span>
            </p>

            <p className="text-white">
              Daily Rate:{' '}
              <span className="font-bold">
                {purchaseDetails?.daily_rate.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            </p>

            <p className="text-white">
              Total Revenue:{' '}
              <span className="font-bold">
                {purchaseDetails?.total_revenue.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => handleModalButton('proceed')}
                disabled={purchaseMutation.isPending}
                className="px-[15px] py-[5px] rounded-sm bg-linear-to-br from-[#4DB6AC] to-investor-gold text-black disabled:opacity-50"
              >
                Proceed
              </button>

              <button
                onClick={() => handleModalButton('cancel')}
                className="px-[15px] py-[5px] rounded-sm bg-gray-400 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PROCESSING MODAL ================= */}
      <div
        className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-50 items-center justify-center ${
          processingModal ? 'flex' : 'hidden'
        }`}
      >
        <div className="w-full md:max-w-[400px] py-[75px] rounded-4xl border bg-white/5 backdrop-blur-sm flex flex-col px-[50px]">
          <h1 className="text-center text-[40px] font-bold">
            Processing
          </h1>

          <p className="text-center flex flex-col items-center">
            <span>Purchase processing & will be uploaded in</span>

            <span className="flex items-center gap-2">
              {seconds > 0
                ? `00:${
                    seconds < 10 ? '0' + seconds : seconds
                  }`
                : '00:00'}

              <span className="w-5 h-5 border border-r-transparent rounded-full animate-spin" />
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PlanModal;
