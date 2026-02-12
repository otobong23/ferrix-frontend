import Image from 'next/image'
import logo from '@/assets/vectors/Logo.svg'
import { adminNavList } from '@/constant/navList.constant'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import { usePathname } from "next/navigation";
import { useAuth } from '@/context/Auth.context'

const Sidebar = () => {
   const pathname = usePathname();
   const { logout } = useAuth()
   const isActive = (href: string) => pathname.includes(href);
   return (
      <div className="sticky top-0 h-screen bg-[#1D1D1F]">
         <div id='sidebar_logo' className='flex justify-center pt-11 pb-24'>
            <Image src={logo} alt='gem dark' className='object-cover' />
         </div>

         <ul id='nav_list' className='flex flex-col pl-16 pr-6 gap-10 xl:gap-16'>
            {adminNavList.map((item) => (
               <li key={item.name} className='theme-button-effect-no-shadow'>
                  <Link href={item.link} className='flex'>

                     {item.icon && (
                        <div className='flex items-center'>
                           <Icon icon={item.icon} className={`text-[40px] transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`} />
                           <h1 className={`text-2xl capitalize transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`}>{item.name}</h1>
                        </div>
                     )}
                  </Link>
               </li>
            ))}
            <li>
               <button className='flex items-center' onClick={logout}>
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