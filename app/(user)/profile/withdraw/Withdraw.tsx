'use client';

import UI_header from "@/components/UI_header";
import { withdrawRemark } from "@/constant/Remark.constant";
import { Icon } from "@iconify-icon/react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

interface formStateType {
  amount: string;
  password: string;
  [key: string]: string; // Add this line
}

const Withdraw = () => {
  const [formState, setFormState] = useState<formStateType>({
    amount: '',
    password: '',
  })
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

  const [form_inputs, setForm_inputs] = useState([
    { name: 'amount', label: 'Enter withdrawal Amount', type: 'number', placeholder: 'Enter withdrawal Amount', required: true },
    { name: 'password', label: 'Withdrawal Password', type: 'password', placeholder: '*******', required: true },
  ])

  const togglePasswordType = useCallback(() => {
    setForm_inputs(prev => prev.map(item => {
      if (item.name === 'password') {
        // Create a NEW object instead of mutating
        return {
          ...item,
          type: item.type === 'password' ? 'text' : 'password'
        }
      }
      return item
    }))
  }, []) // Remove form_inputs from dependency array
  return (
    <div>
      <UI_header title="Withdraw" description="Enjoy the hard work" />

      <div className='flex flex-col'>

        <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4 mb-5">
          <p className="">Available Balance: <span className="text-[#4DB6AC]">50$</span></p>
        </div>

        <div className='px-4 flex flex-col gap-4'>
          {
            form_inputs.map(details => (
              <div className='flex flex-col gap-2' key={details.name}>
                <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                <div className={`relative ${details.name === 'amount' ? "before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl before:text-[#F5F5F7] before:focus:text-[#62686E]" : ''}`}>
                  <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className={`outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7] w-full ${details.name === 'password' ? 'pr-10' : 'pl-8'}`} placeholder={details.placeholder} />
                  {details.name === "password" && <button onClick={togglePasswordType} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"><Icon icon={details.type === "password" ? "mdi:eye" : "mdi:eye-off"} width={20} /></button>}
                </div>
              </div>
            ))
          }
        </div>

        <div>
          <h1 className="px-4 text-2xl text-[#F5F5F7] pb-3 pt-7">Remark</h1>

          <ol className="list-decimal list-outside mx-7 mb-5 pl-6 space-y-2 text-[#9EA4AA]">
            {
              withdrawRemark.map((remark, index) => (
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

export default Withdraw