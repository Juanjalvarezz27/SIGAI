"use client"

import { useRouter } from "next/navigation"
import axios from "axios"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Hacer logout en el servidor
      await axios.post('/api/auth/signout')

      // Limpiar todas las cookies de next-auth
      const cookies = document.cookie.split(";")
      
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        // Eliminar cualquier cookie relacionada con next-auth o auth
        if (name.includes('auth') || name.includes('next')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        }
      })

      // Limpiar almacenamiento local
      localStorage.clear()
      sessionStorage.clear()

      //  Limpiar cache de axios y otras librerías
      delete axios.defaults.headers.common['Authorization']

      //  Redirigir con recarga completa para limpiar estado de React
      window.location.href = "/"
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })
      window.location.href = "/"
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema de Gestión
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}