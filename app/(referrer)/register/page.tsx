import { Suspense } from 'react'
import Refer from './Refer'

const page = () => {
  return (
    <Suspense fallback={<div>Loading signup form...</div>}>
      <Refer />
    </Suspense>
  )
}

export default page