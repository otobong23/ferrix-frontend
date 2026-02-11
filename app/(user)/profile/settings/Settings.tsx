'use client';

import { useUser } from '@/context/User.context';
import { updateProfileAPI } from '@/services/Profile';
import { Icon } from '@iconify-icon/react';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface formStateType {
  username: string;
  email: string;
  facebook: string;
  telegram: string;
  whatsapp: string;
  [key: string]: string;
}

const Settings = () => {
  const router = useRouter();
  const { userData } = useUser();

  const [formState, setFormState] = useState<formStateType>({
    username: '',
    email: '',
    facebook: '',
    telegram: '',
    whatsapp: '',
  });
  const [profileImage, setProfileImage] = useState('')

  /* =======================
     INIT FROM USER DATA
     ======================= */
  useEffect(() => {
    if (!userData) return;

    const { username, email, whatsappNo, telegram, facebook, profileImage } = userData;

    if(userData && profileImage) setProfileImage(profileImage)

    setFormState({
      username: username || '',
      email: email || '',
      telegram: telegram || '',
      facebook: facebook || '',
      whatsapp: whatsappNo || '',
    });
  }, [userData]);

  const handleFormState = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  /* =======================
     UPDATE PROFILE MUTATION
     ======================= */
  const updateProfileMutation = useMutation({
    mutationFn: () =>
      updateProfileAPI({
        facebook: formState.facebook,
        telegram: formState.telegram,
        whatsappNo: formState.whatsapp,
      }),

    onMutate: () => {
      toast.loading('Saving profile changes...', {
        id: 'profile-update',
      });
    },

    onSuccess: () => {
      toast.success('Profile updated successfully', {
        id: 'profile-update',
      });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || 'Failed to update profile',
        { id: 'profile-update' }
      );
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateProfileMutation.mutate();
    },
    [updateProfileMutation]
  );

  const form_inputs = [
    {
      name: 'username',
      label: 'User Name',
      type: 'text',
      placeholder: 'Lois Becket',
      required: true,
      editable: false,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Loisbecket@gmail.com',
      required: true,
      editable: false,
    },
    {
      name: 'facebook',
      label: 'Facebook Profile',
      type: 'text',
      placeholder: 'facebook.com/lois',
      required: false,
      editable: true,
    },
    {
      name: 'telegram',
      label: 'Telegram Profile',
      type: 'text',
      placeholder: '@Loisbecket123',
      required: false,
      editable: true,
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp Number',
      type: 'number',
      placeholder: '07012345678',
      required: false,
      editable: true,
    },
  ];

  return (
    <div>
      <div className="py-5 px-6 flex flex-col items-center gap-4 bg-[#44474F] rounded-lg mx-4 my-4">
        <button onClick={() => router.back()} className="flex items-center self-start">
          <Icon icon="fluent:ios-arrow-24-regular" />
          <span>Back</span>
        </button>

        <button className="w-20 h-20 rounded-full bg-[#C7C7C7] flex justify-center items-center relative theme-button-effect overflow-hidden">
          {profileImage ? <img src={profileImage} alt='profile image' className='object-cover' /> : <Icon icon="fluent:person-12-filled" className="text-[#44474F] text-4xl" />}
          <span className="absolute right-0 bottom-1/3 translate-y-1/2">
            <Icon icon="mingcute:edit-3-line" className="text-[#44474F]" width={20} />
          </span>
        </button>

        <div>
          <p className="text-[#C3C3C3] text-center text-lg">ID: 2878WR</p>
          <p className="text-[#C3C3C3] text-center text-lg">Phone: 8048378291</p>
        </div>
      </div>

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

              <input
                type={details.type}
                value={formState[details.name]}
                disabled={!details.editable}
                required={details.required}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFormState(details.name, e.target.value)
                }
                name={details.name}
                id={details.name}
                className="outline-0 border border-[#9EA4AA] px-3.5 py-3 rounded-xl text-xl text-[#F5F5F7]"
                placeholder={details.placeholder}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="flex items-center justify-center mx-4 my-6 py-2 text-lg text-white rounded-[10px] bg-investor-gold theme-button-effect disabled:opacity-50"
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
