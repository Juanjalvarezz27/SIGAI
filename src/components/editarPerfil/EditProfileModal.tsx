"use client"

import { useState, useEffect } from "react"
import { X, Eye, EyeOff, Lock, CheckCircle, XCircle } from "lucide-react"
import axios, { AxiosError } from "axios"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  contraseñaActual: string
  nuevaContraseña: string
  confirmarContraseña: string
}

interface ShowPassword {
  contraseñaActual: boolean
  nuevaContraseña: boolean
  confirmarContraseña: boolean
}

interface ApiErrorResponse {
  error?: string
  detalles?: string[]
}

interface ValidacionContraseña {
  longitud: boolean
  minuscula: boolean
  numero: boolean
  especial: boolean
  noIgualActual: boolean
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState<FormData>({
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarContraseña: ''
  })
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    contraseñaActual: false,
    nuevaContraseña: false,
    confirmarContraseña: false
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [validacionContraseña, setValidacionContraseña] = useState<ValidacionContraseña>({
    longitud: false,
    minuscula: false,
    numero: false,
    especial: false,
    noIgualActual: false
  })

  // Resetear datos cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  // Validar contraseña en tiempo real
  useEffect(() => {
    const nuevaContraseña = formData.nuevaContraseña
    const contraseñaActual = formData.contraseñaActual

    setValidacionContraseña({
      longitud: nuevaContraseña.length >= 8,
      minuscula: /(?=.*[a-z])/.test(nuevaContraseña),
      numero: /(?=.*\d)/.test(nuevaContraseña),
      especial: /(?=.*[@$!%*?&])/.test(nuevaContraseña),
      noIgualActual: nuevaContraseña !== contraseñaActual && contraseñaActual !== ''
    })
  }, [formData.nuevaContraseña, formData.contraseñaActual])

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      contraseñaActual: '',
      nuevaContraseña: '',
      confirmarContraseña: ''
    })
    setShowPassword({
      contraseñaActual: false,
      nuevaContraseña: false,
      confirmarContraseña: false
    })
    setError('')
    setSuccess('')
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar mensajes de error al escribir
    if (error) setError('')
    if (success) setSuccess('')
  }

  const togglePasswordVisibility = (field: keyof ShowPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.put('/api/usuario/cambiar-password', formData)
      
      if (response.status === 200) {
        setSuccess('Contraseña actualizada correctamente')
        setFormData({
          contraseñaActual: '',
          nuevaContraseña: '',
          confirmarContraseña: ''
        })
        setTimeout(() => {
          handleClose()
        }, 1000)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      if (axiosError.response?.data?.detalles) {
        setError(`${axiosError.response.data.error}: ${axiosError.response.data.detalles.join(', ')}`)
      } else {
        setError(axiosError.response?.data?.error || 'Error al cambiar la contraseña')
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.contraseñaActual && 
                     formData.nuevaContraseña && 
                     formData.confirmarContraseña &&
                     formData.nuevaContraseña === formData.confirmarContraseña &&
                     Object.values(validacionContraseña).every(Boolean)

  const IconoValidacion = ({ valido }: { valido: boolean }) => 
    valido ? 
      <CheckCircle size={16} className="text-green-500" /> : 
      <XCircle size={16} className="text-red-500" />

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A0C4FF] rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#001F3F]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Cambiar Contraseña</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
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

            {/* Campo Contraseña Actual */}
            <div>
              <label htmlFor="contraseñaActual" className="block font-semibold text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showPassword.contraseñaActual ? "text" : "password"}
                  id="contraseñaActual"
                  name="contraseñaActual"
                  value={formData.contraseñaActual}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent pr-10"
                  placeholder="Ingresa tu contraseña actual"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('contraseñaActual')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword.contraseñaActual ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo Nueva Contraseña */}
            <div>
              <label htmlFor="nuevaContraseña" className="block  font-semibold text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword.nuevaContraseña ? "text" : "password"}
                  id="nuevaContraseña"
                  name="nuevaContraseña"
                  value={formData.nuevaContraseña}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent pr-10"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('nuevaContraseña')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword.nuevaContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Leyenda de requisitos de contraseña */}
              {formData.nuevaContraseña && (
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
                    <div className="flex items-center gap-2">
                      <IconoValidacion valido={validacionContraseña.noIgualActual} />
                      <span className={validacionContraseña.noIgualActual ? "text-green-600" : "text-gray-600"}>
                        Diferente a la contraseña actual
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div>
              <div className="relative">
                <input
                  type={showPassword.confirmarContraseña ? "text" : "password"}
                  id="confirmarContraseña"
                  name="confirmarContraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent pr-10"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmarContraseña')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword.confirmarContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Validación de coincidencia */}
            {formData.nuevaContraseña && formData.confirmarContraseña && 
             formData.nuevaContraseña !== formData.confirmarContraseña && (
              <p className="text-red-600 text-sm">
                Las contraseñas no coinciden
              </p>
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
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}