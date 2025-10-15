"use client"

import { useState, useEffect, useRef } from "react"
import { User, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import axios, { AxiosError } from "axios"
import BarraBusqueda from "../BarraBusqueda"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  cedula: string | null
  email: string | null
  rol: {
    id: number
    rol: string
  }
  direccion: {
    direccion: string
  }
}

interface Rol {
  id: number
  rol: string
}

interface FormData {
  cedula: string
  email: string
  password: string
  confirmarPassword: string
  rolId: number
}

interface ApiErrorResponse {
  error?: string
}

interface ValidacionContraseña {
  longitud: boolean
  minuscula: boolean
  numero: boolean
  especial: boolean
}

interface UsuarioActivoFormProps {
  loading: boolean
  onLoadingChange: (loading: boolean) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onClose: () => void
}

const IconoValidacion = ({ valido }: { valido: boolean }) =>
  valido ?
    <CheckCircle size={16} className="text-green-500" /> :
    <XCircle size={16} className="text-red-500" />

export default function UsuarioActivoForm({
  loading,
  onLoadingChange,
  onSuccess,
  onError,
  onClose
}: UsuarioActivoFormProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [roles, setRoles] = useState<Rol[]>([])
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmarPassword: false
  })

  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    email: '',
    password: '',
    confirmarPassword: '',
    rolId: 0
  })

  const [validacionContraseña, setValidacionContraseña] = useState<ValidacionContraseña>({
    longitud: false,
    minuscula: false,
    numero: false,
    especial: false
  })

  const formRef = useRef<HTMLDivElement>(null)

  // Cargar roles disponibles
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const rolesDisponibles: Rol[] = [
          { id: 2, rol: 'Supervisor' },
          { id: 3, rol: 'Solicitante' },
          { id: 4, rol: 'Analista' }
        ]
        setRoles(rolesDisponibles)
      } catch (error) {
        console.error('Error cargando roles:', error)
      }
    }

    cargarRoles()
  }, [])

  // Validar contraseña en tiempo real
  useEffect(() => {
    const password = formData.password

    setValidacionContraseña({
      longitud: password.length >= 8,
      minuscula: /(?=.*[a-z])/.test(password),
      numero: /(?=.*\d)/.test(password),
      especial: /(?=.*[@$!%*?&])/.test(password)
    })
  }, [formData.password])

  // Función para hacer scroll al inicio del formulario
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetForm = () => {
    setUsuarioSeleccionado(null)
    setFormData({
      cedula: '',
      email: '',
      password: '',
      confirmarPassword: '',
      rolId: 0
    })
    setShowPassword({
      password: false,
      confirmarPassword: false
    })
  }

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setFormData(prev => ({
      ...prev,
      cedula: usuario.cedula || '',
      email: usuario.email || ''
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rolId' ? parseInt(value) : value
    }))
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
      onError('Debes seleccionar un usuario primero')
      scrollToTop()
      return
    }

    if (!formData.rolId) {
      onError('Debes seleccionar un rol')
      scrollToTop()
      return
    }

    // Validar que todas las reglas de contraseña se cumplan
    if (!Object.values(validacionContraseña).every(Boolean)) {
      onError('La contraseña no cumple con todos los requisitos de seguridad')
      scrollToTop()
      return
    }

    onLoadingChange(true)
    onError('')

    try {
      const response = await axios.put('/api/admin/actualizar-personal', {
        usuarioId: usuarioSeleccionado.id,
        ...formData
      })

      if (response.status === 200) {
        const rolSeleccionado = roles.find(r => r.id === formData.rolId)
        onSuccess(`Usuario actualizado a ${rolSeleccionado?.rol} correctamente`)
        scrollToTop()
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      onError(axiosError.response?.data?.error || 'Error al actualizar el usuario')
      scrollToTop()
    } finally {
      onLoadingChange(false)
    }
  }

  const isFormValid = usuarioSeleccionado &&
    formData.cedula &&
    formData.email &&
    formData.password &&
    formData.confirmarPassword &&
    formData.rolId &&
    formData.password === formData.confirmarPassword &&
    Object.values(validacionContraseña).every(Boolean)

  return (
    <div ref={formRef} className="overflow-y-auto flex-1">
      <form onSubmit={handleSubmit} className="space-y-6 w-11/12 mx-auto">
        {/* Buscador de usuarios */}
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
                  Actual: {usuarioSeleccionado.rol.rol} • {usuarioSeleccionado.direccion.direccion}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsuarioSeleccionado(null)
                resetForm()
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              Cambiar usuario
            </button>
          </div>
        )}

        {/* Formulario de datos */}
        {usuarioSeleccionado && (
          <div className="space-y-4 w-11/12 mx-auto">
            <div className="grid grid-cols-2 gap-4">
              {/* Campo Cédula */}
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula *
                </label>
                <input
                  type="text"
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

            {/* Select de Rol */}
            <div>
              <label htmlFor="rolId" className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <select
                id="rolId"
                name="rolId"
                value={formData.rolId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.rol}
                  </option>
                ))}
              </select>
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
            onClick={onClose}
            className="bg-gray-300 cursor-pointer transition-all duration-200  hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="bg-[#001F3F] cursor-pointer transition-all duration-200 hover:bg-[#003366] text-white px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar Rol'}
          </button>
        </div>
      </form>
    </div>
  )
}