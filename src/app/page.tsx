"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import LoginSuccessPopup from "@/components/LoginSuccessPopup"
import imagenInicio from "@/assets/Inicio.png"
//import NavBar from "@/components/Navbar"
import Image from "next/image"

const roleRoutes: Record<string, string> = {
  admin: "/home/inventarioEquipos",
  supervisor: "/home/inventarioArea", 
  analista: "/home/trabajos",
  solicitante: "/home/tickets"
}

const validRoles = Object.keys(roleRoutes)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowPopup(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.")
        setShowPopup(false)
        return
      }

      if (result?.ok) {
        const session = await getSession()
        
        if (!session?.user) {
          setError("Error al obtener información de la sesión.")
          setShowPopup(false)
          return
        }

        const userRole = session.user.rol
        
        if (!userRole || !validRoles.includes(userRole)) {
          setError("Lo sentimos, tu Rol de usuario no hace posible el ingreso.")
          setShowPopup(false)
          return
        }

        // Redirigir directamente sin mostrar otro popup
        const targetRoute = roleRoutes[userRole]
        window.location.href = targetRoute
      }

    } catch (err) {
      console.error("Error en handleSubmit:", err)
      setError("Error del sistema. Intenta nuevamente.")
      setShowPopup(false)
    } finally {
      setLoading(false)
    }
  }

  return (
<>

  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="grid grid-cols-2 items-center gap-5 w-9/12">
      {/* Columna izquierda - Imagen */}
      <div className="flex justify-end">
        <Image 
          src={imagenInicio} 
          alt="Imagen de inicio a la izquierda del login" 
          className="w-full rounded-2xl"
        />
      </div>
      
      {/* Columna derecha - Formulario */}
      <div className="flex justify-start">
        <div className="max-w-md w-full">
          <div>
            <h2 className="mt-6 text-left text-3xl font-extrabold text-gray-900">
              Iniciar Sesión - SIGAI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sistema de Gestión de Analistas Informáticos
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-[#4c678a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <LoginSuccessPopup isVisible={showPopup} />
</>
  )
}