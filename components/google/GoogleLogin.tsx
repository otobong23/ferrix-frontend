'use client';
import { useAuth } from '@/context/Auth.context';
import { loginResponse } from '@/services/Authentication';
import { showToast } from '@/utils/alert';
import authFetch from '@/utils/api';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function ({ auth, referrer }: { auth: 'signup' | 'login', referrer?: string }) {
  const router = useRouter();
  const { setUser } = useAuth();
  // const login = useGoogleLogin({
  //   onSuccess: async (credentialResponse) => {
  //     console.log(credentialResponse)
  //     const res = await authFetch.post(
  //       auth === 'login' ? '/auth/google' : '/auth/google',
  //       { token: credentialResponse.access_token, type: auth, referrer }
  //     );

  //     localStorage.setItem('token', res.data.accessToken);
  //   },
  // });

  // return (
  //   <button
  //     onClick={() => login()}
  //     className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 border rounded-[10px] bg-[#F5F5F7] theme-button-effect"
  //   >
  //     <Icon icon="flat-color-icons:google" width={20} />
  //     <span className='text-[#1A1C1E] text-lg font-inria-sans font-semibold'>Continue with Google</span>
  //   </button>
  // );

  return <GoogleLogin
    cancel_on_tap_outside={true}
    text='continue_with'
    onSuccess={async (res) => {

      try {
        if (!res.credential) {
          showToast('error', 'Google login failed: no token received');
          return;
        }

        const idToken = res.credential; // ✅ JWT

        const response = auth === 'login' ?
          await authFetch.post('/auth/google/login', {
            token: idToken
          })
          :
          await authFetch.post('/auth/google/signup', {
            token: idToken,
            referrer,
          });

        const userData = await loginResponse(response)
        setUser(userData);

        showToast('success', response.data.message)

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : (err as any).response?.data?.message || "Google login failed";
        showToast('error', errorMessage);
      }
    }}
    onError={() => {
      showToast('error', 'Google login failed')
    }}
  />;
}
