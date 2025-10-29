"use client"

import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import Image from "next/image"
import { useState, useEffect } from "react"
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
  UserCheck,
  House
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
  const [isClient, setIsClient] = useState(false)

  // Efecto para marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Definir todas las rutas disponibles con sus roles permitidos
  const allRoutes: NavButton[] = [
    {
      path: "/home",
      label: "Inicio",
      icon: House,
      roles: ["admin", "supervisor", "solicitante", "analista"]
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
      label: "Personal",
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

  // Función para verificar si estamos en la ruta /home
  const isHomeRoute = () => {
    return pathname === "/home"
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/signout')
      
      if (typeof window !== 'undefined') {
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

        localStorage.clear()
        sessionStorage.clear()
        window.location.href = "/"
      }
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      if (typeof window !== 'undefined') {
        document.cookie.split(";").forEach(cookie => {
          const name = cookie.split("=")[0].trim()
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        })
        window.location.href = "/"
      }
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const openLogoutModal = () => {
    setShowLogoutModal(true)
  }

  const closeLogoutModal = () => {
    setShowLogoutModal(false)
  }

  const confirmLogout = () => {
    closeLogoutModal()
    handleLogout()
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

    return allRoutes.filter(route => route.roles.includes(userRole))
  }

  // Si no hay sesión
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
                    className={`cursor-pointer text-white text-md font-medium p-4 rounded-3xl transform transition-all duration-200 hover:scale-105 ${
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

  // Si hay sesión
  const roleButtons = getRoleButtons()

  // Renderizar una versión simple en el servidor, completa en el cliente
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
              {/* En el servidor, renderizar estructura básica. En cliente, la completa */}
              {isClient && !isHomeRoute() && roleButtons.map((button) => {
                const isActive = pathname === button.path
                const IconComponent = button.icon
                
                return (
                  <button
                    key={`${button.path}-${button.label}`}
                    onClick={() => handleNavigation(button.path)}
                    className={`cursor-pointer flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-2xl transform transition-all duration-200 hover:scale-105 ${
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
              
              <div className="flex items-center gap-4">
                {/* Mostrar nombre del usuario solo cuando estamos en /home */}
                {isClient && isHomeRoute() && session?.user && (
                  <h1 className="text-white text-lg">
                    Bienvenido, {session.user.nombre} {session.user.apellido}
                  </h1>
                )}
                
                {/* Botón de cerrar sesión - siempre visible */}
                <button
                  onClick={openLogoutModal}
                  className="flex items-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <LogOut size={18} />
                  {isClient && isHomeRoute() && <span>Cerrar Sesión</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmación */}
      {isClient && (
        <ConfirmLogoutModal 
          isOpen={showLogoutModal}
          onClose={closeLogoutModal}
          onConfirm={confirmLogout}
        />
      )}
    </>
  )
}