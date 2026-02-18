'use client';
import { useAdmin } from '@/context/Admin.context';
import { getUserByUserIdAPI, getUserTransactionsAPI } from '@/services/Admin';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify-icon/react';
import { AxiosError } from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react'

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

const Transaction = () => {
   const router = useRouter()
   const { adminData } = useAdmin()
   const [stack, setStack] = useState(1);
   const [transaction, setTransaction] = useState<UserTransaction[]>([])
   const [totalTransaction, setTotalTransaction] = useState(0)
   const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
   const [totalPages, setTotalPages] = useState(1)
   const { user_id } = useParams()
   const [user, setUser] = useState<UserType | null>(null)

   const fetchData = async () => {
      if (!user_id) return;
      const getUser = await getUserByUserIdAPI(user_id?.toString())
      setUser(getUser)
   }

   const filteredTransactions = useMemo(() => {
      if (!transaction?.length) return [];
      const type = getFilterType(stack);
      if (type === 'all') return transaction;
      if (type === 'bonus') return transaction.filter(item => item.type === 'bonus' || item.type === 'yield');
      return transaction.filter(item => item.type === type);
   }, [transaction, stack]);

   useEffect(() => {
      fetchData()
   }, [adminData])

   const fetchTransactions = async (email: string, page: number = 1) => {
      try {
         const res = await getUserTransactionsAPI({ email, limit: 100, page: page });
         setTransaction(res.transactions);
         setTotalTransaction(res.total)
         setCurrentTransactionPage(res.page)
         setTotalPages(res.totalPages)
      } catch (err) {
         console.error('Request Code error:', err);
         const message =
            err instanceof AxiosError
               ? err.response?.data?.message || 'Unexpected API error'
               : 'An unexpected error occurred';
         showToast('error', message);
      }
   }

   useEffect(() => {
      if (!user) return;
      fetchTransactions(user.email);
   }, [user]);

   const next = useCallback(() => {
      if (!user) return;
      const offset = totalPages - currentTransactionPage
      if (offset <= 0) return
      try {
         const page = currentTransactionPage + 1
         fetchTransactions(user.email, page)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }
   }, [user])

   const previous = useCallback(() => {
      if (!user) return;
      const offset = totalPages - currentTransactionPage
      if (offset > 0) return
      try {
         const page = currentTransactionPage ? currentTransactionPage - 1 : 1
         fetchTransactions(user.email, page)
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }
   }, [user])

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

            <div className="flex justify-between" hidden={totalPages == 1}>
               <button onClick={previous} className={`flex items-center ${currentTransactionPage == 1 ? 'invisible' : 'visible'}`}><Icon icon='fluent:chevron-left-24-filled' className="text-2xl" /><span className='leading-tight'>prev</span></button>
               <button onClick={next} className={`flex items-center ${currentTransactionPage == totalPages ? ' invisible' : 'visible'}`}><span className='leading-tight'>next</span><Icon icon='fluent:chevron-right-24-filled' className="text-2xl" /></button>
            </div>

            <div className='flex flex-col gap-3'>
               {filteredTransactions.length ? filteredTransactions.map((item, index) => (
                  <div key={item.type + index} className='flex flex-col py-2.5 px-5 bg-[#F5F5F7]/7 text-[#C3C3C3] gap-3 rounded-lg'>
                     <div className='flex justify-between'>
                        <h1 className='text-sm font-semibold mb-1 capitalize'>
                           {item.type === 'tier' ? 'rebate' : item.type} {item.status === 'pending' ? 'pending' : item.status === 'completed' ? 'successful' : 'failed'}
                        </h1>
                     </div>

                     <div className='flex flex-col'>
                        <p className='text-[#9EA4AA]'>Main Amount: ${item.amount.toLocaleString()}</p>
                        {item.displayAmount && <p className='text-[#9EA4AA]'>Amount Recieved: ${item.displayAmount.toLocaleString()}</p>}
                     </div>

                     <div className='flex justify-between text-xs font-normal text-[#9EA4AA]'>
                        <p>{formatInTimeZone(item.date ?? Date.now(), 'Africa/Lagos', 'HH:mm')}</p>
                        <p>{formatInTimeZone(item.date ?? Date.now(), 'Africa/Lagos', 'dd/MM/yy')}</p>
                     </div>
                  </div>
               )) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
            </div>
         </div>
      </div>
   )
}

export default Transaction