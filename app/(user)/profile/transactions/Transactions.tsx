'use client'
import { Icon } from '@iconify-icon/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import c2 from '@/assets/imgs/c2.png'
import { useMemo, useState } from 'react'
import { formatInTimeZone } from 'date-fns-tz'

const FILTER = [
   {
      title: 'All',
      type: 'all',
      stackValue: 1
   }, {
      title: 'Withdraw',
      type: 'withdrawal',
      stackValue: 2
   }, {
      title: 'Deposit',
      type: 'deposit',
      stackValue: 3
   }, {
      title: 'Plans',
      type: 'tier',
      stackValue: 4
   }, {
      title: 'Income',
      type: 'bonus',
      stackValue: 5
   }
]
const getFilterType = (stack: number) => {
   const found = FILTER.find(f => f.stackValue === stack);
   return found?.type ?? 'all';
};

const demoTranasctions: UserTransaction[] = [
   {
      _id: '123',
      transactionID: '123',
      email: 'bonifacemiracle@gmail.com',
      type: 'bonus',
      amount: 100,
      status: 'completed',
      createdAt: '1768847078951',
      updatedAt: '1768847078951',
   }
]

const Transactions = () => {
   const router = useRouter()
   const [stack, setStack] = useState(1);
   const [transaction, setTransaction] = useState<UserTransaction[]>(demoTranasctions)

   const filteredTransactions = useMemo(() => {
      if (!transaction?.length) return [];
      const type = getFilterType(stack);
      if (type === 'all') return transaction;
      if (type === 'bonus') return transaction.filter(item => item.type === 'bonus' || item.type === 'yield');
      return transaction.filter(item => item.type === type);
   }, [transaction, stack]);

   return (
      <div>
         <div className='flex bg-[#44474F] rounded-lg m-4'>
            <div className='flex-1 px-4 py-3'>
               <button onClick={() => router.back()} className='flex items-center'>
                  <Icon icon="fluent:ios-arrow-24-regular" />
                  <span>Back</span>
               </button>

               <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-2'>TTH</h1>

               <p className='text-[#9EA4AA]'>Total Transaction History</p>
            </div>

            <div className='flex-1'>
               <Image src={c2} alt='c2 image' className='w-full' />
            </div>
         </div>

         <div className='flex gap-[7px] px-4 pb-[15px] overflow-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {FILTER.map(({ title, type, stackValue }) => (
               <button key={title} onClick={() => setStack(stackValue)} className={`px-[15px] py-1 rounded-[20px] capitalize transition-all duration-300 theme-button-effect ${stack === stackValue ? 'bg-[#9EA4AA] text-[#F5F5F7]' : 'bg-[#44474F] text-[#9EA4AA]'}`}>{title}</button>
            ))}
         </div>

         <div className='px-4'>
            {filteredTransactions.length ? filteredTransactions.map((item, index) => (
               <div key={item.type + index} className='flex flex-col py-2.5 px-5 bg-[#F5F5F7]/7 text-[#C3C3C3] gap-3 rounded-lg'>
                  <div className='flex justify-between'>
                     <h1 className='text-sm font-semibold mb-1 capitalize'>
                        {item.type} {item.status === 'pending' ? 'pending' : item.status === 'completed' ? 'successful' : 'failed'}
                     </h1>
                     <p className='text-[#9EA4AA]'>${item.amount.toLocaleString()}</p>
                  </div>
                  <div className='flex justify-between text-xs font-normal text-[#9EA4AA]'>
                     <p>{formatInTimeZone(Number(item.updatedAt) ?? Date.now(), 'Africa/Lagos', 'HH:mm')}</p>
                     <p>{formatInTimeZone(Number(item.updatedAt) ?? Date.now(), 'Africa/Lagos', 'dd/MM/yy')}</p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
         </div>
      </div>
   )
}

export default Transactions