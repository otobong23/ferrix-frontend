'use client';
import { Icon } from '@iconify-icon/react';
import { formatInTimeZone } from 'date-fns-tz';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'

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
const History = () => {
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
      <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
        <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
        <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
          <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
        </button>
      </div>

      <div className='px-4 mb-5'>
        <button onClick={() => router.back()} className='flex items-center mb-1'>
          <Icon icon="fluent:ios-arrow-24-regular" />
          <span>Back</span>
        </button>

        <div className='flex gap-[7px] py-[30px] overflow-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {FILTER.map(({ title, type, stackValue }) => (
            <button key={title} onClick={() => setStack(stackValue)} className={`px-[15px] py-1 rounded-[20px] capitalize transition-all duration-300 theme-button-effect ${stack === stackValue ? 'bg-[#9EA4AA] text-[#F5F5F7]' : 'bg-[#44474F] text-[#9EA4AA]'}`}>{title}</button>
          ))}
        </div>

        <div>
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
    </div>
  )
}

export default History