"use client"

import { useState, useEffect } from "react"
import {
  Ticket,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart3,
  Calendar,
  Cpu,
  MapPin,
  Building,
  User,
  Laptop,
  RefreshCw,
  Target,
  Wrench,
  BarChart
} from "lucide-react"
import FiltroPeriodo from "../tickets/FiltroPeriodo"

interface EstadisticasTickets {
  totalTickets: number
  ticketsAbiertos: number
  ticketsCerrados: number
  ticketsEnProgreso: number
  ticketsPorTipo: Array<{
    tipo: string
    cantidad: number
    porcentaje: number
  }>
  tiempoPromedioCierreHoras: number
  ticketsResueltosEn24Horas: number
  ticketsResueltosEn72Horas: number
  ticketsPendientesMas7Dias: number
  ticketsPorAnalista: Array<{
    analista: string
    cantidad: number
    tipo: string
  }>
  ticketsPorSistema: Array<{
    sistema: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorFalla: Array<{
    falla: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorPiso: Array<{
    piso: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorArea: Array<{
    area: string
    cantidad: number
    porcentaje: number
  }>
  totalReasignaciones: number
  ticketsReasignados: number
  ticketsPorCondicionCierre: Array<{
    condicion: string
    cantidad: number
    porcentaje: number
  }>
  ticketsUltimos30Dias: number
  ticketsUltimos7Dias: number
  ticketsHoy: number
  equiposMasReportados: Array<{
    equipo: string
    tipo: string
    cantidadTickets: number
  }>
  usuariosMasAfectados: Array<{
    usuario: string
    area: string
    cantidadTickets: number
  }>
  tiempoPromedioPorTipo: Array<{
    tipo: string
    tiempoPromedioHoras: number
  }>
}

export default function EstadisticasTickets() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasTickets | null>(null)
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

      const url = `/api/estadisticas/tickets${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
    totalTickets,
    ticketsAbiertos,
    ticketsCerrados,
    ticketsPorTipo,
    tiempoPromedioCierreHoras,
    ticketsResueltosEn24Horas,
    ticketsResueltosEn72Horas,
    ticketsPendientesMas7Dias,
    ticketsPorAnalista,
    ticketsPorSistema,
    ticketsPorPiso,
    ticketsPorArea,
    totalReasignaciones,
    ticketsReasignados,
    ticketsPorCondicionCierre,
    ticketsUltimos30Dias,
    ticketsUltimos7Dias,
    ticketsHoy,
    equiposMasReportados,
    usuariosMasAfectados,
    tiempoPromedioPorTipo
  } = estadisticas

  const porcentajeAbiertos = totalTickets > 0 ? (ticketsAbiertos / totalTickets) * 100 : 0
  const porcentajeCerrados = totalTickets > 0 ? (ticketsCerrados / totalTickets) * 100 : 0
  const porcentajeResueltos24Horas = ticketsCerrados > 0 ? (ticketsResueltosEn24Horas / ticketsCerrados) * 100 : 0
  const porcentajeResueltos72Horas = ticketsCerrados > 0 ? (ticketsResueltosEn72Horas / ticketsCerrados) * 100 : 0
  const porcentajeReasignados = totalTickets > 0 ? (ticketsReasignados / totalTickets) * 100 : 0

  return (
    <div className="space-y-8">
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

      {/* Grid Principal - Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total de Tickets */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <Ticket className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Tickets</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalTickets}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Todos los tickets del sistema</p>
          </div>
        </div>

        {/* Tickets Abiertos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <AlertTriangle className="w-6 h-6 text-[#5D8AA8] group-hover:text-white transition-colors" />
              </div>
              <Target className="w-5 h-5 text-[#5D8AA8]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tickets Abiertos</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsAbiertos}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeAbiertos.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Tickets Cerrados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tickets Cerrados</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsCerrados}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeCerrados.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Tiempo Promedio de Cierre */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Clock className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <BarChart3 className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tiempo Promedio</h3>
            <p className="text-3xl font-bold text-[#003366]">{tiempoPromedioCierreHoras}h</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Para cierre de tickets</p>
          </div>
        </div>

        {/* Resueltos en 24h */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#3C7299]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-[#5D8AA8] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resueltos en 24h</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsResueltosEn24Horas}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeResueltos24Horas.toFixed(1)}% de cerrados</p>
          </div>
        </div>

        {/* Resueltos en 72h */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-[#5D8AA8] group-hover:text-white transition-colors" />
              </div>
              <BarChart className="w-5 h-5 text-[#5D8AA8]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resueltos en 72h</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsResueltosEn72Horas}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeResueltos72Horas.toFixed(1)}% de cerrados</p>
          </div>
        </div>

        {/* Tickets Hoy */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Calendar className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <Target className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tickets Hoy</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsHoy}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Creados en el día de hoy</p>
          </div>
        </div>

        {/* Últimos 7 días */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Calendar className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Últimos 7 Días</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsUltimos7Dias}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Tickets creados</p>
          </div>
        </div>

        {/* Últimos 30 días */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <BarChart3 className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <BarChart className="w-5 h-5 text-[#5D8AA8]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Últimos 30 Días</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsUltimos30Dias}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Tickets creados</p>
          </div>
        </div>

        {/* Reasignaciones */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <RefreshCw className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <BarChart3 className="w-5 h-5 text-[#5D8AA8]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reasignaciones</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalReasignaciones}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeReasignados.toFixed(1)}% de tickets</p>
          </div>
        </div>

        {/* Pendientes +7 días */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Clock className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <AlertTriangle className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pendientes +7 días</h3>
            <p className="text-3xl font-bold text-[#003366]">{ticketsPendientesMas7Dias}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Tickets atrasados</p>
          </div>
        </div>

        {/* Condiciones de Cierre - Desglose detallado */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              Cerrados
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {ticketsPorCondicionCierre.map((condicion, index) => (
                <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                      {condicion.condicion.toLowerCase()}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          condicion.condicion === 'Finalizado'
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : condicion.condicion === 'Rechazado'
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600'
                        }`}
                        style={{ width: `${condicion.porcentaje}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {condicion.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Secundario - Distribuciones Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Todos los Analistas - Muestra 3 con scroll */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Users className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Todos los Analistas
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-64">
              {ticketsPorAnalista.map((analista, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{analista.analista}</p>
                      <p className="text-xs text-gray-500">{analista.tipo}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {analista.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribución por Tipo */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <PieChart className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              Distribución por Tipo
            </h3>
            <div className="space-y-3">
              {ticketsPorTipo.map((tipo, index) => (
                <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                      {tipo.tipo.toLowerCase()}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${tipo.porcentaje}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {tipo.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tiempo Promedio por Tipo */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Clock className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Tiempo por Tipo
            </h3>
            <div className="space-y-3">
              {tiempoPromedioPorTipo.map((tipo, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                      {tipo.tipo.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-16 text-right">
                    {tipo.tiempoPromedioHoras.toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets por Sistema */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Cpu className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Tickets por Sistema
            </h3>
            <div className="space-y-3">
              {ticketsPorSistema.slice(0, 5).map((sistema, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-20">
                      {sistema.sistema}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${sistema.porcentaje}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {sistema.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets por Piso - Muestra 5 con scroll */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Building className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Tickets por Piso
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-64">
              {ticketsPorPiso.slice(0, 5).map((piso, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-16">
                      {piso.piso}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${piso.porcentaje}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {piso.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets por Direcciones - Más grande para direcciones largas */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8] row-span-2">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <MapPin className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Tickets por Direcciones
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {ticketsPorArea.map((area, index) => (
                <div key={index} className="flex items-center justify-between py-3 group/item hover:bg-gray-50 rounded-lg px-3 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 break-words leading-tight">
                        {area.area}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <div className="w-16 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(area.porcentaje, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                        {area.cantidad}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipos Más Reportados (Top 10) - Muestra 5 con scroll */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Laptop className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Equipos Más Reportados (Top 10)
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-64">
              {equiposMasReportados.slice(0, 5).map((equipo, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <Cpu className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{equipo.equipo}</p>
                      <p className="text-xs text-gray-500">{equipo.tipo}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {equipo.cantidadTickets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usuarios Más Afectados (Top 10) - Muestra 5 con scroll */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <User className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Usuarios Más Afectados (Top 10)
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-64">
              {usuariosMasAfectados.slice(0, 5).map((usuario, index) => (
                <div key={index} className="flex items-center justify-between py-2 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{usuario.usuario}</p>
                      <p className="text-xs text-gray-500">{usuario.area}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                    {usuario.cantidadTickets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}