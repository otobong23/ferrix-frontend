import React, { Suspense } from 'react'
import Signup from './Signup'
import SpinnerUltra from '@/components/spinners/SpinnerUltra'

const page = () => {
  return (
    <Suspense fallback={<SpinnerUltra fill="#E6A500" width={48} height={48} />}>
      <Signup />
    </Suspense>
  )
}

export default page