import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import Image from 'next/image'
import { adminNavList } from '@/constant/navList.constant'
import { usePathname } from "next/navigation";

const Navbar = () => {
   const pathname = usePathname();
  const isActive = (href: string) => pathname.includes(href);
  return (
      <nav className={`bg-[#1D1D1F]`}>
         <ul className={`flex justify-between px-9 py-8 items-center`}>
            { adminNavList.map((item) => (
               <li key={item.name} className='theme-button-effect-no-shadow'>
                  <Link href={item.link}>
                  { item.icon && <Icon icon={item.icon} className={`text-3xl transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`} /> }
                  </Link>
               </li>
            ))}
         </ul>
      </nav>
  )
}

export default Navbar