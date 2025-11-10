"use client"

import { useState } from "react"
import { Calendar, Filter, X, AlertCircle, Clock } from "lucide-react"

interface FiltroPeriodoProps {
  onFiltroChange: (fechaInicio: Date | null, fechaFin: Date | null) => void
  loading?: boolean
}

type PeriodoPredefinido = '1semana' | '1mes' | '6meses' | '1año' | 'personalizado'

export default function FiltroPeriodo({ onFiltroChange, loading = false }: FiltroPeriodoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  const [filtroActivo, setFiltroActivo] = useState(false)
  const [periodoActivo, setPeriodoActivo] = useState<PeriodoPredefinido | null>(null)
  const [fechasTemporales, setFechasTemporales] = useState({
    fechaInicioTemp: "",
    fechaFinTemp: ""
  })
  const [periodoTemporal, setPeriodoTemporal] = useState<PeriodoPredefinido | null>(null)
  const [error, setError] = useState<string>("")

  const abrirModal = () => {
    setFechasTemporales({
      fechaInicioTemp: fechaInicio,
      fechaFinTemp: fechaFin
    })
    setPeriodoTemporal(periodoActivo)
    setError("")
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setError("")
  }

  const mostrarError = (mensaje: string) => {
    setError(mensaje)
    setTimeout(() => setError(""), 5000)
  }

  const calcularFechasPorPeriodo = (periodo: PeriodoPredefinido): { inicio: Date; fin: Date } => {
    const ahora = new Date()
    const fin = new Date(ahora)
    fin.setHours(23, 59, 59, 999)

    let inicio = new Date()

    switch (periodo) {
      case '1semana':
        inicio = new Date(ahora)
        inicio.setDate(ahora.getDate() - 7)
        break
      case '1mes':
        inicio = new Date(ahora)
        inicio.setMonth(ahora.getMonth() - 1)
        break
      case '6meses':
        inicio = new Date(ahora)
        inicio.setMonth(ahora.getMonth() - 6)
        break
      case '1año':
        inicio = new Date(ahora)
        inicio.setFullYear(ahora.getFullYear() - 1)
        break
      default:
        inicio = new Date(ahora)
        inicio.setDate(ahora.getDate() - 7) // Por defecto 1 semana
    }

    inicio.setHours(0, 0, 0, 0)
    return { inicio, fin }
  }

  const formatearFechaParaInput = (fecha: Date): string => {
    return fecha.toISOString().split('T')[0]
  }

  const aplicarPeriodoPredefinido = (periodo: PeriodoPredefinido) => {
    // Si ya está seleccionado, deseleccionarlo
    if (periodoTemporal === periodo) {
      setFechasTemporales({
        fechaInicioTemp: "",
        fechaFinTemp: ""
      })
      setPeriodoTemporal(null)
      return
    }

    const { inicio, fin } = calcularFechasPorPeriodo(periodo)
    
    setFechasTemporales({
      fechaInicioTemp: formatearFechaParaInput(inicio),
      fechaFinTemp: formatearFechaParaInput(fin)
    })
    setPeriodoTemporal(periodo)
  }

  const aplicarFiltro = () => {
    // Si no hay período seleccionado y no hay fechas manuales, QUITAR el filtro
    if (!periodoTemporal && (!fechasTemporales.fechaInicioTemp || !fechasTemporales.fechaFinTemp)) {
      limpiarFiltro()
      return
    }

    // Si hay un período predefinido seleccionado, usar esas fechas
    if (periodoTemporal && periodoTemporal !== 'personalizado') {
      const { inicio, fin } = calcularFechasPorPeriodo(periodoTemporal)
      
      // Actualizar las fechas principales
      setFechaInicio(formatearFechaParaInput(inicio))
      setFechaFin(formatearFechaParaInput(fin))
      setFiltroActivo(true)
      setPeriodoActivo(periodoTemporal)

      // Aplicar el filtro
      onFiltroChange(inicio, fin)
      cerrarModal()
      return
    }

    // Si es personalizado, validar las fechas manuales
    if (!fechasTemporales.fechaInicioTemp || !fechasTemporales.fechaFinTemp) {
      mostrarError("Por favor selecciona ambas fechas")
      return
    }

    const inicio = new Date(fechasTemporales.fechaInicioTemp + 'T00:00:00')
    const fin = new Date(fechasTemporales.fechaFinTemp + 'T23:59:59.999')

    if (inicio > fin) {
      mostrarError("La fecha de inicio no puede ser mayor a la fecha final")
      return
    }

    // Actualizar las fechas principales
    setFechaInicio(fechasTemporales.fechaInicioTemp)
    setFechaFin(fechasTemporales.fechaFinTemp)
    setFiltroActivo(true)
    setPeriodoActivo('personalizado')

    // Aplicar el filtro
    onFiltroChange(inicio, fin)
    cerrarModal()
  }

  const limpiarFiltro = () => {
    setFechaInicio("")
    setFechaFin("")
    setFiltroActivo(false)
    setPeriodoActivo(null)
    setFechasTemporales({
      fechaInicioTemp: "",
      fechaFinTemp: ""
    })
    setPeriodoTemporal(null)
    onFiltroChange(null, null)
    cerrarModal()
  }

  const cancelarFiltro = () => {
    cerrarModal()
  }

  const formatearFecha = (fecha: string) => {
    if (!fecha) return ""
    const [year, month, day] = fecha.split('-')
    return `${day}/${month}/${year}`
  }

  const getTextoPeriodo = (periodo: PeriodoPredefinido | null): string => {
    if (!periodo) return ""
    
    switch (periodo) {
      case '1semana': return '1 semana'
      case '1mes': return '1 mes'
      case '6meses': return '6 meses'
      case '1año': return '1 año'
      case 'personalizado': return 'Personalizado'
      default: return ''
    }
  }

  const handleCambioFechaManual = () => {
    setPeriodoTemporal('personalizado')
  }

  const getTextoBoton = () => {
    if (filtroActivo && periodoActivo) {
      return `Período: ${getTextoPeriodo(periodoActivo)}`
    }
    return "Filtrar por Período"
  }

  return (
    <>
      {/* Botón del filtro */}
      <div className="relative">
        <button
          onClick={abrirModal}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-4 rounded-lg border transition-colors cursor-pointer font-medium ${
            filtroActivo
              ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Calendar className="w-4 h-4" />
          <span>{getTextoBoton()}</span>
          {filtroActivo && (
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </button>

        {/* Badge con el rango activo - Solo mostrar si hay fechas personalizadas sin período */}
        {filtroActivo && periodoActivo === 'personalizado' && fechaInicio && fechaFin && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
            {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtrar por Período
              </h3>
              <button
                onClick={cancelarFiltro}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 p-6">
              {/* Mensaje de error */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Períodos predefinidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Períodos Predefinidos
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => aplicarPeriodoPredefinido('1semana')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        periodoTemporal === '1semana'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">1 Semana</span>
                    </button>

                    <button
                      onClick={() => aplicarPeriodoPredefinido('1mes')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        periodoTemporal === '1mes'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">1 Mes</span>
                    </button>

                    <button
                      onClick={() => aplicarPeriodoPredefinido('6meses')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        periodoTemporal === '6meses'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">6 Meses</span>
                    </button>

                    <button
                      onClick={() => aplicarPeriodoPredefinido('1año')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        periodoTemporal === '1año'
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">1 Año</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período Personalizado
                  </label>
                  
                  {/* Fecha de inicio */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      value={fechasTemporales.fechaInicioTemp}
                      onChange={(e) => {
                        setFechasTemporales(prev => ({
                          ...prev,
                          fechaInicioTemp: e.target.value
                        }))
                        handleCambioFechaManual()
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {/* Fecha de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      value={fechasTemporales.fechaFinTemp}
                      onChange={(e) => {
                        setFechasTemporales(prev => ({
                          ...prev,
                          fechaFinTemp: e.target.value
                        }))
                        handleCambioFechaManual()
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Preview del rango */}
                {(fechasTemporales.fechaInicioTemp || fechasTemporales.fechaFinTemp || periodoTemporal) && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Período seleccionado:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {periodoTemporal && periodoTemporal !== 'personalizado' ? (
                        <p><strong>Período:</strong> {getTextoPeriodo(periodoTemporal)}</p>
                      ) : (
                        <>
                          {fechasTemporales.fechaInicioTemp && (
                            <p><strong>Desde:</strong> {formatearFecha(fechasTemporales.fechaInicioTemp)}</p>
                          )}
                          {fechasTemporales.fechaFinTemp && (
                            <p><strong>Hasta:</strong> {formatearFecha(fechasTemporales.fechaFinTemp)}</p>
                          )}
                          {!fechasTemporales.fechaInicioTemp && !fechasTemporales.fechaFinTemp && (
                            <p className="text-blue-600">Ningún período seleccionado</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={limpiarFiltro}
                disabled={loading || !filtroActivo}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                Limpiar Filtro
              </button>

              <div className="flex gap-3">
                <button
                  onClick={cancelarFiltro}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={aplicarFiltro}
                  disabled={loading}
                  className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                >
                  {periodoTemporal || (fechasTemporales.fechaInicioTemp && fechasTemporales.fechaFinTemp) ? 'Aplicar Filtro' : 'Quitar Filtro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}