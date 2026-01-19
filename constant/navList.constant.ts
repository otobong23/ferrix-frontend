import gem_light from '@/assets/vectors/gem_light.svg'
import gem_dark from '@/assets/vectors/gem_dark.svg'


export const navbarList = [
   { name: "dashboard", link: "/dashboard", icon: "majesticons:home" },
   { name: "investments", link: "/investments/plans", icon: "majesticons:data" },
   { name: "earnings", link: "/earnings", image: {active_image: gem_dark, inactive_image: gem_light} },
   { name: "team", link: "/team", icon: "icon-park-solid:transaction-order" },
   { name: "settings", link: "/profile", icon: "fluent:person-12-filled" },
]