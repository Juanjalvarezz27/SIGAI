"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, CheckCircle, XCircle, Building, MapPin, Layers, ChevronDown } from "lucide-react"
import axios, { AxiosError } from "axios"
import SelectModal from "./SelectModal"
import AsignacionEquipos from "./AsignacionEquipos"

// Interfaces
interface Piso {
  id: number
  piso: string
}

interface Direccion {
  id: number
  direccion: string
  pisoId: number
}

interface Area {
  id: number
  nombre: string
  direccionId: number
}

interface Rol {
  id: number
  rol: string
}

interface FormData {
  cedula: string
  nombre: string
  apellido: string
  email: string
  password: string
  confirmarPassword: string
  rolId: number
  pisoId: number
  direccionId: number
  areaId: number
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

interface EquipoConEspecificaciones {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string 
  marca: string   
  statusId: number
  estadoId: number
  especificaciones?: {
    memoriaRam: string
    modulosRam: string
    capacidadDisco: string
    tipoDisco: string
    procesador: string
  }
  id?: number 
}

interface UsuarioNuevoFormProps {
  loading: boolean
  onLoadingChange: (loading: boolean) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onCancel: () => void
}

const IconoValidacion = ({ valido }: { valido: boolean }) =>
  valido ?
    <CheckCircle className="w-4 h-4 text-green-500" /> :
    <XCircle size={16} className="text-red-500" />

// Función para capitalizar la primera letra
const capitalizarPrimeraLetra = (texto: string): string => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

// Función simple para obtener roles permitidos según el rol del usuario
function obtenerRolesPermitidos(rolId: number): number[] {
  if (rolId === 1) return [2, 3, 4, 5] // Admin: todos los roles
  if (rolId === 2) return [3, 4, 5]    // Supervisor: solo solicitante y analista
  return []                         // Otros: ningún rol
}

export default function UsuarioNuevoForm({
  onSuccess,
  onError,
  onCancel,
}: UsuarioNuevoFormProps) {
  const [pisos, setPisos] = useState<Piso[]>([])
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [equipos, setEquipos] = useState<EquipoConEspecificaciones[]>([])
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false)
  const [cargandoAreas, setCargandoAreas] = useState(false)
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmarPassword: false
  })
  const [modalAbierto, setModalAbierto] = useState<'direccion' | 'area' | null>(null)
  const [loading, setLoading] = useState(false)
  const [miRol, setMiRol] = useState({ rolId: 0, rol: '', loading: true })

  const formRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    rolId: 0,
    pisoId: 0,
    direccionId: 0,
    areaId: 0
  })

  const [validacionContraseña, setValidacionContraseña] = useState<ValidacionContraseña>({
    longitud: false,
    minuscula: false,
    numero: false,
    especial: false,
    maximo: false
  })

  // Función para hacer scroll al inicio del formulario
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Obtener mi rol al cargar el componente
  useEffect(() => {
    const obtenerMiRol = async () => {
      try {
        const response = await axios.get('/api/auth/usuarioRol')
        setMiRol({ 
          ...response.data, 
          rol: capitalizarPrimeraLetra(response.data.rol),
          loading: false 
        })
      } catch (error) {
        console.error('Error obteniendo rol:', error)
        setMiRol(prev => ({ ...prev, loading: false }))
      }
    }

    obtenerMiRol()
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargandoDatos(true)

        // Cargar pisos
        const pisosResponse = await axios.get('/api/pisos')
        setPisos(pisosResponse.data.pisos || [])

        // Cargar roles desde la API
        const rolesResponse = await axios.get('/api/usuario/roles')
        let rolesDisponibles = rolesResponse.data.roles || []

        // Si el usuario es supervisor, filtrar para quitar el rol de supervisor
        if (miRol.rolId === 2) {
          rolesDisponibles = rolesDisponibles.filter((rol: Rol) => rol.id !== 2) // Quitar rol supervisor (id: 2)
        }

        // Capitalizar la primera letra de cada rol
        const rolesCapitalizados = rolesDisponibles.map((rol: Rol) => ({
          ...rol,
          rol: capitalizarPrimeraLetra(rol.rol)
        }))

        setRoles(rolesCapitalizados)

      } catch (error) {
        console.error('Error cargando datos iniciales:', error)
        onError('Error al cargar los datos del formulario')
      } finally {
        setCargandoDatos(false)
      }
    }

    if (!miRol.loading) {
      cargarDatosIniciales()
    }
  }, [onError, miRol.rolId, miRol.loading])

  // Cargar direcciones cuando se selecciona un piso
  useEffect(() => {
    const cargarDirecciones = async () => {
      if (formData.pisoId) {
        try {
          setCargandoDirecciones(true)
          const response = await axios.get(`/api/direcciones?pisoId=${formData.pisoId}`)
          setDirecciones(response.data.direcciones || [])
          setAreas([]) // Resetear áreas cuando cambia el piso

          // Resetear direccionId y areaId
          setFormData(prev => ({
            ...prev,
            direccionId: 0,
            areaId: 0
          }))
        } catch (error) {
          console.error('Error cargando direcciones:', error)
          setDirecciones([])
        } finally {
          setCargandoDirecciones(false)
        }
      } else {
        setDirecciones([])
        setAreas([])
        setCargandoDirecciones(false)
      }
    }

    cargarDirecciones()
  }, [formData.pisoId])

  // Cargar áreas cuando se selecciona una dirección
  useEffect(() => {
    const cargarAreas = async () => {
      if (formData.direccionId) {
        try {
          setCargandoAreas(true)
          const response = await axios.get(`/api/areas?direccionId=${formData.direccionId}`)
          setAreas(response.data.areas || [])

          // Resetear areaId
          setFormData(prev => ({
            ...prev,
            areaId: 0
          }))
        } catch (error) {
          console.error('Error cargando áreas:', error)
          setAreas([])
        } finally {
          setCargandoAreas(false)
        }
      } else {
        setAreas([])
        setCargandoAreas(false)
      }
    }

    cargarAreas()
  }, [formData.direccionId])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Id') ? parseInt(value) || 0 : value
    }))
    if (onError) onError('')
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmarPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSelectDireccion = (direccionId: number) => {
    setFormData(prev => ({
      ...prev,
      direccionId
    }))
  }

  const handleSelectArea = (areaId: number) => {
    setFormData(prev => ({
      ...prev,
      areaId
    }))
  }

  const getDireccionSeleccionada = () => {
    if (cargandoDirecciones) {
      return "Cargando direcciones..."
    }
    return direcciones.find(d => d.id === formData.direccionId)?.direccion ||
      (formData.pisoId ? 'Selecciona una dirección' : 'Primero selecciona un piso')
  }

  const getAreaSeleccionada = () => {
    if (cargandoAreas) {
      return "Cargando áreas..."
    }
    return areas.find(a => a.id === formData.areaId)?.nombre ||
      (formData.direccionId ? 'Selecciona un área' : 'Primero selecciona una dirección')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.cedula || !formData.nombre || !formData.email || !formData.password || !formData.rolId || !formData.pisoId || !formData.direccionId) {
      onError('Todos los campos obligatorios deben ser completados')
      scrollToTop()
      return
    }

    // Validar que el rol seleccionado esté permitido para este usuario
    const rolesPermitidos = obtenerRolesPermitidos(miRol.rolId)
    if (!rolesPermitidos.includes(formData.rolId)) {
      onError('No tienes permisos para asignar este rol')
      scrollToTop()
      return
    }

    if (formData.password !== formData.confirmarPassword) {
      onError('Las contraseñas no coinciden')
      scrollToTop()
      return
    }

    // Validar que todas las reglas de contraseña se cumplan
    if (!Object.values(validacionContraseña).every(Boolean)) {
      onError('La contraseña no cumple con todos los requisitos de seguridad')
      scrollToTop()
      return
    }

    setLoading(true)
    onError('')

    try {
      const response = await axios.post('/api/admin/crear-usuario', {
        ...formData,
        areaId: formData.areaId || null,
        equipos: equipos
      })

      if (response.status === 201) {
        const rolSeleccionado = roles.find(r => r.id === formData.rolId)
        const mensajeEquipos = equipos.length > 0 ? ` con ${equipos.length} equipo(s) asignado(s)` : ''
        onSuccess(`Usuario ${rolSeleccionado?.rol} creado correctamente${mensajeEquipos}`)
        scrollToTop()
        // Cerrar automáticamente después de 2 segundos
        setTimeout(() => {
          onCancel()
        }, 5000)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const errorMessage = axiosError.response?.data?.error || 'Error al crear el usuario'

      // Verificar si es error de email único
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('único')) {
        onError('El email ya está registrado en el sistema. Por favor, use un email diferente.')
      } else {
        onError(errorMessage)
      }
      scrollToTop()
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.cedula &&
    formData.nombre &&
    formData.email &&
    formData.password &&
    formData.confirmarPassword &&
    formData.rolId &&
    formData.pisoId &&
    formData.direccionId &&
    obtenerRolesPermitidos(miRol.rolId).includes(formData.rolId) &&
    formData.password === formData.confirmarPassword &&
    Object.values(validacionContraseña).every(Boolean)

  if (miRol.loading || cargandoDatos) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Cargando información...</p>
      </div>
    )
  }

  return (
    <>
      <div ref={formRef} className="overflow-y-auto flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del usuario actual */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              Usuario actual: <span className="font-semibold">{miRol.rol}</span>
            </p>
          </div>

          {/* Información Personal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#001F3F]" />
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Campo Rol */}
              <div>
                <label htmlFor="rolId" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  id="rolId"
                  name="rolId"
                  value={formData.rolId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  required
                  disabled={loading || roles.length === 0}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
                {miRol.rolId === 2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Los supervisores solo pueden crear Analistas y Solicitantes
                  </p>
                )}
                {roles.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No tienes permisos para crear usuarios
                  </p>
                )}
              </div>

              {/* Campo Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Ingresa el nombre"
                  required
                  disabled={loading}
                />
              </div>

              {/* Campo Apellido */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Ingresa el apellido"
                  disabled={loading}
                />
              </div>

              {/* Campo Email */}
              <div className="md:col-span-2">
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
                  placeholder="Ingresa el email (debe ser único)"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El email debe ser único en el sistema
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-[#A0C4FF]/[0.5] border border-[#A0C4FF] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#001F3F]" />
              Ubicación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Campo Piso */}
              <div>
                <label htmlFor="pisoId" className="block text-sm font-medium text-gray-700 mb-2">
                  Piso *
                </label>
                <select
                  id="pisoId"
                  name="pisoId"
                  value={formData.pisoId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Selecciona un piso</option>
                  {pisos.map((piso) => (
                    <option key={piso.id} value={piso.id}>
                      {piso.piso}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <button
                  type="button"
                  onClick={() => setModalAbierto('direccion')}
                  disabled={!formData.pisoId || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <span className="truncate">{getDireccionSeleccionada()}</span>
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                </button>
              </div>

              {/* Campo Área */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área
                </label>
                <button
                  type="button"
                  onClick={() => setModalAbierto('area')}
                  disabled={!formData.direccionId || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                  <span className="truncate">{getAreaSeleccionada()}</span>
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div className="bg-[#003366]/[0.4] border border-[#003366]/[0.6] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#001F3F]" />
              Seguridad
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-gray-600"
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
                    className="absolute text-black inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
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
                <p className="text-red-600 text-sm mt-2">
                  Las contraseñas no coinciden
                </p>
              )}
          </div>

          {/* Asignación de Equipos */}
          <AsignacionEquipos 
            onEquiposChange={setEquipos}
            disabled={loading}
          />

          {/* Botones de acción */}
          <div className="flex justify-center gap-3 pt-4">
            {/* Botón Cancelar */}
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-400 hover:shadow-lg text-gray-800 px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>

            {/* Botón Crear Usuario */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="bg-[#001F3F] cursor-pointer transition-all duration-200 hover:bg-[#003366] hover:shadow-lg text-white px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </div>
              ) : (
                "Crear Usuario"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal para Direcciones con Loader */}
      <SelectModal
        isOpen={modalAbierto === 'direccion'}
        onClose={() => setModalAbierto(null)}
        title="Seleccionar Dirección"
        options={direcciones.map(d => ({ id: d.id, nombre: d.direccion }))}
        selectedValue={formData.direccionId}
        onSelect={handleSelectDireccion}
        disabled={loading}
        loading={cargandoDirecciones}
      />

      {/* Modal para Áreas con Loader */}
      <SelectModal
        isOpen={modalAbierto === 'area'}
        onClose={() => setModalAbierto(null)}
        title="Seleccionar Área"
        options={areas.map(a => ({ id: a.id, nombre: a.nombre }))}
        selectedValue={formData.areaId}
        onSelect={handleSelectArea}
        disabled={loading}
        loading={cargandoAreas}
      />
    </>
  )
}