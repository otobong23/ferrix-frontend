
import gem_light from '@/assets/vectors/gem_light.svg'
import gem_dark from '@/assets/vectors/gem_dark.svg'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import Image from 'next/image'

const navbarList = [
   { name: "dashboard", link: "/dashboard", icon: "majesticons:home" },
   { name: "investments", link: "/investments", icon: "majesticons:data" },
   { name: "earnings", link: "/earnings", image: {active_image: gem_dark, inactive_image: gem_light} },
   { name: "team", link: "/team", icon: "icon-park-solid:transaction-order" },
   { name: "settings", link: "/settings", icon: "fluent:person-12-filled" },

]

const Navbar = () => {
  return (
      <nav className={`bg-no-repeat bg-bottom md:bg-cover bg-[url('/Nav_background.svg')]`}>
         <ul className={`flex justify-between px-9 py-8 items-center`}>  {/* navbar-glow */}
            { navbarList.map((item, index) => (
               <li key={item.name} className='theme-button-effect'>
                  <Link href={item.link}>
                  { item.icon && <Icon icon={item.icon} className='text-3xl' /> }
                  { item.image && <div className='p-6 rounded-full bg-[#F5F5F7] transform -translate-y-6 md:-translate-y-20'>
                     <Image src={item.image.inactive_image} alt='icon_image' className='w-11 md:w-20' />
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