"use client"

import { useState } from "react"
import { Calendar, Filter, X, AlertCircle } from "lucide-react"

interface FiltroPeriodoProps {
  onFiltroChange: (fechaInicio: Date | null, fechaFin: Date | null) => void
  loading?: boolean
}

export default function FiltroPeriodo({ onFiltroChange, loading = false }: FiltroPeriodoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  const [filtroActivo, setFiltroActivo] = useState(false)
  const [fechasTemporales, setFechasTemporales] = useState({
    fechaInicioTemp: "",
    fechaFinTemp: ""
  })
  const [error, setError] = useState<string>("")

  const abrirModal = () => {
    setFechasTemporales({
      fechaInicioTemp: fechaInicio,
      fechaFinTemp: fechaFin
    })
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

  const aplicarFiltro = () => {
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

    // Aplicar el filtro
    onFiltroChange(inicio, fin)
    cerrarModal()
  }

  const limpiarFiltro = () => {
    setFechaInicio("")
    setFechaFin("")
    setFiltroActivo(false)
    onFiltroChange(null, null)
  }

  const cancelarFiltro = () => {
    cerrarModal()
  }

  const formatearFecha = (fecha: string) => {
    if (!fecha) return ""
    const [year, month, day] = fecha.split('-')
    return `${day}/${month}/${year}`
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
          <span>Filtrar por Período</span>
          {filtroActivo && (
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </button>

        {/* Badge con el rango activo */}
        {filtroActivo && (fechaInicio && fechaFin) && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
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
                {/* Fecha de inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={fechasTemporales.fechaInicioTemp}
                    onChange={(e) => setFechasTemporales(prev => ({
                      ...prev,
                      fechaInicioTemp: e.target.value
                    }))}
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
                    onChange={(e) => setFechasTemporales(prev => ({
                      ...prev,
                      fechaFinTemp: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                {/* Preview del rango */}
                {(fechasTemporales.fechaInicioTemp || fechasTemporales.fechaFinTemp) && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Período seleccionado:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {fechasTemporales.fechaInicioTemp && (
                        <p><strong>Desde:</strong> {formatearFecha(fechasTemporales.fechaInicioTemp)}</p>
                      )}
                      {fechasTemporales.fechaFinTemp && (
                        <p><strong>Hasta:</strong> {formatearFecha(fechasTemporales.fechaFinTemp)}</p>
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
                  disabled={loading || !fechasTemporales.fechaInicioTemp || !fechasTemporales.fechaFinTemp}
                  className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}