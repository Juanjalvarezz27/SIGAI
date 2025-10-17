"use client"

import { useState, useEffect, useRef } from "react"
import { X, UserPlus, User, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import axios, { AxiosError } from "axios"
import BarraBusqueda from "../BarraBusqueda"
import { Usuario } from '../../../types/index'

interface AddAdminModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  cedula: string
  email: string
  password: string
  confirmarPassword: string
}

interface ApiErrorResponse {
  error?: string
}

interface ValidacionContraseña {
  longitud: boolean
  minuscula: boolean
  numero: boolean
  especial: boolean
  maximo: boolean
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmarPassword: false
  })

  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    email: '',
    password: '',
    confirmarPassword: ''
  })

  const [validacionContraseña, setValidacionContraseña] = useState<ValidacionContraseña>({
    longitud: false,
    minuscula: false,
    numero: false,
    especial: false,
    maximo: false
  })

  const modalContentRef = useRef<HTMLDivElement>(null)

  // Validar contraseña en tiempo real
  useEffect(() => {
    const password = formData.password

    setValidacionContraseña({
      longitud: password.length >= 8,
      minuscula: /(?=.*[a-z])/.test(password),
      numero: /(?=.*\d)/.test(password),
      especial: /(?=.*[@$!%*?&])/.test(password),
      maximo: password.length <= 20
    })
  }, [formData.password])

  // Función para hacer scroll al inicio del modal
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Efecto para hacer scroll cuando hay éxito
  useEffect(() => {
    if (success) {
      scrollToTop()
    }
  }, [success])

  // Resetear datos cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setUsuarioSeleccionado(null)
    setError('')
    setSuccess('')
    setLoading(false)
    setFormData({
      cedula: '',
      email: '',
      password: '',
      confirmarPassword: ''
    })
    setShowPassword({
      password: false,
      confirmarPassword: false
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setFormData(prev => ({
      ...prev,
      cedula: usuario.cedula || '',
      email: usuario.email || ''
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmarPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usuarioSeleccionado) {
      setError('Debes seleccionar un usuario primero')
      scrollToTop()
      return
    }

    // Validar que todas las reglas de contraseña se cumplan
    if (!Object.values(validacionContraseña).every(Boolean)) {
      setError('La contraseña no cumple con todos los requisitos de seguridad')
      scrollToTop()
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.put('/api/admin/actualizar-admin', {
        usuarioId: usuarioSeleccionado.id,
        ...formData
      })
      
      if (response.status === 200) {
        setSuccess('Usuario actualizado a administrador correctamente')
        scrollToTop()
        setTimeout(() => {
          handleClose()
        }, 2000)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      setError(axiosError.response?.data?.error || 'Error al actualizar el usuario')
      scrollToTop()
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = usuarioSeleccionado && 
                     formData.cedula && 
                     formData.email && 
                     formData.password &&
                     formData.confirmarPassword &&
                     formData.password === formData.confirmarPassword &&
                     Object.values(validacionContraseña).every(Boolean)

  const IconoValidacion = ({ valido }: { valido: boolean }) => 
    valido ? 
      <CheckCircle size={16} className="text-green-500" /> : 
      <XCircle size={16} className="text-red-500" />

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
        
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A0C4FF] rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#001F3F]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Agregar Administrador</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del modal con scroll */}
        <div 
          ref={modalContentRef}
          className="p-6 overflow-y-auto flex-1"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Buscador de usuarios usando el componente BarraBusqueda */}
            {!usuarioSeleccionado && (
              <BarraBusqueda
                onUsuarioSeleccionado={handleSeleccionarUsuario}
                loading={loading}
                placeholder="Escribe al menos 3 caracteres para buscar..."
                label="Buscar Usuario"
              />
            )}

            {/* Información del usuario seleccionado */}
            {usuarioSeleccionado && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Actual: {capitalizeFirstLetter(usuarioSeleccionado.rol.rol)} • {usuarioSeleccionado.direccion.direccion}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUsuarioSeleccionado(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Cambiar usuario
                </button>
              </div>
            )}

            {/* Formulario de datos */}
            {usuarioSeleccionado && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Campo Cédula */}
                  <div>
                    <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                      Cédula *
                    </label>
                    <input
                      type="number"
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                      placeholder="Ingresa la cédula"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Campo Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                      placeholder="Ingresa el email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Campo Contraseña */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.password ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent pr-10"
                        placeholder="Ingresa la contraseña"
                        required
                        disabled={loading}
                        maxLength={20}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.password.length}/20 caracteres
                    </p>
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div>
                    <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirmarPassword ? "text" : "password"}
                        id="confirmarPassword"
                        name="confirmarPassword"
                        value={formData.confirmarPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent pr-10"
                        placeholder="Confirma la contraseña"
                        required
                        disabled={loading}
                        maxLength={20}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmarPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword.confirmarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Leyenda de requisitos de contraseña */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">La contraseña debe contener:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <IconoValidacion valido={validacionContraseña.longitud} />
                        <span className={validacionContraseña.longitud ? "text-green-600" : "text-gray-600"}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconoValidacion valido={validacionContraseña.maximo} />
                        <span className={validacionContraseña.maximo ? "text-green-600" : "text-gray-600"}>
                          Máximo 20 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconoValidacion valido={validacionContraseña.minuscula} />
                        <span className={validacionContraseña.minuscula ? "text-green-600" : "text-gray-600"}>
                          Al menos una letra minúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconoValidacion valido={validacionContraseña.numero} />
                        <span className={validacionContraseña.numero ? "text-green-600" : "text-gray-600"}>
                          Al menos un número
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconoValidacion valido={validacionContraseña.especial} />
                        <span className={validacionContraseña.especial ? "text-green-600" : "text-gray-600"}>
                          Al menos un carácter especial (@$!%*?&)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validación de coincidencia */}
                {formData.password && formData.confirmarPassword && 
                 formData.password !== formData.confirmarPassword && (
                  <p className="text-red-600 text-sm">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="bg-[#001F3F] cursor-pointer transform transition-all duration-200 hover:scale-105 hover:bg-[#003366] text-white px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Actualizando...
                  </div>
                ) : (
                  'Actualizar a Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}