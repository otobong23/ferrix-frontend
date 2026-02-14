'use client';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Refer = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const refCode = searchParams.get('invite');
   useEffect(() => {
      router.replace(`/auth/signup?invite=${refCode}`)
   })
   return null
}

export default Refer