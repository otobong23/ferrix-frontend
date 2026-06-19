import { Suspense } from 'react'
import Refer from './Refer'
import SpinnerUltra from '@/components/spinners/SpinnerUltra'

const page = () => {
  return (
    <Suspense fallback={<SpinnerUltra fill="#E6A500" width={48} height={48} />}>
      <Refer />
    </Suspense>
  )
}

export default page