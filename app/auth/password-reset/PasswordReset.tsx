"use client";
import { useResetPassword } from '@/context/ResetPassword.context';
import { requestCodeAPI, sendCodeAPI } from '@/services/Authentication';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify-icon/react'
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const a = 'w-[48px] md:w-[69px] h-[60px] md:h-[85px] bg-none text-[var(--color2)] text-center text-lg lg:text-xl rounded-[15px] lg:rounded-[17px]'

const counter = 1 * 60 // 3 minutes countdown

interface formStateType {
  email: string;
  [key: string]: string; // Add this line
}

const PasswordReset = () => {
  const router = useRouter()
  const [stack, setStack] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [VCode, setVCode] = useState<number[]>(new Array(6).fill(""));
  const [error, setError] = useState<{ active: boolean, message: string }>({ active: false, message: '' })
  const [active, setActive] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const { passwordResetSetToken } = useResetPassword()

  const [formState, setFormState] = useState<formStateType>({
    email: ''
  })
  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleChange = (e: any, i: any) => {
    const newError: typeof error = { active: false, message: '' }
    setError(newError)
    if (isNaN(e.target.value)) return false;
    setVCode([
      ...VCode.map((data, indx) => (indx === i ? e.target.value : data)),
    ]);
    if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
    if (!e.target.value && e.target.previousSibling)
      e.target.previousSibling.focus();
  };
  // Handle pasting OTP
  const handlePaste = (e: any) => {
    const pasteData = e.clipboardData.getData('text');
    const pasteValues = pasteData.split('').slice(0, 6);  // Limiting to 6 digits
    if (pasteValues.length === 6 && pasteValues.every((char: any) => !isNaN(char))) {
      setVCode(pasteValues);
    }
  };
  const handleKeyDown = (e: any) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      //  handleSubmit(e);
    }
  }

  useEffect(() => {
    if (VCode.filter(e => e).length === 6) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [VCode])

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleEmailRequest = async () => {
    const toastId = toast.loading('Processing...');
    setLoading(true)
    try {
      const res = await requestCodeAPI(formState)
      toast.success(res.message, { id: toastId })
      setStack(prev => prev + 1)
    } catch (err) {
      console.error('Request Code error:', err);
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Unexpected API error'
          : 'An unexpected error occurred';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setSeconds(counter);
    setVCode(new Array(6).fill(""));
    handleEmailRequest()
  }

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEmailRequest()
  }

  const form_inputs = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Loisbecket@gmail.com', required: true },
  ]

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const code = VCode.join('')
    setLoading(true)
    try {
      const response = await sendCodeAPI({ email: formState.email, code })
      passwordResetSetToken(response)
      showToast('success', 'Code verified successfully!')
      router.replace('/auth/password-reset/new-password')
    } catch (err) {
      console.error('Verfying Code error:', err);
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Unexpected API error'
          : 'An unexpected error occurred';
      showToast('error', message);
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='mx-4 py-12'>
      <p className='pt-11 pb-24'>
        <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()}>
          <Icon icon="solar:arrow-left-outline" width={24} className='text-[#e1e5ef]' />
        </button>
      </p>
      <h1 className='text-[#F5F5F7] font-inria-sans font-bold text-5xl mb-4'>Password <br /> recovery</h1>

      {stack === 1 && (
        <div>
          <p className='text-[#6C7278] text-sm'>Enter Your Email Address</p>

          <form className="mt-7" onSubmit={e => handleEmailSubmit(e)}>
            {
              form_inputs.map(details => (
                <div className='flex flex-col gap-2' key={details.name}>
                  <label htmlFor={details.name} className='text-xl text-[#F5F5F7]'>{details.label}</label>
                  <input type={details.type} value={formState[details.name]} required={details.required} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormState(details.name, e.target.value)} name={details.name} id={details.name} className='outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl placeholder:text-[#62686E] text-xl text-[#F5F5F7]' placeholder={details.placeholder} />
                </div>
              ))
            }

            <button type='submit' className={`flex items-center justify-center my-6 py-4 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect w-full ${formState.email && !loading ? 'opacity-100' : 'opacity-50'}`} disabled={!formState.email && loading}>Continue</button>
          </form>
        </div>
      )}

      {stack == 2 && (
        <div>
          <p className='text-[#6C7278] text-sm'>Enter the 6 digit code we&apos;vve sent to your Email</p>


          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center gap-2 mt-10" onPaste={handlePaste}>
              {VCode.map((data, i) => (
                <input
                  title={`OTP_Code_${i}`}
                  key={"input_" + i}
                  type="text"
                  id="N1"
                  value={data}
                  maxLength={1}
                  className={`${a} border outline-0 ${i + 1 <= VCode.filter(e => e).length ? 'border-2' : 'border'}
                  ${error.active
                      ? 'border-[#D54244]'
                      : 'border-[#424545]'
                    }
                  `}
                  onInput={(e) => handleChange(e, i)}
                  onKeyDown={e => handleKeyDown(e)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
            {error.active && (
              <p className="text-sm mt-1 text-[#D54244]">{error.message}</p>
            )}

            <div className="flex justify-center mt-10">
              {seconds > 0 ? <p className='text-sm flex gap-0.5'>Resending in {seconds > 0 ? `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}` : '00:00'}
                <span className='w-5 h-5 border border-r-transparent rounded-full flex items-center justify-center animate-spin'>
                  <span className='w-3 h-3 block border border-l-transparent rounded-full animate-spin'></span>
                </span>
              </p> : <Link href="#" onClick={handleResend} className='underline'>Resend code</Link>}
            </div>

            <button type='submit' className={`flex items-center justify-center my-6 py-4 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect w-full ${active && !loading ? 'opacity-100' : 'opacity-50'}`} disabled={!active && loading}>Continue</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PasswordReset