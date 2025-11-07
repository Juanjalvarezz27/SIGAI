"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  Building,
  Cpu,
  AlertTriangle,
  PieChart,
  BarChart3,
  CalendarDays
} from "lucide-react"
import FiltroPeriodo from "../tickets/FiltroPeriodo"

interface EventoPorEstado {
  estado: string
  cantidad: number
}

interface EventoPorPiso {
  piso: string
  cantidad: number
}

interface TopSolicitante {
  usuario: string
  cantidad: number
}

interface EquipoMasSolicitado {
  equipo: string
  cantidad: number
}

interface EstadisticasEventosData {
  totalEventos: number
  eventosPorEstado: EventoPorEstado[]
  eventosPorPiso: EventoPorPiso[]
  eventosPorDireccion: never[]
  topSolicitantes: TopSolicitante[]
  equiposMasSolicitados: EquipoMasSolicitado[]
  duracionPromedioDias: number
  eventosEsteMes: number
  eventosActivos: number
  eventosCompletados: number
  eventosRechazados: number
}

export default function EstadisticasEventos() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasEventosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)

  const cargarEstadisticas = async (fechaInicioFiltro: Date | null = null, fechaFinFiltro: Date | null = null) => {
    try {
      setLoading(true)

      // Construir query parameters para el filtro
      const params = new URLSearchParams()
      if (fechaInicioFiltro) {
        params.append('fechaInicio', fechaInicioFiltro.toISOString())
      }
      if (fechaFinFiltro) {
        params.append('fechaFin', fechaFinFiltro.toISOString())
      }

      const url = `/api/estadisticas/eventos${params.toString() ? `?${params.toString()}` : ''}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas de eventos')
      }

      const data = await response.json()
      setEstadisticas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const handleFiltroChange = (fechaInicioFiltro: Date | null, fechaFinFiltro: Date | null) => {
    setFechaInicio(fechaInicioFiltro)
    setFechaFin(fechaFinFiltro)
    cargarEstadisticas(fechaInicioFiltro, fechaFinFiltro)
  }

  if (loading && !estadisticas) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <FiltroPeriodo onFiltroChange={handleFiltroChange} loading={loading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !estadisticas) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <FiltroPeriodo onFiltroChange={handleFiltroChange} loading={loading} />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 font-medium">Error al cargar estadísticas</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button
            onClick={() => cargarEstadisticas(fechaInicio, fechaFin)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const {
    totalEventos,
    eventosPorEstado,
    eventosPorPiso,
    topSolicitantes,
    equiposMasSolicitados,
    duracionPromedioDias,
    eventosEsteMes,
    eventosActivos,
    eventosCompletados,
    eventosRechazados
  } = estadisticas

  const porcentajeActivos = totalEventos > 0 ? (eventosActivos / totalEventos) * 100 : 0
  const porcentajeCompletados = totalEventos > 0 ? (eventosCompletados / totalEventos) * 100 : 0
  const porcentajeRechazados = totalEventos > 0 ? (eventosRechazados / totalEventos) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header con filtro */}
      <div className="flex justify-between items-center">
        <div>
          {fechaInicio && fechaFin && (
            <p className="text-sm text-gray-600 mt-1">
              Mostrando datos del período: {fechaInicio.toLocaleDateString()} - {fechaFin.toLocaleDateString()}
            </p>
          )}
        </div>
        <FiltroPeriodo onFiltroChange={handleFiltroChange} loading={loading} />
      </div>

      {/* Grid Principal de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de Eventos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <Calendar className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Eventos</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalEventos}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Eventos registrados en el sistema</p>
          </div>
        </div>

        {/* Eventos Activos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#6FA1F2] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#6FA1F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#6FA1F2] transition-all duration-300">
                <Clock className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#6FA1F2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eventos Activos</h3>
            <p className="text-3xl font-bold text-[#003366]">{eventosActivos}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeActivos.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Eventos Completados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eventos Completados</h3>
            <p className="text-3xl font-bold text-[#003366]">{eventosCompletados}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeCompletados.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Eventos Rechazados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <XCircle className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <AlertTriangle className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eventos Rechazados</h3>
            <p className="text-3xl font-bold text-[#003366]">{eventosRechazados}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeRechazados.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Eventos Este Mes */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#6FA1F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <CalendarDays className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eventos Este Mes</h3>
            <p className="text-3xl font-bold text-[#003366]">{eventosEsteMes}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Creados en el mes actual</p>
          </div>
        </div>

        {/* Duración Promedio */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Clock className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <BarChart3 className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Duración Promedio</h3>
            <p className="text-3xl font-bold text-[#003366]">{duracionPromedioDias}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Días por evento</p>
          </div>
        </div>
      </div>

      {/* Grid Secundario - Distribución Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Estado */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <PieChart className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              Distribución por Estado
            </h3>
            <div className="space-y-4">
              {eventosPorEstado.map((estado, index) => {
                const porcentaje = totalEventos > 0 ? (estado.cantidad / totalEventos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {estado.estado.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {estado.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top Solicitantes */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Users className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Top Solicitantes
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {topSolicitantes.map((solicitante, index) => {
                const porcentaje = totalEventos > 0 ? (solicitante.cantidad / totalEventos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between py-1 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 min-w-16 truncate">
                        {solicitante.usuario}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {solicitante.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Equipos Más Solicitados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Cpu className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Equipos Más Solicitados
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposMasSolicitados.map((equipo, index) => {
                const maxCantidad = Math.max(...equiposMasSolicitados.map(e => e.cantidad))
                const porcentaje = maxCantidad > 0 ? (equipo.cantidad / maxCantidad) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between py-1 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 min-w-16">
                        {equipo.equipo}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {equipo.cantidad}u
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Pisos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Building className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Pisos
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {eventosPorPiso.map((piso, index) => {
                const porcentaje = totalEventos > 0 ? (piso.cantidad / totalEventos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between py-1 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-16">
                        {piso.piso}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {piso.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}