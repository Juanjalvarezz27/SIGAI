"use client"

import { useState, useEffect } from "react"
import { Cpu, Filter, X } from "lucide-react"
import axios from "axios"
import { TipoEquipo } from "../../../types/equipos"

interface FiltroTipoEquipoProps {
  tiposSeleccionados: string[]
  onTiposChange: (tipos: string[]) => void
  loading?: boolean
}

export default function FiltroTipoEquipo({
  tiposSeleccionados,
  onTiposChange,
  loading = false
}: FiltroTipoEquipoProps) {
  const [tipos, setTipos] = useState<TipoEquipo[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargandoTipos, setCargandoTipos] = useState(false)
  const [tiposSeleccionadosModal, setTiposSeleccionadosModal] = useState<string[]>([])

  // Cargar tipos al montar el componente
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        setCargandoTipos(true)
        const response = await axios.get('/api/equipos/tipos')
        setTipos(response.data.tipos || [])
      } catch (error) {
        console.error('Error cargando tipos de equipo:', error)
        setTipos([])
      } finally {
        setCargandoTipos(false)
      }
    }

    cargarTipos()
  }, [])

  // Efecto para controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (modalAbierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [modalAbierto])

  // Sincronizar selección del modal con props
  useEffect(() => {
    setTiposSeleccionadosModal(tiposSeleccionados)
  }, [tiposSeleccionados, modalAbierto])

  const handleAbrirModal = () => {
    setModalAbierto(true)
  }

  const handleToggleTipoSeleccionado = (tipoId: string) => {
    setTiposSeleccionadosModal(prev => {
      const nuevosTipos = prev.includes(tipoId)
        ? prev.filter(id => id !== tipoId)
        : [...prev, tipoId]
      return nuevosTipos
    })
  }

  const handleAplicarFiltro = () => {
    onTiposChange(tiposSeleccionadosModal)
    setModalAbierto(false)
  }

  const limpiarFiltro = () => {
    setTiposSeleccionadosModal([])
    onTiposChange([])
    setModalAbierto(false)
  }

  const handleSeleccionarIndividual = (tipoId: string) => {
    onTiposChange([tipoId])
    setModalAbierto(false)
  }

  const estaTipoSeleccionado = (tipoId: string) => {
    return tiposSeleccionadosModal.includes(tipoId)
  }

  const getTextoFiltroActivo = () => {
    if (tiposSeleccionados.length === 0) return null

    if (tiposSeleccionados.length === 1) {
      const tipo = tipos.find(t => t.id.toString() === tiposSeleccionados[0])
      return tipo ? `Tipo: ${tipo.nombre}` : 'Tipo seleccionado'
    }

    const nombresTipos = tiposSeleccionados
      .map(id => tipos.find(t => t.id.toString() === id)?.nombre)
      .filter(Boolean)
      .join(', ')
    return `Tipos: ${nombresTipos} (${tiposSeleccionados.length})`
  }

  const getNombreTipo = (tipoId: string) => {
    const tipo = tipos.find(t => t.id.toString() === tipoId)
    return tipo ? tipo.nombre : 'Tipo'
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Botón de filtro */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAbrirModal}
            disabled={loading}
            className="flex items-center transition-all duration-200 hover:scale-105 cursor-pointer gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Cpu size={16} />
            <span>Filtrar por Tipo(s) de Equipo</span>
          </button>
        </div>

        {/* Filtro activo */}
        {tiposSeleccionados.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
            <Filter size={16} className="text-blue-600" />
            <span className="text-blue-700 text-sm">{getTextoFiltroActivo()}</span>
            <button
              onClick={limpiarFiltro}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal para Tipos de Equipo - Selección múltiple */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col"> {/* Cambiado a max-w-4xl para más ancho */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Seleccionar Tipos de Equipo {tiposSeleccionadosModal.length > 0 && `(${tiposSeleccionadosModal.length} seleccionados)`}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {cargandoTipos ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
                  {tipos.map((tipo) => (
                    <div
                      key={tipo.id}
                      className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                        estaTipoSeleccionado(tipo.id.toString())
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={estaTipoSeleccionado(tipo.id.toString())}
                          onChange={() => handleToggleTipoSeleccionado(tipo.id.toString())}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={estaTipoSeleccionado(tipo.id.toString()) ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                          {tipo.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSeleccionarIndividual(tipo.id.toString())}
                        className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Solo este
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con botones de acción */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={limpiarFiltro}
                className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpiar
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAplicarFiltro}
                  disabled={tiposSeleccionadosModal.length === 0}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Aplicar {tiposSeleccionadosModal.length > 0 && `(${tiposSeleccionadosModal.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}