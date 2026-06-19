'use client';
import { showToast } from "@/utils/alert";
import { Icon } from "@iconify-icon/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import copy from 'copy-to-clipboard';
import { getTransactionsAPI, updateUserTransactionAPI } from "@/services/Admin";
import Link from "next/link";
import { useAdmin } from "@/context/Admin.context";

const formatTime = (timestamp: string | number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' });
};

const ImageDownload = (image: string) =>
  image.startsWith('data:') ? image : `data:image/png;base64,${image}`;

// Map each filter button to the query params it should send
const FILTER = [
  { title: 'All',      stackValue: 1, type: undefined,     status: undefined   },
  { title: 'New',      stackValue: 2, type: undefined,     status: 'new'       }, // handled specially below
  { title: 'Approved', stackValue: 3, type: undefined,     status: 'completed' },
  { title: 'Deposit',  stackValue: 4, type: 'deposit',     status: undefined   },
  { title: 'Withdraw', stackValue: 5, type: 'withdrawal',  status: undefined   },
  { title: 'Pending',  stackValue: 6, type: undefined,     status: 'pending'   },
  { title: 'Failed',   stackValue: 7, type: undefined,     status: 'failed'    },
] as const;

const Transaction = () => {
  const { refreshAdmin } = useAdmin();
  const router = useRouter();
  const [stack, setStack] = useState(1);
  const [status, setStatus] = useState<'approve' | 'decline' | null>(null);
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState('');
  const [action, setAction] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [transaction, setTransaction] = useState<UserTransaction[]>([]);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const activeFilter = FILTER.find(f => f.stackValue === stack) ?? FILTER[0];

  const fetchTransactions = async (page: number = 1, filter = activeFilter) => {
    setLoading(true);
    try {
      // "New" filter: last 24 h — no direct DB query param, so fetch all and slice client-side
      // For everything else, pass type/status to the API
      let type = filter.type as string | undefined;
      let status = filter.status as string | undefined;

      if (filter.title === 'New') {
        // fetch without status filter; we'll trim to last 24 h after
        status = undefined;
      }

      const res = await getTransactionsAPI(10, page, type, status);
      let results = res.transactions;

      if (filter.title === 'New') {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        results = results.filter(
          t => new Date(t.createdAt ?? '').getTime() >= cutoff
        );
      }

      setTransaction(results);
      setTotalTransaction(res.total);
      setCurrentTransactionPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Unexpected API error'
          : 'An unexpected error occurred';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch from the server whenever the selected filter changes
  useEffect(() => {
    fetchTransactions(1, activeFilter);
  }, [stack]);

  const handlebutton = (
    params: 'approve' | 'decline',
    _id: string,
    amount: number,
    email: string,
    action: 'add' | 'minus'
  ) => {
    setStatus(params);
    setTransactionId(_id);
    setAmount(amount);
    setEmail(email);
    setAction(action);
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      await updateUserTransactionAPI(email, transactionId, {
        status: status === 'decline' ? 'failed' : 'completed',
        amount,
        action: action as 'add' | 'minus',
      });
      refreshAdmin();
      showToast('success', `Transaction ${status}`);
      handleCancel();
      fetchTransactions(currentTransactionPage, activeFilter);
    } catch (err) {
      if (err instanceof AxiosError) {
        showToast('error', err.response?.data.message);
      } else {
        showToast('error', 'An error occurred');
      }
    }
  };

  const handleCancel = () => {
    setStatus(null);
    setConfirmModal(false);
    setTransactionId('');
    setAmount(0);
    setEmail('');
    setAction('');
  };

  const handleCopy = (value: string) => {
    copy(value);
    showToast('success', 'Copied Successfully');
  };

  // Pending-first sort on whatever the server returned
  const displayed = [...transaction].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <div>
      {/* Confirm modal */}
      <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-99 items-center ${confirmModal ? 'flex' : 'hidden'}`}>
        <div className='w-full py-[75px] text-sm rounded-4xl border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col px-[50px]'>
          <h1 className='text-center text-[40px] font-bold'>Confirm</h1>
          <p className='text-center flex flex-col items-center'>
            <span>Please are you sure you want to {status} this transaction? Please Confirm</span>
          </p>
          <div className='flex flex-col gap-1'>
            <button onClick={handleConfirm} className='w-full bg-investor-gold flex-1 text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition opacity-100 hover:scale-90'>
              confirm
            </button>
            <button onClick={handleCancel} className='w-full bg-[#C0C0C063] flex-1 text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition opacity-100 hover:scale-90'>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 lg:pl-11 pt-4 mb-5 lg:mb-20">
        <h1 className="font-poppins text-2xl pl-2.5 py-[5px]">Admin</h1>
        <button className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center">
          <Icon icon="iconamoon:profile-fill" className="text-2xl text-[#0000004D] leading-tight" />
        </button>
      </div>

      <div className="flex gap-2 my-3 overflow-scroll lg:overflow-auto no-scrollbar">
        {FILTER.map(({ title, stackValue }) => (
          <button
            key={title}
            onClick={() => setStack(stackValue)}
            className={`py-2 px-7 text-[#EFEFEF] rounded-[15px] flex items-center justify-center transition-all duration-300 ${stack === stackValue ? 'bg-[#00273298]' : 'bg-[#002732]'}`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className='flex flex-col gap-3 overflow-scroll no-scrollbar max-w-[649px] mx-auto px-4'>
        {loading ? (
          <p className="text-center text-sm text-white/60">Loading...</p>
        ) : displayed.length ? (
          displayed.map((a, i) =>
            a.status === 'pending' ? (
              <Pending
                key={a.email + i}
                image={a.image ?? ''}
                _id={a._id}
                handleClick={handlebutton}
                email={a.email}
                type={a.type}
                amount={a.amount}
                updatedAt={a.updatedAt ?? ''}
                walletAddress={a.withdrawWalletAddress}
                accountName={a.accountName}
                accountNumber={a.accountNumber}
                bankName={a.bankName}
                oncopy={handleCopy}
                transactionID={a.transactionID ?? ''}
              />
            ) : (
              <Done
                key={a.email + i}
                email={a.email}
                type={a.type}
                amount={a.amount}
                updatedAt={a.updatedAt ?? ''}
                status={a.status}
              />
            )
          )
        ) : (
          <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>
        )}
      </div>
    </div>
  );
};

export default Transaction;


const Done = ({ email, type, amount, updatedAt, status }: { email: string, type: string, amount: number, updatedAt: string, status: 'completed' | 'failed' }) => (
  <div className='px-[25px] py-2.5 rounded-[15px] bg-white/7 flex items-center gap-3'>
    <div>
      {status === 'completed' ? <Icon icon='ion:checkmark-done-circle' className='text-[#6EBA0E] text-3xl' /> : <Icon icon='material-symbols:sms-failed' className='text-[#F94E4E] text-3xl' />}
    </div>
    <div className='w-full'>
      <h1 className='font-semibold capitalize text-[#F5F5F7]'>{type}</h1>
      <p className='text-[#F5F5F7]/50'>{email}</p>
      <div className='flex justify-between text-[#F5F5F7]/50'>
        <p>{type} | ${amount} {status === 'failed' && <span className='text-[#F94E4E] ml-3'>Rejected</span>}</p>
        <p>{formatTime(updatedAt)}</p>
      </div>
    </div>
  </div>
)
const Pending = ({ email, image, type, amount, updatedAt, handleClick, _id, walletAddress = '', accountName = '', accountNumber = '', bankName = '', oncopy, transactionID }: { email: string, image: string, type: string, amount: number, updatedAt: string, handleClick: (params: 'approve' | 'decline', _id: string, amount: number, email: string, action: 'add' | 'minus') => void, _id: string, walletAddress?: string, accountName?: string, accountNumber?: string, bankName?: string, oncopy: (text: string) => void, transactionID: string }) => {
  const [toggle, setToggle] = useState(false)
  return (
    <div className='px-[25px] py-2.5 rounded-[15px] bg-white/7 flex items-center gap-3 transition-all duration-300'>
      <div>
        <Icon icon='solar:money-bag-bold' className='text-[#10B981] text-3xl' />
      </div>
      <div className='w-full'>
        <div className='flex items-center justify-between' onClick={() => setToggle(prev => !prev)}>
          <h1 className='font-semibold capitalize text-[#F5F5F7] flex items-start'>{type}<span className='w-2 h-2 bg-[#F59E0B] block rounded-full'></span></h1>
          <span><Icon icon='tabler:chevron-down' className={`text-2xl text-[#F5F5F7] transition-all duration-300 ${toggle ? 'rotate-180' : 'rotate-0'}`} /></span>
        </div>
        <p className='text-[#F5F5F7]/50'>{email}</p>
        <div className='flex justify-between text-[#F5F5F7]/50'>
          <p>{type} | ${amount} <span className='text-[#F59E0B] ml-3'>Pending</span></p>
          <p>{formatTime(updatedAt)}</p>
        </div>
        <div className={`flex flex-col gap-2 mt-5 justify-end max-w-full overflow-hidden transition-all duration-300 ${toggle ? 'max-h-40' : 'max-h-0'}`}>
          {walletAddress && (<div className='flex text-[#F5F5F7] overflow-hidden'>
            <p className='w-[250px] relative truncate'>Addr: <span>{walletAddress}</span></p>
            <button className='cursor-pointer' onClick={() => oncopy(walletAddress)}>
              <Icon icon='akar-icons:copy' className='text-[20px]' />
            </button>
          </div>)}
          {accountName && (<div className='flex text-[#F5F5F7] overflow-hidden'>
            <p className='w-[250px] relative truncate'>Name: <span>{accountName}</span></p>
            <button className='cursor-pointer' onClick={() => oncopy(accountName)}>
              <Icon icon='akar-icons:copy' className='text-[20px]' />
            </button>
          </div>)}
          {accountNumber && (<div className='flex text-[#F5F5F7] overflow-hidden'>
            <p className='w-[250px] relative truncate'>Acct_Num: <span>{accountNumber}</span></p>
            <button className='cursor-pointer' onClick={() => oncopy(accountNumber)}>
              <Icon icon='akar-icons:copy' className='text-[20px]' />
            </button>
          </div>)}
          {bankName && (<div className='flex text-[#F5F5F7] overflow-hidden'>
            <p className='w-[250px] relative truncate'>Bank: <span>{bankName}</span></p>
            <button className='cursor-pointer' onClick={() => oncopy(bankName)}>
              <Icon icon='akar-icons:copy' className='text-[20px]' />
            </button>
          </div>)}
          {type === 'deposit' && (<div className='flex text-[#F5F5F7] overflow-hidden'>
            <p className='w-[250px] relative truncate'>TrnxID: <span>{transactionID}</span></p>
            <button className='cursor-pointer' onClick={() => oncopy(transactionID)}>
              <Icon icon='akar-icons:copy' className='text-[20px]' />
            </button>
          </div>)}
          <div className='flex gap-4 justify-end'>
            {image && <Link href={ImageDownload(image)} download={`${email}_${_id}_receipt.png`} target="_blank" rel="noopener noreferrer" className='capitalize px-[15px] py-[5px] rounded-[10px] font-semibold text-sm text-white bg-[#F59E0B]'>reciept</Link>}
            {['approve', 'decline'].map(a => (<button key={a} onClick={() => handleClick(a as 'approve' | 'decline', _id, amount, email, type === 'deposit' ? 'add' : 'minus')} className={`capitalize px-[15px] py-[5px] rounded-[10px] font-semibold text-sm text-white ${a === 'approve' ? 'bg-(--color7)' : 'bg-[#C0C0C063]'}`}>{a}</button>))}
          </div>
        </div>
      </div>
    </div>
  )
};