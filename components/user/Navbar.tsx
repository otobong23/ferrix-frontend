import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import Image from 'next/image'
import { navbarList } from '@/constant/navList.constant'
import { usePathname } from "next/navigation";

const Navbar = () => {
   const pathname = usePathname();
  const isActive = (href: string) => pathname.includes(href);
  return (
      <nav className={`bg-no-repeat bg-bottom md:bg-cover bg-[url('/Nav_background.svg')]`}>
         <ul className={`flex justify-between px-9 py-8 items-center`}>  {/* navbar-glow */}
            { navbarList.map((item) => (
               <li key={item.name} className='theme-button-effect-no-shadow'>
                  <Link href={item.link}>
                  { item.icon && <Icon icon={item.icon} className={`text-3xl transition-all duration-300 hover:text-investor-gold ${isActive(item.link) ? 'text-investor-gold' : ''}`} /> }
                  { item.image && <div className={`p-6 rounded-full transition-all duration-300 transform -translate-y-6 md:-translate-y-20 ${isActive(item.link) ? 'bg-linear-to-br from-[#4DB6AC] to-investor-gold' : 'bg-[#F5F5F7]'}`}>
                     <Image src={isActive(item.link) ? item.image.active_image : item.image.inactive_image} alt='icon_image' className='w-11 md:w-20 transition-all duration-300' />
                  </div> }
                  </Link>
               </li>
            ))}
         </ul>
      </nav>
  )
}

export default Navbar
// lg:h-full lg:bg-[url('/Nav_background_lg.svg')]