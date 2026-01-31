import authFetch from '@/utils/api';
import { Icon } from '@iconify-icon/react';
import { useGoogleLogin } from '@react-oauth/google';

export default function({ auth, referrer }: { auth: 'signup' | 'login', referrer?: string }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse)
      const res = await authFetch.post(
        auth === 'login' ? '/auth/google' : '/auth/google',
        { token: tokenResponse.access_token, type: auth, referrer }
      );

      localStorage.setItem('token', res.data.accessToken);
    },
  });

  return (
    <button
      onClick={() => login()}
      className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 border rounded-[10px] bg-[#F5F5F7] theme-button-effect"
    >
      <Icon icon="flat-color-icons:google" width={20} />
      <span className='text-[#1A1C1E] text-lg font-inria-sans font-semibold'>Continue with Google</span>
    </button>
  );
}
