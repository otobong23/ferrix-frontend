import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image'
import React from 'react'

interface Product_Type {
   name: string;
   image: string | StaticImport;
   package_level: string;
   price: number;
   contract_duration_in_days: number;
   daily_rate: number;
   total_revenue: number;
}

const ProductCard = ({ product }: { product: Product_Type }) => {
   return (
      <div className={`card flex border-[#FFFFFF]/40 border rounded-lg py-4`}>
         <div className="card_image">
            <Image src={product.image} alt="f1_image" className="object-cover" />
         </div>

         <div className="card_content">
            <h1 className="font-bold text-white font-inria-sans text-2xl">{product.name}</h1>
            <h2 className="text-sm bg-[#50535B] inline-block rounded-sm p-1">
               <span className="bg-linear-to-br from-[#4DB6AC] to-investor-gold bg-clip-text text-transparent">{product.package_level}</span>
            </h2>
            <p className="text-sm font-bold text-[#F5F5F7]">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            <p className="text-sm text-[#F5F5F7]">
               <span>Contract Duration:</span>
               <span className="font-bold ml-1">{product.contract_duration_in_days}Days</span>
            </p>
            <p className="text-sm text-[#F5F5F7]">
               <span>Daily Rate:</span>
               <span className="font-bold ml-1">{product.daily_rate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </p>
            <p className="text-sm text-[#F5F5F7]">
               <span>Total Revenue:</span>
               <span className="font-bold ml-1">{product.total_revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </p>
         </div>

         <div className="card_activity ml-auto mr-5 flex items-end">
            <button className="px-[15px] py-[5px] text-[#1D1D1F] text-sm rounded-sm bg-linear-to-br from-[#4DB6AC] to-investor-gold theme-button-effect">
               Activate
            </button>
         </div>
      </div>
   )
}

export default ProductCard