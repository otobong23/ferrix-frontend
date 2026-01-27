'use client';

import QRCodeGenerator from "@/components/QRCodeGenerator";
import UI_header from "@/components/UI_header";
import { depositRemark } from "@/constant/Remark.constant";
import { Icon } from "@iconify-icon/react";
import { ChangeEvent, FormEvent, Fragment, useCallback, useState } from "react";

interface formStateType {
   amount: string;
   [key: string]: string; // Add this line
}

const address = "12345sgfdwfrefewfdfidifire"

const Deposit = () => {
   const [formState, setFormState] = useState<formStateType>({
      amount: '',
   })
   const [stack, setStack] = useState(3)

   const handleFormState = useCallback((name: string, value: string) => {
      setFormState(prev => ({ ...prev, [name]: value }))
   }, [])

   const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Object.entries(formState).forEach(([key, value]) => {
      //   if(!value) alert(key)
      // })
      console.log('Form submitted:', formState)
      // Add your form submission logic here
   }, [formState])

   const form_inputs = [
      { name: 'amount', label: 'Deposit Amount', type: 'number', placeholder: 'Enter Deposit Amount', required: true },
   ]
   const staticAmount = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

   const handleStaticAmount = useCallback((amount: number) => {
      handleFormState('amount', amount.toString())
   }, [handleFormState])
   return (
      <div>
         <UI_header title="Deposit" description="Money for Money" />

         <div className='flex flex-col'>

            {stack === 1 &&
               <Fragment key={'stack' + stack}>
                  <div className='px-4 flex flex-col gap-4'>
                     {
                        form_inputs.map(details => (
                           <div className='flex flex-col gap-2' key={details.name}>
                              <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                              <div className="relative before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl before:text-[#F5F5F7] before:focus:text-[#62686E]">
                                 <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] pr-3.5 pl-8 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full' placeholder={details.placeholder} />
                              </div>
                           </div>
                        ))
                     }
                  </div>

                  <div className="flex flex-wrap gap-3 px-4 pt-5 pb-[30px]">
                     {
                        staticAmount.map(amount => (
                           <button type="button" onClick={() => handleStaticAmount(amount)} key={'deposit_amount_' + amount} className="px-2.5 py-[5px] rounded-sm bg-[#F5F5F7]/7 mt-auto theme-button-effect">{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</button>
                        ))
                     }
                  </div>

                  <p className="px-2.5 py-3.5 rounded-sm bg-[#F5F5F7]/7 mx-4">Amount should be equal to Price of Tiers Selected</p>
               </Fragment>
            }

            {stack === 2 &&
               <Fragment key={'stack' + stack}>
                  <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4">
                     <p className="text-center">Deposit Amount: <span className="text-[#4DB6AC]">50$</span></p>
                     <p className="text-center">Network : <span className="text-[#4DB6AC]">USDT</span></p>
                  </div>

                  <div className="flex justify-center my-[26px]">
                     <div className="border-6 border-white rounded-lg overflow-hidden"><QRCodeGenerator address={address} /></div>
                  </div>

                  <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4 flex justify-between">
                     <p className="text-lg">{address}</p>
                     <button><Icon icon="akar-icons:copy" className="text-3xl text-[#9EA4AA]" /></button>
                  </div>
               </Fragment>
            }

            {stack === 3 &&
               <Fragment key={'stack' + stack}>
                  <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4">
                     <p><span className="font-bold">Upload</span> receipt to confirm payment</p>
                  </div>

                  <div className="bg-[#44474F] py-[50px] flex justify-center mx-4 my-8 rounded-lg">
                     <label htmlFor="reciept" className="bg-[#D9D9D9] w-[100px] h-[100px] rounded-full flex justify-center items-center">
                        <Icon icon="humbleicons:download" className="text-[#1D1D1F]" width={46} />
                     </label>
                     <div className='hidden'>
                     <input type="file" name="reciept" id="reciept" accept="image/*,application/pdf" />
                  </div>
                  </div>
               </Fragment>
            }


            <div>
               <h1 className="px-4 text-2xl text-[#F5F5F7] pb-3 pt-7">Remark</h1>

               <ol className="list-decimal list-outside mx-7 mb-5 pl-6 space-y-3 text-[#9EA4AA]">
                  {
                     depositRemark.map((remark, index) => (
                        <li className="pl-2" key={'remark_' + index}>{remark}</li>
                     ))
                  }
               </ol>
            </div>

            <button className='flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect'>Confirm</button>
         </div>
      </div>
   )
}

export default Deposit