

'use client';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/auth/login')
  })
  // return (
  //   <div>Landing Page</div>
  // )
  return null
}

export default page
