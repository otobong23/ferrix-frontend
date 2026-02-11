'use client';

import UI_header from '@/components/UI_header';
import { withdrawRemark } from '@/constant/Remark.constant';
import { useUser } from '@/context/User.context';
import { withdrawAPI } from '@/services/Transaction';
import { Icon } from '@iconify-icon/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface formStateType {
  amount: string;
  password: string;
  [key: string]: string;
}

const Withdraw = () => {
  const router = useRouter();
  const { userData } = useUser();
  const [balance, setBalance] = useState(0)

  const [formState, setFormState] = useState<formStateType>({
    amount: '',
    password: '',
  });
  useEffect(() => {
    if (userData) {
      setBalance(userData.balance)
    }
  }, [userData])

  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  /* =======================
     WITHDRAW MUTATION
     ======================= */
  const withdrawMutation = useMutation({
    mutationFn: (payload: { amount: number; walletAddress: string }) =>
      withdrawAPI(payload),

    onMutate: () => {
      toast.loading('Submitting withdrawal request...', {
        id: 'withdraw',
      });
    },

    onSuccess: (res) => {
      toast.success(
        res?.message || 'Withdrawal request sent successfully',
        { id: 'withdraw' }
      );
      router.replace('/profile/transactions/');
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || 'Withdrawal failed',
        { id: 'withdraw' }
      );
    },
  });

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!userData) return;

      if (!userData.withdrawalWallet?.walletAddress) {
        toast.error(
          'Please set up your withdrawal wallet in profile to use this feature'
        );
        return;
      }

      if (formState.password !== userData.walletPassword) {
        toast.error('Incorrect wallet password');
        return;
      }

      withdrawMutation.mutate({
        amount: Number(formState.amount),
        walletAddress: userData.withdrawalWallet.walletAddress,
      });
    },
    [formState, userData, withdrawMutation]
  );

  const [form_inputs, setForm_inputs] = useState([
    {
      name: 'amount',
      label: 'Enter withdrawal Amount',
      type: 'number',
      placeholder: 'Enter withdrawal Amount',
      required: true,
    },
    {
      name: 'password',
      label: 'Withdrawal Password',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
  ]);

  const togglePasswordType = useCallback(() => {
    setForm_inputs(prev =>
      prev.map(item =>
        item.name === 'password'
          ? {
            ...item,
            type: item.type === 'password' ? 'text' : 'password',
          }
          : item
      )
    );
  }, []);

  const isDisabled =
    !formState.amount ||
    !formState.password ||
    withdrawMutation.isPending;

  return (
    <div>
      <UI_header title="Withdraw" description="Enjoy the hard work" />

      <div className="flex flex-col">
        <div className="px-2.5 py-3.5 rounded-lg bg-[#F5F5F7]/7 mx-4 mb-5">
          <p>
            Available Balance:{' '}
            <span className="text-[#4DB6AC]">{
              balance.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            }</span>
          </p>
        </div>

        <div className="px-4 flex flex-col gap-4">
          {form_inputs.map(details => (
            <div className="flex flex-col gap-2" key={details.name}>
              <label
                htmlFor={details.name}
                className="text-xl text-[#F5F5F7]"
              >
                {details.label}
              </label>

              <div
                className={`relative ${details.name === 'amount'
                  ? "before:content-['$'] before:absolute before:left-3 before:top-3 before:text-xl"
                  : ''
                  }`}
              >
                <input
                  type={details.type}
                  value={formState[details.name]}
                  required={details.required}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormState(details.name, e.target.value)
                  }
                  name={details.name}
                  id={details.name}
                  className={`outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl text-xl text-[#F5F5F7] w-full ${details.name === 'password' ? 'pr-10' : 'pl-8'
                    }`}
                  placeholder={details.placeholder}
                />

                {details.name === 'password' && (
                  <button
                    type="button"
                    onClick={togglePasswordType}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3"
                  >
                    <Icon
                      icon={
                        details.type === 'password'
                          ? 'mdi:eye'
                          : 'mdi:eye-off'
                      }
                      width={20}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h1 className="px-4 text-2xl text-[#F5F5F7] pb-3 pt-7">Remark</h1>

          <ol className="list-decimal list-outside mx-7 mb-5 pl-6 space-y-2 text-[#9EA4AA]">
            {withdrawRemark.map((remark, index) => (
              <li className="pl-2" key={'remark_' + index}>
                {remark}
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect-no-shadow disabled:opacity-50"
        >
          {withdrawMutation.isPending ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
