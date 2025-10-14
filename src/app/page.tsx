"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import LoginSuccessPopup from "@/components/LoginSuccessPopup"
import imagenInicio from "@/assets/Inicio.png"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { Eye, EyeOff } from "lucide-react"

// Mapeo de roles de usuario a sus rutas correspondientes después del login
const roleRoutes: Record<string, string> = {
  admin: "/home",
  supervisor: "/home", 
  analista: "/home",
  solicitante: "/home"
}

// Roles válidos que tienen permitido el acceso al sistema
const validRoles = Object.keys(roleRoutes)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  //Realiza la autenticación y redirige según el rol del usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowPopup(true)
    setError("")

    try {
      // Intentar autenticación 
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false // Manejar redirección manualmente
      })

      // Verificar errores de autenticación
      if (result?.error) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.")
        setShowPopup(false)
        return
      }

      // Si la autenticación fue exitosa
      if (result?.ok) {
        // Obtener información de la sesión para determinar el rol del usuario
        const session = await getSession()
        
        // Validar que la sesión se creó correctamente
        if (!session?.user) {
          setError("Error al obtener información de la sesión.")
          setShowPopup(false)
          return
        }

        const userRole = session.user.rol
        
        // Verificar que el usuario tenga un rol válido para acceder al sistema
        if (!userRole || !validRoles.includes(userRole)) {
          setError("Lo sentimos, tu Rol de usuario no hace posible el ingreso.")
          setShowPopup(false)
          return
        }

        // Redirigir al usuario según su rol
        const targetRoute = roleRoutes[userRole]
        window.location.href = targetRoute // Usar window.location para forzar recarga completa
      }

    } catch (err) {
      console.error("Error en handleSubmit:", err)
      setError("Error del sistema. Intenta nuevamente.")
      setShowPopup(false)
    } finally {
      setLoading(false)
    }
  }

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Navbar/>

      {/* Contenedor principal del login */}
      <div className="flex-1 flex items-center justify-center pt-32">
        <div className="grid grid-cols-2 items-center gap-5 w-9/12">
          
          {/* Columna izquierda - Imagen ilustrativa */}
          <div className="flex justify-end">
            <Image 
              src={imagenInicio} 
              alt="Imagen de inicio a la izquierda del login" 
              className="w-full rounded-2xl"
              priority // Priorizar carga de imagen para mejor UX
            />
          </div>
          
          {/* Columna derecha - Formulario de login */}
          <div className="flex justify-start">
            <div className="max-w-md w-full">
              
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Iniciar Sesión - SIGAI
                </h2>
                <p className="mt-2 text-center text-md text-gray-600">
                  Sistema de Gestión de Analistas Informáticos
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                
                {/* Mensaje de error */}
                {error && (
                  <div className="bg-red-100 animate-bounce border text-center border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <div className="rounded-md shadow-sm -space-y-px">
                  
                  {/* Campo de email */}
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
                      className="appearance-none rounded relative block w-full px-3 py-2 border border-[#003366] placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-400 focus:z-10 sm:text-sm"
                      placeholder="usuario@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  {/* Campo de contraseña con botón separado */}
                  <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-[#003366] placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-400 focus:z-10 sm:text-sm"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="px-3 py-2 border border-[#003366] rounded-xl text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Botón de envío */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mx-auto w-6/12 flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-2xl text-white bg-[#4c678a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] disabled:opacity-50"
                  >
                    {/* Texto dinámico del botón según estado de carga */}
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de carga durante la autenticación */}
      <LoginSuccessPopup isVisible={showPopup} />
    </>
  )
}