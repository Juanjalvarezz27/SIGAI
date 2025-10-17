"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import FiltroRoles from "@/components/FiltroRoles"
import FiltroUbicacion from "@/components/personal/FiltroUbicacion"
import ModalDeshabilitacion from "@/components/personal/ModalDeshabilitacion"
import VistaDetalleUsuario from "@/components/personal/VistaDetalleUsuario"
import PaginacionSuperior from "@/components/personal/PaginacionSuperior"
import PaginacionInferior from "@/components/personal/PaginacionInferior"
import ListaUsuarios from "@/components/personal/ListaUsuarios"
import BarraBusquedaPersonalizado from "@/components/personal/BarraBusquedaPersonalizado"
import BotonNuevoUsuario from "@/components/personal/BotonNuevoUsuario"
import axios from "axios"
import { Usuario, PaginationInfo } from "../../../../types/personal"

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
  message?: string
}

// Tipos para los filtros de ubicación
type FiltroUbicacionTipo =
  | { tipo: 'piso'; valor: number }
  | { tipo: 'direccion'; valor: number }
  | { tipo: 'multi-piso'; valores: number[] }
  | null

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
  
  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState<boolean>(false)
  const [usuarioADeshabilitar, setUsuarioADeshabilitar] = useState<Usuario | null>(null)
  const [deshabilitando, setDeshabilitando] = useState<boolean>(false)

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

  // Función para abrir el modal de deshabilitación
  const abrirModalDeshabilitacion = (usuario: Usuario) => {
    setUsuarioADeshabilitar(usuario)
    setModalAbierto(true)
  }

  // Función para cerrar el modal
  const cerrarModal = () => {
    if (!deshabilitando) {
      setModalAbierto(false)
      setUsuarioADeshabilitar(null)
    }
  }

  // Función para manejar errores de API
  const manejarErrorAPI = (error: unknown): string => {
    const apiError = error as ApiError
    if (apiError.response?.data?.error) {
      return apiError.response.data.error
    }
    if (apiError.message) {
      return apiError.message
    }
    return 'Error desconocido al procesar la solicitud'
  }

  // Función para confirmar la deshabilitación
  const confirmarDeshabilitacion = async (motivo: string) => {
    if (!usuarioADeshabilitar) return

    try {
      setDeshabilitando(true)
      const response = await axios.patch('/api/usuario/estado', {
        usuarioId: usuarioADeshabilitar.id,
        estado: 'Deshabilitado',
        motivo: motivo
      })

      if (response.status === 200) {
        // Recargar los datos
        await cargarUsuarios(currentPage, rolFiltro, filtroUbicacion)

        // Si estamos en vista detalle, actualizar el usuario seleccionado
        if (usuarioSeleccionado && usuarioSeleccionado.id === usuarioADeshabilitar.id) {
          setUsuarioSeleccionado({
            ...usuarioSeleccionado,
            estado: 'Deshabilitado'
          })
        }

        setError('')
        cerrarModal()
      }
    } catch (error: unknown) {
      console.error('Error deshabilitando usuario:', error)
      setError(manejarErrorAPI(error))
    } finally {
      setDeshabilitando(false)
    }
  }

  // Función para habilitar usuario (sin modal)
  const habilitarUsuario = async (usuarioId: number) => {
    try {
      setLoading(true)
      const response = await axios.patch('/api/usuario/estado', {
        usuarioId,
        estado: 'Activo'
      })

      if (response.status === 200) {
        await cargarUsuarios(currentPage, rolFiltro, filtroUbicacion)

        if (usuarioSeleccionado && usuarioSeleccionado.id === usuarioId) {
          setUsuarioSeleccionado({
            ...usuarioSeleccionado,
            estado: 'Activo'
          })
        }

        setError('')
      }
    } catch (error: unknown) {
      console.error('Error habilitando usuario:', error)
      setError(manejarErrorAPI(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Title text={"Personal"} />

      <div className="container mx-auto px-4 py-8">
        {/* Filtros en la parte superior */}
        <div className="mb-6 space-y-4">
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
                Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* Vista de detalle del usuario*/}
        {modo === 'detalle' && usuarioSeleccionado && (
          <VistaDetalleUsuario
            usuario={usuarioSeleccionado}
            onVolver={volverALista}
            onDeshabilitar={abrirModalDeshabilitacion}
            onHabilitar={habilitarUsuario}
            loading={loading || deshabilitando}
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

            <ListaUsuarios
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

      {/* Modal de deshabilitación */}
      <ModalDeshabilitacion
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onConfirm={confirmarDeshabilitacion}
        usuarioNombre={usuarioADeshabilitar ? `${usuarioADeshabilitar.nombre} ${usuarioADeshabilitar.apellido}` : ''}
        loading={deshabilitando}
      />
    </>
  )
}