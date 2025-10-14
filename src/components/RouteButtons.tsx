"use client"

import { useRouter } from "next/navigation"
import { Warehouse, Package, Ticket, Calendar } from "lucide-react"

// Mapa de iconos por nombre
const iconMap = {
  Warehouse,
  Package, 
  Ticket,
  Calendar
} as const

interface RouteButton {
  path: string
  label: string
  iconName: keyof typeof iconMap
}

interface RouteButtonsProps {
  routes: RouteButton[]
}

export default function RouteButtons({ routes }: RouteButtonsProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex justify-center items-center gap-6 h-full">
      {routes.map((route) => {
        const IconComponent = iconMap[route.iconName]
        
        return (
          <div 
            key={route.path} 
            onClick={() => handleNavigation(route.path)}
            className="flex flex-col items-center gap-2 transform transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <div className="bg-[#001F3F] p-4 rounded-2xl">
              <IconComponent className="text-white" size={40} />
            </div>
            <span className="text-[#001F3F] font-medium text-sm text-center">{route.label}</span>
          </div>
        )
      })}
    </div>
  )
}