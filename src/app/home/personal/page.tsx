"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import FiltroRoles from "@/components/FiltroRoles"
import FiltroUbicacion from "@/components/FiltroUbicacion"
import { ChevronLeft, ChevronRight, User, Mail, IdCard, MapPin, Briefcase, Building, Monitor, Cpu, HardDrive, Search } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'

interface Equipo {
  id: number
  bienNacional: string | null
  serial: string | null
  tipoEquipo: {
    nombre: string
  }
  modelo: {
    nombre: string
    marca: {
      nombre: string
    }
  }
  status: {
    estado: string
  } | null
  estado: {
    nombre: string
  } | null
  especificaciones: {
    memoriaRam: string | null
    capacidadDisco: string | null
    tipoDisco: string | null
    procesador: string | null
  } | null
}

interface Usuario {
  id: number
  nombre: string
  apellido: string | null
  cedula: string | null
  email: string | null
  estado: string
  rol: {
    id: number
    rol: string
  }
  direccion: {
    direccion: string
    piso: {
      piso: string
    }
  }
  area: {
    nombre: string
  } | null
  equipos: Equipo[]
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface BarraBusquedaProps {
  onUsuarioSeleccionado: (usuario: Usuario) => void
  loading?: boolean
  placeholder?: string
  label?: string
}

// Tipos para los filtros de ubicación
type FiltroUbicacionTipo =
  | { tipo: 'piso'; valor: number }
  | { tipo: 'direccion'; valor: number }
  | { tipo: 'multi-piso'; valores: number[] }
  | null

// Función helper para los equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    return `${equipo.modelo.nombre}-${equipo.modelo.marca.nombre}-${equipo.bienNacional || 'sin-bien'}-${equipo.serial || 'sin-serial'}`
  }

  const equiposUnicos = new Map()

  equipos.forEach(equipo => {
    const clave = crearClaveUnica(equipo)
    if (!equiposUnicos.has(clave)) {
      equiposUnicos.set(clave, equipo)
    }
  })

  return Array.from(equiposUnicos.values())
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Componente BarraBusquedaPersonalizado - Solo para esta página
function BarraBusquedaPersonalizado({
  onUsuarioSeleccionado,
  loading = false,
  placeholder = "Escribe al menos 3 caracteres para buscar por nombre o cédula...",
  label = "Buscar Usuario"
}: BarraBusquedaProps) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)

  // Función debounced para buscar usuarios
  const buscarUsuarios = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setUsuarios([])
        setBuscando(false)
        return
      }

      try {
        setBuscando(true)
        const response = await axios.get(`/api/admin/buscar-usuarios?q=${encodeURIComponent(query)}&buscarPorCedula=true`)
        setUsuarios(response.data.usuarios || [])
      } catch (error: unknown) {
        console.error('Error buscando usuarios:', error)
        setUsuarios([])
      } finally {
        setBuscando(false)
      }
    }, 500),
    []
  )

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda && busqueda.length >= 3) {
      buscarUsuarios(busqueda)
    } else {
      setUsuarios([])
    }
  }, [busqueda, buscarUsuarios])

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    onUsuarioSeleccionado(usuario)
    setBusqueda('')
    setUsuarios([])
  }

  return (
    <div>
      <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
          placeholder={placeholder}
          disabled={loading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Mensaje de mínimo caracteres */}
      {busqueda && busqueda.length < 3 && (
        <p className="mt-2 text-sm text-gray-500">
          Escribe al menos 3 caracteres para buscar
        </p>
      )}

      {/* Loader de búsqueda - SOLO se muestra cuando está buscando */}
      {buscando && (
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Lista de resultados - SOLO se muestra cuando NO está buscando y hay resultados */}
      {!buscando && usuarios.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
          {usuarios.map(usuario => (
            <div
              key={usuario.id}
              onClick={() => handleSeleccionarUsuario(usuario)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#A0C4FF] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#001F3F]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {capitalizeFirstLetter(usuario.rol.rol)} • {usuario.direccion.direccion}
                      </p>
                      {usuario.cedula && (
                        <p className="text-xs text-gray-400">
                          Cédula: {usuario.cedula}
                        </p>
                      )}
                    </div>
                    {usuario.estado === 'Deshabilitado' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        Deshabilitado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de no resultados - SOLO se muestra cuando NO está buscando y no hay resultados */}
      {busqueda && busqueda.length >= 3 && !buscando && usuarios.length === 0 && (
        <div className="mt-2 text-center text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </div>
  )
}

export default function Personal() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [error, setError] = useState<string>('')
  const [modo, setModo] = useState<'lista' | 'detalle'>('lista')
  const [rolFiltro, setRolFiltro] = useState<string>('todos')
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionTipo>(null)

  // Función para obtener el nombre del filtro actual
  const getNombreFiltro = (filtro: string) => {
    switch (filtro) {
      case 'todos': return 'Todos'
      case '5': return 'Personal'
      case '2': return 'Supervisor'
      case '3': return 'Solicitante'
      case '4': return 'Analista'
      case 'deshabilitados': return 'Deshabilitados'
      default: return 'Usuarios'
    }
  }

  // Función para cargar usuarios (actualizada para manejar múltiples pisos)
  const cargarUsuarios = useCallback(async (page: number, rol: string, ubicacionFiltro: FiltroUbicacionTipo) => {
    try {
      setLoading(true)
      setError('')

      // Construir query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        rolId: rol
      })

      // Agregar filtros de ubicación si existen
      if (ubicacionFiltro) {
        if (ubicacionFiltro.tipo === 'piso') {
          params.append('pisoId', ubicacionFiltro.valor.toString())
        } else if (ubicacionFiltro.tipo === 'multi-piso' && ubicacionFiltro.valores.length > 0) {
          // Para múltiples pisos, enviar como parámetros separados
          ubicacionFiltro.valores.forEach((pisoId: number) => {
            params.append('pisoIds', pisoId.toString())
          })
        } else if (ubicacionFiltro.tipo === 'direccion') {
          params.append('direccionId', ubicacionFiltro.valor.toString())
        }
      }

      const response = await axios.get(`/api/usuario/obtenerUsuarios?${params.toString()}`)

      if (response.status === 200) {
        setUsuarios(response.data.usuarios)
        setPagination(response.data.pagination)
      }
    } catch (error: unknown) {
      console.error('Error cargando usuarios:', error)
      setError('Error al cargar los usuarios')
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar usuarios cuando cambia la página, el filtro de rol o el filtro de ubicación
  useEffect(() => {
    cargarUsuarios(currentPage, rolFiltro, filtroUbicacion)
  }, [currentPage, rolFiltro, filtroUbicacion, cargarUsuarios])

  // Función para manejar cambio de rol
  const handleRolChange = (nuevoRol: string) => {
    setRolFiltro(nuevoRol)
    setCurrentPage(1)
    setError('')
    // Cerrar vista de detalle cuando se cambia el filtro
    if (modo === 'detalle') {
      setModo('lista')
      setUsuarioSeleccionado(null)
    }
  }

  // Función para manejar cambio de filtro de ubicación
  const handleFiltroUbicacionChange = (nuevoFiltro: FiltroUbicacionTipo) => {
    setFiltroUbicacion(nuevoFiltro)
    setCurrentPage(1) // Resetear a la primera página cuando cambia el filtro
    setError('')
    // Cerrar vista de detalle cuando se cambia el filtro
    if (modo === 'detalle') {
      setModo('lista')
      setUsuarioSeleccionado(null)
    }
  }

  // Función para manejar selección de usuario desde la barra de búsqueda
  const handleSeleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setModo('detalle')
    setError('')
  }

  // Función para volver a la lista
  const volverALista = () => {
    setModo('lista')
    setUsuarioSeleccionado(null)
  }

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= (pagination?.totalPages || 1)) {
      setCurrentPage(nuevaPagina)
    }
  }

  // Función para deshabilitar/habilitar usuario
  const toggleUsuarioEstado = async (usuarioId: number, nuevoEstado: 'Activo' | 'Deshabilitado') => {
    try {
      setLoading(true)
      const response = await axios.patch('/api/usuario/estado', {
        usuarioId,
        estado: nuevoEstado
      })

      if (response.status === 200) {
        // Recargar los datos
        await cargarUsuarios(currentPage, rolFiltro, filtroUbicacion)

        // Si estamos en vista detalle, actualizar el usuario seleccionado
        if (usuarioSeleccionado && usuarioSeleccionado.id === usuarioId) {
          setUsuarioSeleccionado({
            ...usuarioSeleccionado,
            estado: nuevoEstado
          })
        }

        setError('')
      }
    } catch (error: unknown) {
      console.error('Error cambiando estado del usuario:', error)
      setError('Error al cambiar el estado del usuario')
    } finally {
      setLoading(false)
    }
  }

  // Función para generar números de página a mostrar
  const generarNumerosPagina = () => {
    if (!pagination) return []

    const totalPages = pagination.totalPages
    const current = pagination.currentPage
    const delta = 2
    const range = []

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift('...')
    }
    if (current + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range
  }

  return (
    <>
      <Navbar />
      <Title text={"Personal"} />

      <div className="container mx-auto px-4 py-8">
        {/* Filtros en la parte superior */}
        <div className="mb-6 space-y-4">
          {/* Filtro por roles */}
          <FiltroRoles
            rolSeleccionado={rolFiltro}
            onRolChange={handleRolChange}
            loading={loading}
          />
        </div>

        {/* Barra de búsqueda personalizada */}
        <div className="mb-6">
          <BarraBusquedaPersonalizado
            onUsuarioSeleccionado={handleSeleccionarUsuario}
            loading={loading}
            placeholder={`Buscar ${getNombreFiltro(rolFiltro).toLowerCase()} por nombre o cédula...`}
            label={`Buscar ${getNombreFiltro(rolFiltro)}`}
          />
        </div>

        {/* Mensaje de error con botón para volver */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* Vista de detalle del usuario*/}
        {modo === 'detalle' && usuarioSeleccionado && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">{capitalizeFirstLetter(usuarioSeleccionado.rol.rol)}</p>
                  {usuarioSeleccionado.estado === 'Deshabilitado' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      Deshabilitado
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {/* Botón de deshabilitar/habilitar - MOSTRAR SIEMPRE */}
                <button
                  onClick={() => toggleUsuarioEstado(
                    usuarioSeleccionado.id,
                    usuarioSeleccionado.estado === 'Activo' ? 'Deshabilitado' : 'Activo'
                  )}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md font-medium transform transition-all duration-200 hover:scale-105 cursor-pointer ${
                    usuarioSeleccionado.estado === 'Activo'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {usuarioSeleccionado.estado === 'Activo' ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button
                  onClick={volverALista}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transform transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  Volver a la lista
                </button>
              </div>
            </div>

            {/* Resto del contenido de la vista detalle... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Personal</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IdCard size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Cédula</p>
                      <p className="font-medium">{usuarioSeleccionado.cedula || 'No registrada'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{usuarioSeleccionado.email || 'No registrado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className={`font-medium ${
                        usuarioSeleccionado.estado === 'Activo' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {usuarioSeleccionado.estado}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#A0C4FF]/[0.3] border border-[#A0C4FF]/[0.9] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#001f3f] mb-4">Ubicación</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building size={20} className="text-[#001f3f]" />
                    <div>
                      <p className="font-medium">{usuarioSeleccionado.direccion.piso.piso}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#001f3f]" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium">{usuarioSeleccionado.direccion.direccion}</p>
                    </div>
                  </div>
                  {usuarioSeleccionado.area && (
                    <div className="flex items-center gap-3">
                      <Briefcase size={20} className="text-[#001f3f]" />
                      <div>
                        <p className="text-sm text-gray-600">Área</p>
                        <p className="font-medium">{usuarioSeleccionado.area.nombre}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Equipos asignados */}
            <div className="bg-[#F29F6D]/[0.4] border border-[#F29F6D] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Equipos Asignados</h3>
              {usuarioSeleccionado.equipos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {eliminarEquiposDuplicados(usuarioSeleccionado.equipos).map((equipo) => (
                    <div key={equipo.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor size={24} className="text-[#F29F6D]" />
                        <div>
                          <h4 className="font-semibold">{equipo.tipoEquipo.nombre}</h4>
                          <p className="text-sm text-gray-600">
                            {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {equipo.bienNacional && (
                          <p><span className="font-medium">Bien Nacional:</span> {equipo.bienNacional}</p>
                        )}
                        {equipo.serial && (
                          <p><span className="font-medium">Serial:</span> {equipo.serial}</p>
                        )}
                        {equipo.status && (
                          <p><span className="font-medium">Status:</span> {equipo.status.estado}</p>
                        )}
                        {equipo.estado && (
                          <p><span className="font-medium">Estado:</span> {equipo.estado.nombre}</p>
                        )}

                        {equipo.especificaciones && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="font-medium mb-1">Especificaciones:</p>
                            <div className="space-y-1">
                              {equipo.especificaciones.procesador && (
                                <div className="flex items-center gap-2">
                                  <Cpu size={14} className="text-gray-400" />
                                  <span>{equipo.especificaciones.procesador}</span>
                                </div>
                              )}
                              {equipo.especificaciones.memoriaRam && (
                                <div className="flex items-center gap-2">
                                  <Monitor size={14} className="text-gray-400" />
                                  <span>RAM: {equipo.especificaciones.memoriaRam}</span>
                                </div>
                              )}
                              {equipo.especificaciones.capacidadDisco && (
                                <div className="flex items-center gap-2">
                                  <HardDrive size={14} className="text-gray-400" />
                                  <span>Disco: {equipo.especificaciones.capacidadDisco} ({equipo.especificaciones.tipoDisco})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No tiene equipos asignados</p>
              )}
            </div>
          </div>
        )}

        {/* Vista de lista de usuarios */}
        {modo === 'lista' && (
          <>
            {/* Información de paginación */}
            {pagination && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Mostrando <span className="font-semibold">{(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, pagination.totalCount)}</span> de <span className="font-semibold">{pagination.totalCount}</span> {getNombreFiltro(rolFiltro).toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarPagina(currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {generarNumerosPagina().map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => cambiarPagina(pageNum as number)}
                            disabled={loading}
                            className={`px-3 py-1 text-sm rounded-md transform transition-all duration-200 hover:scale-105 ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white cursor-pointer'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 cursor-pointer'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      onClick={() => cambiarPagina(currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filtro por ubicación */}
            <div>
              <FiltroUbicacion
                onFiltroChange={handleFiltroUbicacionChange}
                loading={loading}
              />
            </div>

            {/* Loader */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Lista de usuarios */}
            {!loading && !error && usuarios.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-105 cursor-pointer relative"
                    onClick={() => handleSeleccionarUsuario(usuario)}
                  >
                    {usuario.estado === 'Deshabilitado' && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                          Deshabilitado
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-[#001F3F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {usuario.nombre} {usuario.apellido}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {capitalizeFirstLetter(usuario.rol.rol)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Cédula */}
                      <div className="flex items-center gap-2 text-sm">
                        <IdCard size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {usuario.cedula || 'No registrada'}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 truncate">
                          {usuario.email || 'No registrado'}
                        </span>
                      </div>

                      {/* Dirección */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {usuario.direccion.direccion}
                        </span>
                      </div>

                      {/* Piso */}
                      <div className="flex items-center gap-2 text-sm">
                        <Building size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {usuario.direccion.piso.piso}
                        </span>
                      </div>

                      {/* Área */}
                      {usuario.area && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">
                            {usuario.area.nombre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje cuando no hay usuarios */}
            {!loading && !error && usuarios.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                <p className="text-gray-500">
                  {rolFiltro === 'deshabilitados'
                    ? 'No se encontraron usuarios deshabilitados en el sistema.'
                    : `No se encontraron usuarios ${rolFiltro !== 'todos' ? `con rol ${getNombreFiltro(rolFiltro).toLowerCase()}` : ''} en el sistema.`
                  }
                </p>
              </div>
            )}

            {/* Paginación inferior */}
            {pagination && pagination.totalPages > 1 && !loading && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cambiarPagina(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">
                      Página {currentPage} de {pagination.totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => cambiarPagina(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}