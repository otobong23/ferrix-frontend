'use client';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Refer = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const refCode = searchParams.get('reg');
   useEffect(() => {
      router.replace(`/auth/signup?inviteCode=${refCode}`)
   })
   return null
}

export default Refer