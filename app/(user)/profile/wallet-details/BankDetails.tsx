'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import UI_header from '@/components/UI_header';
import { Icon } from '@iconify-icon/react';
import { useUser } from '@/context/User.context';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { updateProfileAPI } from '@/services/Profile';
import { useMutation } from '@tanstack/react-query';
import { isAddress } from 'ethers';

interface formStateType {
  withdrawal_wallet: string;
  withdrawal_password: string;
  [key: string]: string;
}

const BankDetails = () => {
  const { userData, refreshUser } = useUser();

  const [formState, setFormState] = useState<formStateType>({
    withdrawal_wallet: '',
    withdrawal_password: '',
  });

  /* =======================
     INIT FROM USER DATA
     ======================= */
  useEffect(() => {
    if (!userData) return;

    if (!userData.walletPassword) {
      toast.error('Please set up your wallet password in profile to use this feature');
    }

    setFormState(prev => ({
      ...prev,
      withdrawal_wallet: userData.withdrawalWallet?.walletAddress || '',
    }));
  }, [userData]);

  const handleFormState = useCallback(
    (name: string, value: string) => {
      if (userData && !userData.walletPassword) {
        toast.error('Please set up your wallet password in profile to use this feature');
        return;
      }
      setFormState(prev => ({ ...prev, [name]: value }));
    },
    [userData]
  );

  /* =======================
     UPDATE WALLET MUTATION
     ======================= */
  const updateWalletMutation = useMutation({
    mutationFn: (wallet: string) =>
      updateProfileAPI({ withdrawalWallet: { walletAddress: wallet, amount: 1 } }),

    onMutate: () => {
      toast.loading('Updating wallet details...', {
        id: 'update-wallet',
      });
    },

    onSuccess: async () => {
      await refreshUser();
      toast.success('Wallet details updated successfully', {
        id: 'update-wallet',
      });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || 'Failed to update wallet details',
        { id: 'update-wallet' }
      );
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!userData?.walletPassword) {
        toast.error('Wallet password not set');
        return;
      }

      if (formState.withdrawal_password !== userData.walletPassword) {
        toast.error('Incorrect wallet password');
        return;
      }

      const isValid = isAddress(formState.withdrawal_wallet)
      if(!isValid) {
        toast.error('Invalid Wallet Address')
        return;
      }

      updateWalletMutation.mutate(formState.withdrawal_wallet);
    },
    [formState, userData, updateWalletMutation]
  );

  const [form_inputs, setForm_inputs] = useState([
    {
      name: 'withdrawal_wallet',
      label: 'Withdrawal Wallet',
      type: 'text',
      placeholder: 'Your Wallet Address',
      required: true,
    },
    {
      name: 'withdrawal_password',
      label: 'Withdrawal Password',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
  ]);

  const togglePasswordType = useCallback(() => {
    setForm_inputs(prev =>
      prev.map(item =>
        item.name === 'withdrawal_password'
          ? { ...item, type: item.type === 'password' ? 'text' : 'password' }
          : item
      )
    );
  }, []);

  const isDisabled =
    !formState.withdrawal_wallet ||
    !formState.withdrawal_password ||
    updateWalletMutation.isPending;

  return (
    <div>
      <UI_header title="Wallet" description="Setup Wallet details" />

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="px-4 flex flex-col gap-4">
          {form_inputs.map(details => (
            <div className="flex flex-col gap-2" key={details.name}>
              <label
                htmlFor={details.name}
                className="text-xl text-[#F5F5F7]"
              >
                {details.label}
              </label>

              <div className="relative">
                <input
                  type={details.type}
                  value={formState[details.name]}
                  required={details.required}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormState(details.name, e.target.value)
                  }
                  name={details.name}
                  id={details.name}
                  className={`outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl text-xl text-[#F5F5F7] w-full ${
                    details.name === 'withdrawal_password' ? 'pr-10' : ''
                  }`}
                  placeholder={details.placeholder}
                />

                {details.name === 'withdrawal_password' && (
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
        <p className='text-center py-2'>Please Input your BEP20 Wallet Address</p>

        <button
          type="submit"
          disabled={isDisabled}
          className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
        >
          {updateWalletMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default BankDetails;
