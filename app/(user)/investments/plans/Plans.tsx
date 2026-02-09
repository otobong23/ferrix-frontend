'use client';
import Image from 'next/image'
import c2 from '@/assets/imgs/c2.png'
import { Icon } from '@iconify-icon/react'
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { products } from '@/constant/product.constant';
import ProductCard from '@/components/ProductCard';
import PlanModal from '@/components/PlanModal';

const Plans = () => {
   const router = useRouter()
   const [tier, setTier] = useState<'core tiers' | 'prime tiers'>('core tiers')
   const [filter, setFilter] = useState<string>('all');

   const [purchaseDetails, setPurchaseDetails] = useState<Product_Type | null>(null)
   const [confirmModal, setConfirmModal] = useState(false)

   const handleClick = (product: Product_Type) => {
      setConfirmModal(true)
      setPurchaseDetails(product)
   }

   const handleTier = useCallback((selectTier: 'core tiers' | 'prime tiers') => {
      setTier(selectTier)
   }, [])
   const handleFilter = useCallback((selectFilter: string) => {
      setFilter(selectFilter)
   }, [])
   const isActiveTier = (checkTier: 'core tiers' | 'prime tiers') => tier === checkTier;
   const isActiveFilter = (checkFilter: string) => filter === checkFilter;


   return (
      <div>
         <PlanModal purchaseDetails={purchaseDetails!} confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
         <div className='flex bg-[#44474F] rounded-lg m-4'>
            <div className='flex-1 px-4 py-3'>
               <button onClick={() => router.back()} className='flex items-center'>
                  <Icon icon="fluent:ios-arrow-24-regular" />
                  <span>Back</span>
               </button>

               <h1 className='font-inria-sans font-bold text-5xl mt-1 mb-2'>CT2</h1>

               <p className='text-[#9EA4AA]'>entry-level, starter growth</p>
            </div>

            <div className='flex-1'>
               <Image src={c2} alt='c2 image' className='w-full' />
            </div>
         </div>

         <div className='py-5 px-10 flex items-center gap-10 lg:gap-2.5 lg:w-[392px] mx-auto'>
            {
               ['core tiers', 'prime tiers'].map(item => (
                  <button key={item} onClick={() => handleTier(item as 'core tiers' | 'prime tiers')} className={`flex-1 py-2 rounded-lg text-lg transition-all duration-300 theme-button-effect-no-shadow capitalize ${isActiveTier(item as 'core tiers' | 'prime tiers') ? 'text-black bg-investor-gold' : 'text-[#9EA4AA] bg-linear-to-b from-[#FFFFFF]/40 to-[#FFFFFF]/0 backdrop-blur-2xl border border-white'}`}>{item}</button>
               ))
            }
         </div>

         <div className='flex gap-[7px] px-4 pb-[15px] overflow-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {
               ['all', 'iron', 'bronze', 'copper'].map((item, index) => (
                  <button onClick={() => handleFilter(item)} key={item + '_' + index} className={`px-[15px] py-1 rounded-[20px] transition-all duration-300 theme-button-effect ${isActiveFilter(item) ? 'bg-[#9EA4AA] text-[#F5F5F7]' : 'bg-[#44474F] text-[#9EA4AA]'}`}>
                     {item}
                  </button>
               ))
            }
         </div>

         <div className="card_section mx-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {
               products.map((product, index) => <ProductCard handleClick={() => handleClick(product)} product={product} key={product + '_' + index} />)
            }
         </div>
      </div>
   )
}

export default Plans