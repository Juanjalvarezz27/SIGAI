"use client"

import { useState, useEffect, useCallback } from "react"
import FiltroRoles from "@/components/FiltroRoles"
import FiltroUbicacion from "@/components/personal/FiltroUbicacion"
import VistaDetalleUsuarioSupervisor from "../../components/supervisor/VistaDetalleUsuarioSupervisor"
import PaginacionSuperior from "@/components/personal/PaginacionSuperior"
import PaginacionInferior from "@/components/personal/PaginacionInferior"
import ListaUsuariosSupervisor from "../../components/supervisor/ListaUsuariosSupervisor"
import BarraBusquedaPersonalizado from "@/components/personal/BarraBusquedaPersonalizado"
import BotonNuevoUsuario from "@/components/personal/BotonNuevoUsuario"
import axios from "axios"
import { Usuario, PaginationInfo } from "../../../types/personal"

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
    status?: number 
  }
  message?: string
}

// Tipos para los filtros de ubicación
type FiltroUbicacionTipo =
  | { tipo: 'piso'; valor: number }
  | { tipo: 'direccion'; valor: number }
  | { tipo: 'multi-piso'; valores: number[] }
  | null

export default function VistaPersonalSupervisor() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [error, setError] = useState<string>('')
  const [modo, setModo] = useState<'lista' | 'detalle'>('lista')
  const [rolFiltro, setRolFiltro] = useState<string>('todos')
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionTipo>(null)
  
  // Para supervisor, siempre es true ya que esta vista es específica para supervisores
  const esSupervisor = true

  // Función para cargar usuarios
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
      const apiError = error as ApiError
      // CORRECCIÓN: Usar apiError.response?.status en lugar de apiError.response.status
      if (apiError.response?.status === 401) {
        setError('No tienes permisos para acceder a esta información')
      } else {
        setError('Error al cargar los usuarios')
      }
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
    setCurrentPage(1)
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtros en la parte superior */}
      <div className="mb-6 space-y-4">
        <FiltroRoles
          rolSeleccionado={rolFiltro}
          onRolChange={handleRolChange}
          loading={loading}
          esSupervisor={esSupervisor}
        />
      </div>

      {/* Barra de búsqueda personalizada */}
      <div className="mb-6">
        <BarraBusquedaPersonalizado
          onUsuarioSeleccionado={handleSeleccionarUsuario}
          loading={loading}
          rolFiltro={rolFiltro}
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
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Vista de detalle del usuario */}
      {modo === 'detalle' && usuarioSeleccionado && (
        <VistaDetalleUsuarioSupervisor
          usuario={usuarioSeleccionado}
          onVolver={volverALista}
          loading={loading}
        />
      )}

      {/* Vista de lista de usuarios */}
      {modo === 'lista' && (
        <>
          <PaginacionSuperior
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={cambiarPagina}
            loading={loading}
            rolFiltro={rolFiltro}
          />

          {/* Contenedor para FiltroUbicacion y BotonNuevoUsuario */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <FiltroUbicacion
                onFiltroChange={handleFiltroUbicacionChange}
                loading={loading}
              />
            </div>
            <div className="flex-shrink-0">
              <BotonNuevoUsuario loading={loading} />
            </div>
          </div>

          <ListaUsuariosSupervisor
            usuarios={usuarios}
            onUsuarioSeleccionado={handleSeleccionarUsuario}
            loading={loading}
            error={error}
            rolFiltro={rolFiltro}
          />

          <PaginacionInferior
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={cambiarPagina}
            loading={loading}
          />
        </>
      )}
    </div>
  )
}