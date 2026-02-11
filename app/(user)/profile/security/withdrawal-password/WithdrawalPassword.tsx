'use client';

import UI_header from '@/components/UI_header';
import { useUser } from '@/context/User.context';
import { updateProfileAPI } from '@/services/Profile';
import { Icon } from '@iconify-icon/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface formStateType {
  withdrawal_password: string;
  confirm_withdrawal_password: string;
  [key: string]: string;
}

const WithdrawalPassword = () => {
  const router = useRouter();
  const { refreshUser } = useUser();

  const [formState, setFormState] = useState<formStateType>({
    withdrawal_password: '',
    confirm_withdrawal_password: '',
  });

  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  /* =======================
     UPDATE PASSWORD MUTATION
     ======================= */
  const updatePasswordMutation = useMutation({
    mutationFn: (password: string) =>
      updateProfileAPI({ walletPassword: password }),

    onMutate: () => {
      toast.loading('Saving withdrawal password...', {
        id: 'wallet-password',
      });
    },

    onSuccess: async () => {
      await refreshUser();
      toast.success('Withdrawal password updated successfully', {
        id: 'wallet-password',
      });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || 'Failed to update withdrawal password',
        { id: 'wallet-password' }
      );
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formState.withdrawal_password !== formState.confirm_withdrawal_password) {
        toast.error('Withdrawal passwords do not match');
        return;
      }

      updatePasswordMutation.mutate(formState.withdrawal_password);
    },
    [formState, updatePasswordMutation]
  );

  const [form_inputs, setForm_inputs] = useState([
    {
      name: 'withdrawal_password',
      label: 'Withdrawal Password',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
    {
      name: 'confirm_withdrawal_password',
      label: 'Confirm Withdrawal Password',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
  ]);

  const togglePasswordType = useCallback(() => {
    setForm_inputs(prev =>
      prev.map(item => ({
        ...item,
        type: item.type === 'password' ? 'text' : 'password',
      }))
    );
  }, []);

  return (
    <div>
      <UI_header
        title="Wallet Password"
        description="Wallet Security, Top Priority"
      />

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
                  className="outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl text-xl text-[#F5F5F7] w-full pr-10"
                  placeholder={details.placeholder}
                />

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
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={updatePasswordMutation.isPending}
          className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
        >
          {updatePasswordMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalPassword;
