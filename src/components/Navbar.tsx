"use client"

import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { LucideIcon } from "lucide-react"

// Importar iconos de Lucide
import { 
  LogOut, 
  Package, 
  Users, 
  Ticket, 
  Calendar,
  BarChart3,
  User,
  Warehouse,
  UserCheck,
} from "lucide-react"

import Logo from "@/assets/logo.png"
import ConfirmLogoutModal from "@/components/ConfirmLogoutModal"

// Definir tipos para los botones
interface NavButton {
  path: string
  label: string
  icon: LucideIcon | null
  roles: string[] // Roles que pueden acceder a esta ruta
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Definir todas las rutas disponibles con sus roles permitidos
  const allRoutes: NavButton[] = [
     
    // Rutas compartidas entre múltiples roles y específicas por rol
    {
      path: "/home/trabajos",
      label: "Trabajos",
      icon: Warehouse,
      roles: ["analista"]
    },
    {
      path: "/home/personal",
      label: "Personal",
      icon: Users,
      roles: ["admin"]
    },
    {
      path: "/home/inventarioEquipos",
      label: "Inventario de equipos",
      icon: Package,
      roles: ["admin", "supervisor", "analista"]
    },
    {
      path: "/home/solicitantes",
      label: "Solicitantes",
      icon: UserCheck,
      roles: ["supervisor"]
    },
    {
      path: "/home/tickets",
      label: "Tickets",
      icon: Ticket,
      roles: ["admin", "supervisor", "solicitante", "analista"]
    },
    {
      path: "/home/eventosExternos",
      label: "Eventos Externos",
      icon: Calendar,
      roles: ["admin", "supervisor", "solicitante"]
    },
    {
      path: "/home/estadisticas",
      label: "Estadísticas",
      icon: BarChart3,
      roles: ["admin", "supervisor"]
    },
    {
      path: "/home/perfil",
      label: "Perfil",
      icon: User,
      roles: ["admin", "supervisor", "solicitante", "analista"]
    },
   
  ]

const handleLogout = async () => {
  try {
    await axios.post('/api/auth/signout') // Cerrar sesión en servidor
    
    // Limpiar todas las cookies relacionadas con autenticación
    const cookies = document.cookie.split(";")
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      if (name.includes('auth') || name.includes('next')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
      }
    })

    localStorage.clear() // Limpiar almacenamiento local
    sessionStorage.clear() // Limpiar almacenamiento de sesión
    delete axios.defaults.headers.common['Authorization'] // Remover headers de auth
    window.location.href = "/" // Redirigir al inicio
    
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    // limpiar todas las cookies si hay error
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
    window.location.href = "/" // Redirigir incluso con error
  }
}

const handleNavigation = (path: string) => {
  router.push(path) // Navegar a ruta específica
}

const openLogoutModal = () => {
  setShowLogoutModal(true) // Abrir modal de confirmación
}

const closeLogoutModal = () => {
  setShowLogoutModal(false) // Cerrar modal de confirmación
}

const confirmLogout = () => {
  closeLogoutModal() // Cerrar modal
  handleLogout() // Ejecutar cierre de sesión
}

  // Botones para usuarios no autenticados 
  const unauthenticatedButtons: Omit<NavButton, 'roles'>[] = [
    { path: "/docs/manualDeUso", label: "Más Info", icon: null },
    { path: "/", label: "Iniciar Sesión", icon: null },
  ]

  // Obtener botones filtrados por rol del usuario
  const getRoleButtons = (): NavButton[] => {
    const userRole = session?.user?.rol || ""
    
    if (!userRole) return []

    // Filtrar rutas que incluyan el rol del usuario
    return allRoutes.filter(route => route.roles.includes(userRole))
  }

  // Si no hay sesión - Solo los botones de iniciar sesion y mas info
  if (status === "unauthenticated") {
    return (
      <nav className="bg-[#001f3f] opacity-90 w-11/12 mt-10 mx-auto rounded-2xl">
        <div className="py-3 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Image 
                src={Logo} 
                alt="Logo del INHRR" 
                className="w-16"
              />
              <h1 className="text-white text-xl font-bold ml-2">OTIC</h1>
            </div>
            
            <div className="flex items-center gap-8">
              {unauthenticatedButtons.map((button) => {
                const isActive = pathname === button.path
                return (
                  <button
                    key={button.path}
                    onClick={() => handleNavigation(button.path)}
                    className={`text-white text-md font-medium p-4 rounded-3xl transform transition-all duration-200 hover:scale-105 ${
                      isActive 
                        ? "bg-[#4c678a]" 
                        : "transform transition-all duration-200 hover:scale-112"
                    }`}
                  >
                    {button.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Si hay sesión Mostrar botones según rol + cerrar sesión
  const roleButtons = getRoleButtons()

  return (
    <>
      <nav className="bg-[#001f3f] opacity-90 w-11/12 mt-10 mx-auto rounded-2xl">
        <div className="py-3 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Image 
                src={Logo} 
                alt="Logo del INHRR" 
                className="w-16"
              />
              <h1 className="text-white text-xl font-bold ml-2">OTIC</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Botones según el rol */}
              {roleButtons.map((button) => {
                const isActive = pathname === button.path
                const IconComponent = button.icon
                
                return (
                  <button
                    key={`${button.path}-${button.label}`}
                    onClick={() => handleNavigation(button.path)}
                    className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-2xl transform transition-all duration-200 hover:scale-105 ${
                      isActive 
                        ? "bg-[#4c678a]" 
                        : "transform transition-all duration-200 hover:scale-112"
                    }`}
                  >
                    {IconComponent && <IconComponent size={18} />}
                    {button.label}
                  </button>
                )
              })}
              
              {/* Botón de cerrar sesión con icono */}
              <button
                onClick={openLogoutModal}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-4"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmación */}
      <ConfirmLogoutModal 
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </>
  )
}