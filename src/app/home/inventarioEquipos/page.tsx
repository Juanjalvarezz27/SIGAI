"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import FiltroTipoEquipo from "@/components/equipos/FiltroTipoEquipo"
import FiltroStatusToggle from "@/components/equipos/FiltroStatusToggle"
import BarraBusquedaEquipos from "@/components/equipos/BarraBusquedaEquipos"
import ListaEquipos from "@/components/equipos/ListaEquipos"
import VistaDetalleEquipo from "@/components/equipos/VistaDetalleEquipo"
import PaginacionSuperior from "@/components/equipos/PaginacionSuperior"
import PaginacionInferior from "@/components/equipos/PaginacionInferior"
import BotonNuevoEquipo from "@/components/equipos/BotonNuevoEquipo"
import ModalNuevoEquipo from "@/components/equipos/ModalNuevoEquipo"
import axios from "axios"
import { Equipo, PaginationInfo } from "../../../../types/equipos"

export default function InventarioEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [error, setError] = useState<string>('')
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([])
  const [statusFiltro, setStatusFiltro] = useState<string>('todos')
  const [modo, setModo] = useState<'lista' | 'detalle'>('lista')
  const [modalNuevoEquipoAbierto, setModalNuevoEquipoAbierto] = useState(false)
  const [miRol, setMiRol] = useState({ rolId: 0, rol: '', loading: true })

  // Obtener mi rol al cargar el componente
  useEffect(() => {
    const obtenerMiRol = async () => {
      try {
        const response = await axios.get('/api/auth/usuarioRol')
        setMiRol({ 
          ...response.data, 
          loading: false 
        })
      } catch (error) {
        console.error('Error obteniendo rol:', error)
        setMiRol(prev => ({ ...prev, loading: false }))
      }
    }

    obtenerMiRol()
  }, [])

  const cargarEquipos = useCallback(async (page: number, tipos: string[], status: string) => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '100'
      })

      // Manejar múltiples tipos de equipo
      if (tipos.length > 0) {
        tipos.forEach(tipoId => {
          params.append('tipoEquipoIds', tipoId)
        })
      }

      // Mapear los status del toggle a los IDs reales usando statusId
      if (status !== 'todos') {
        params.append('statusId', status)
      }

      const response = await axios.get(`/api/equipos/obtenerEquipos?${params.toString()}`)

      if (response.status === 200) {
        setEquipos(response.data.equipos)
        setPagination(response.data.pagination)
      }
    } catch (error: unknown) {
      console.error('Error cargando equipos:', error)
      setError('Error al cargar los equipos')
      setEquipos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarEquipos(currentPage, tiposFiltro, statusFiltro)
  }, [currentPage, tiposFiltro, statusFiltro, cargarEquipos])

  const handleTiposChange = (nuevosTipos: string[]) => {
    setTiposFiltro(nuevosTipos)
    setCurrentPage(1)
  }

  const handleStatusChange = (nuevoStatus: string) => {
    setStatusFiltro(nuevoStatus)
    setCurrentPage(1)
  }

  const handleSeleccionarEquipo = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo)
    setModo('detalle')
  }

  const handleVolverALista = () => {
    setModo('lista')
    setEquipoSeleccionado(null)
  }

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= (pagination?.totalPages || 1)) {
      setCurrentPage(nuevaPagina)
    }
  }

  const handleEquipoCreado = () => {
    // Recargar la lista de equipos
    cargarEquipos(currentPage, tiposFiltro, statusFiltro)
  }

  // Determinar si el usuario puede crear equipos (admin = 1, supervisor = 2)
  const puedeCrearEquipos = miRol.rolId === 1 || miRol.rolId === 2

  return (
    <>
      <Navbar />
      <Title text={"Inventario de Equipos"} />

      <div className="container mx-auto px-4 py-8">
        {/* Vista de detalle del equipo */}
        {modo === 'detalle' && equipoSeleccionado && (
          <VistaDetalleEquipo
            equipo={equipoSeleccionado}
            onVolver={handleVolverALista}
            loading={loading}
          />
        )}

        {/* Vista de lista de equipos */}
        {modo === 'lista' && (
          <>
            {/* Toggle de Status */}
            <FiltroStatusToggle
              statusSeleccionado={statusFiltro}
              onStatusChange={handleStatusChange}
              loading={loading}
            />

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <BarraBusquedaEquipos
                onEquipoSeleccionado={handleSeleccionarEquipo}
                loading={loading}
              />
            </div>

            {/* Mensaje de error */}
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

            {/* Vista de lista de equipos */}
            <PaginacionSuperior
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={cambiarPagina}
              loading={loading}
            />

            {/* Filtro de Tipos de Equipo y Botón Nuevo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <FiltroTipoEquipo
                  tiposSeleccionados={tiposFiltro}
                  onTiposChange={handleTiposChange}
                  loading={loading}
                />
              </div>
              
              {/* Solo mostrar botón si tiene permisos */}
              {puedeCrearEquipos && (
                <BotonNuevoEquipo
                  onClick={() => setModalNuevoEquipoAbierto(true)}
                  loading={loading}
                />
              )}
            </div>

            <ListaEquipos
              equipos={equipos}
              onEquipoSeleccionado={handleSeleccionarEquipo}
              loading={loading}
              error={error}
            />

            <PaginacionInferior
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={cambiarPagina}
              loading={loading}
            />
          </>
        )}

        {/* Modal de Nuevo Equipo - Solo renderizar si tiene permisos */}
        {puedeCrearEquipos && (
          <ModalNuevoEquipo
            isOpen={modalNuevoEquipoAbierto}
            onClose={() => setModalNuevoEquipoAbierto(false)}
            onEquipoCreado={handleEquipoCreado}
          />
        )}
      </div>
    </>
  )
}