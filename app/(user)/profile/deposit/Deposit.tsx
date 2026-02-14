'use client';

import QRCodeGenerator from "@/components/QRCodeGenerator";
import UI_header from "@/components/UI_header";
import { depositRemark } from "@/constant/Remark.constant";
import { createDepositTransactionAPI, createOrderAPI } from "@/services/Transaction";
import { showToast } from "@/utils/alert";
import { Icon } from "@iconify-icon/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
   ChangeEvent,
   Dispatch,
   Fragment,
   MouseEvent,
   SetStateAction,
   useCallback,
   useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import copy from 'copy-to-clipboard';

interface formStateType {
   amount: string;
   [key: string]: string;
}

const Deposit = () => {
   const router = useRouter();
   const [order, setOrder] = useState<UserOrderType | null>(null)
   const [address, setAddress] = useState('N/A');
   const [copied1, setCopied1] = useState(false);
   const [stack, setStack] = useState(1);

   const [formState, setFormState] = useState<formStateType>({
      amount: '',
   });

   const handleCopy = (value: string, edit: Dispatch<SetStateAction<boolean>>) => {
      copy(value);
      edit(true);
      showToast('success', "Copied Successfully")
      setTimeout(() => edit(false), 2000);
   };

   const handleFormState = useCallback((name: string, value: string) => {
      setFormState(prev => ({ ...prev, [name]: value }));
   }, []);

   /* =======================
      CREATE ORDER MUTATION
      ======================= */
   const createOrderMutation = useMutation({
      mutationFn: (amount: number) =>
         createOrderAPI({ amount }),

      onSuccess: (response) => {
         setOrder(response.order);
         setAddress(response.order.address);
         setStack(2);
      },

      onError: (err) => {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         showToast('error', message);
      },
   });

   /* =======================
      CREATE DEPOSIT MUTATION
      ======================= */
   const createDepositMutation = useMutation({
      mutationFn: () =>
         createDepositTransactionAPI({ orderID: order?._id || '' }),

      onSuccess: (res) => {
         showToast('success', res.message);
      },

      onError: (err) => {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         showToast('error', message);
      },
   });

   const handleSubmit = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
         e.preventDefault();

         if (stack === 1) {
            createOrderMutation.mutate(Number(formState.amount));
            return;
         }

         createDepositMutation.mutate();
         router.replace('profile/transactions')
      },
      [stack, formState.amount, createOrderMutation, createDepositMutation]
   );

   const form_inputs = [
      {
         name: 'amount',
         label: 'Deposit Amount',
         type: 'number',
         placeholder: 'Enter Deposit Amount',
         required: true,
      },
   ];

   const staticAmount = [10, 20, 50, 100, 200, 500];

   const handleStaticAmount = useCallback(
      (amount: number) => {
         handleFormState('amount', amount.toString());
      },
      [handleFormState]
   );

   const isLoading =
      createOrderMutation.isPending || createDepositMutation.isPending;

   return (
      <div>
         <UI_header title="Deposit" description="Money for Money" />

         <div className="flex flex-col">
            {stack === 1 && (
               <Fragment key={'stack' + stack}>
                  <div className="px-4 flex flex-col gap-4">
                     {form_inputs.map(details => (
                        <div className="flex flex-col gap-2" key={details.name}>
                           <label
                              htmlFor={details.name}
                              className="text-xl text-[#F5F5F7]"
                           >
                              {details.label}
                           </label>

                           <div className="relative before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl">
                              <input
                                 type={details.type}
                                 value={formState[details.name]}
                                 required={details.required}
                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFormState(details.name, e.target.value)
                                 }
                                 name={details.name}
                                 id={details.name}
                                 className="outline-0 border border-[#9EA4AA] pr-3.5 pl-8 py-3 rounded-xl text-xl text-[#F5F5F7] w-full"
                                 placeholder={details.placeholder}
                              />
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-wrap gap-3 px-4 pt-5 pb-[30px]">
                     {staticAmount.map(amount => (
                        <button
                           type="button"
                           onClick={() => handleStaticAmount(amount)}
                           key={'deposit_amount_' + amount}
                           className="px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 theme-button-effect"
                        >
                           {amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                           })}
                        </button>
                     ))}
                  </div>

                  <p className="px-2.5 py-3.5 rounded-sm bg-[#F5F5F7]/7 mx-4">
                     Amount should be equal to Price of Tiers Selected
                  </p>
               </Fragment>
            )}

            {stack === 2 && (
               <Fragment key={'stack' + stack}>
                  <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4">
                     <p className="text-center">
                        Deposit Amount:{' '}
                        <span className="text-[#4DB6AC]">
                           {Number(order?.displayAmount || 0).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 3,
                           })}
                        </span>
                     </p>
                     <p className="text-center flex justify-center items-center gap-1">
                        <Icon icon="si:alert-fill" width="24" height="24" />
                        <span>Please Send Exactly the Amount Shown Above</span>
                     </p>
                     <p className="text-center">
                        Network : <span className="text-[#4DB6AC]">USDT</span>
                     </p>
                  </div>

                  <div className="flex justify-center my-[26px]">
                     <div className="border-6 border-white rounded-lg overflow-hidden">
                        <QRCodeGenerator address={address} />
                     </div>
                  </div>

                  <div className="px-3 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4 flex items-center justify-between">
                     <p className="text-xl w-3/4 text-wrap">{address}</p>
                     <button onClick={() => handleCopy(address, setCopied1)}>
                        {
                           copied1 ? <Icon icon="iconamoon:check" width="24" height="24" /> :
                              <Icon icon="akar-icons:copy" className="text-4xl text-[#9EA4AA]" />
                        }
                     </button>
                  </div>
               </Fragment>
            )}

            <div>
               <h1 className="px-4 text-2xl text-[#F5F5F7] pb-3 pt-7">Remark</h1>

               <ol className="list-decimal list-outside mx-7 mb-5 pl-6 space-y-3 text-[#9EA4AA]">
                  {depositRemark.map((remark, index) => (
                     <li className="pl-2" key={'remark_' + index}>
                        {remark}
                     </li>
                  ))}
               </ol>
            </div>

            <button
               disabled={isLoading}
               className="flex items-center justify-center mx-4 my-6 py-3 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
               onClick={handleSubmit}
            >
               {isLoading ? 'Processing...' : 'Confirm'}
            </button>
         </div>
      </div>
   );
};

export default Deposit;
