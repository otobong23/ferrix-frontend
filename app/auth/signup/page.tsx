import React, { Suspense } from 'react'
import Signup from './Signup'

const page = () => {
  return (
    <Suspense fallback={<div>Loading signup form...</div>}>
      <Signup />
    </Suspense>
  )
}

export default page