import Image from 'next/image'
import logo from '@/assets/vectors/Logo.svg'
import { navbarList } from '@/constant/navList.constant'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import { usePathname } from "next/navigation";

const Sidebar = () => {
   const pathname = usePathname();
   const isActive = (href: string) => pathname.includes(href);
   return (
      <div className="sticky top-0 xl:bg-[url('/Nav_background_lg.svg')] bg-no-repeat h-screen bg-cover">
         <div id='sidebar_logo' className='flex justify-center pt-11 pb-24'>
            <Image src={logo} alt='gem dark' className='object-cover' />
         </div>

         <ul id='nav_list' className='flex flex-col pl-16 pr-6 gap-10 xl:gap-16'>
            {navbarList.map((item) => (
               <li key={item.name} className='theme-button-effect-no-shadow'>
                  <Link href={item.link} className='flex'>

                     {item.icon && (
                        <div className='flex items-center'>
                           <Icon icon={item.icon} className={`text-[40px] transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`} />
                           <h1 className={`text-2xl transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`}>{item.name}</h1>
                        </div>
                     )}
                     {item.image && <div className={`p-6 rounded-full bg-[#F5F5F7] transition-all duration-300 transform translate-x-8 ${isActive(item.link) ? 'bg-linear-to-br from-[#4DB6AC] to-investor-gold' : 'bg-[#F5F5F7]'}`}>
                        <Image src={isActive(item.link) ? item.image.active_image : item.image.inactive_image} alt='icon_image' className='w-12 xl:w-14 transition-all duration-300' />
                     </div>}
                  </Link>
               </li>
            ))}
            <li>
               <button className='flex items-center'>
                  <span>
                     <Icon icon="ic:round-logout" className='text-[40px]' />
                  </span>
                  <h1 className='text-2xl'>Logout</h1>
               </button>
            </li>
         </ul>
      </div>
   )
}

export default Sidebar

// transform -translate-y-6 md:-translate-y-20