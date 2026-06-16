'use client';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Refer = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const refCode = searchParams.get('ref');
   useEffect(() => {
      router.replace(`/auth/signup?ref=${refCode}`)
   })
   return null
}

export default Refer