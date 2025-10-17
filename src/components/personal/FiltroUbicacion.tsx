"use client"

import { useState, useEffect } from "react"
import { Building, MapPin, Filter, X, ChevronRight, ChevronLeft } from "lucide-react"
import axios from "axios"

interface Piso {
  id: number
  piso: string
}

interface Direccion {
  id: number
  direccion: string
  pisoId: number
}

// Tipo para los filtros de ubicación
export type FiltroUbicacionTipo = 
  | { tipo: 'piso'; valor: number }
  | { tipo: 'direccion'; valor: number }
  | { tipo: 'multi-piso'; valores: number[] }
  | null

interface FiltroUbicacionProps {
  onFiltroChange: (filtro: FiltroUbicacionTipo) => void
  loading?: boolean
}

export default function FiltroUbicacion({ onFiltroChange, loading = false }: FiltroUbicacionProps) {
  const [pisos, setPisos] = useState<Piso[]>([])
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [modalAbierto, setModalAbierto] = useState<'piso' | 'direccion' | null>(null)
  const [filtroActivo, setFiltroActivo] = useState<FiltroUbicacionTipo>(null)
  const [cargandoPisos, setCargandoPisos] = useState(false)
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false)
  const [pisoSeleccionadoParaDirecciones, setPisoSeleccionadoParaDirecciones] = useState<number | null>(null)
  const [pisosSeleccionados, setPisosSeleccionados] = useState<number[]>([])

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

  // Cargar pisos al montar el componente
  useEffect(() => {
    const cargarPisos = async () => {
      try {
        setCargandoPisos(true)
        const response = await axios.get('/api/pisos')
        setPisos(response.data.pisos || [])
      } catch (error) {
        console.error('Error cargando pisos:', error)
        setPisos([])
      } finally {
        setCargandoPisos(false)
      }
    }

    cargarPisos()
  }, [])

  // Cargar direcciones cuando se selecciona un piso para el modal de direcciones
  const cargarDireccionesPorPiso = async (pisoId: number) => {
    try {
      setCargandoDirecciones(true)
      const response = await axios.get(`/api/direcciones?pisoId=${pisoId}`)
      setDirecciones(response.data.direcciones || [])
    } catch (error) {
      console.error('Error cargando direcciones:', error)
      setDirecciones([])
    } finally {
      setCargandoDirecciones(false)
    }
  }

  const handleAbrirModalDirecciones = () => {
    setModalAbierto('direccion')
    setPisoSeleccionadoParaDirecciones(null)
    setDirecciones([])
  }

  const handleAbrirModalPisos = () => {
    setModalAbierto('piso')
    // Si ya hay un filtro de múltiples pisos activo, cargar los seleccionados
    if (filtroActivo?.tipo === 'multi-piso') {
      setPisosSeleccionados(filtroActivo.valores)
    } else {
      setPisosSeleccionados([])
    }
  }

  const handleSeleccionarPisoParaDirecciones = async (pisoId: number) => {
    setPisoSeleccionadoParaDirecciones(pisoId)
    await cargarDireccionesPorPiso(pisoId)
  }

  const handleTogglePisoSeleccionado = (pisoId: number) => {
    setPisosSeleccionados(prev => {
      const nuevosPisos = prev.includes(pisoId)
        ? prev.filter(id => id !== pisoId)
        : [...prev, pisoId]
      return nuevosPisos
    })
  }

  const handleAplicarMultiplesPisos = () => {
    if (pisosSeleccionados.length > 0) {
      const nuevoFiltro: FiltroUbicacionTipo = { tipo: 'multi-piso', valores: pisosSeleccionados }
      setFiltroActivo(nuevoFiltro)
      onFiltroChange(nuevoFiltro)
      setModalAbierto(null)
    }
  }

  const handleSeleccionarPisoIndividual = (pisoId: number) => {
    const nuevoFiltro: FiltroUbicacionTipo = { tipo: 'piso', valor: pisoId }
    setFiltroActivo(nuevoFiltro)
    onFiltroChange(nuevoFiltro)
    setModalAbierto(null)
  }

  const handleSeleccionarDireccion = (direccionId: number) => {
    const nuevoFiltro: FiltroUbicacionTipo = { tipo: 'direccion', valor: direccionId }
    setFiltroActivo(nuevoFiltro)
    onFiltroChange(nuevoFiltro)
    setModalAbierto(null)
    setPisoSeleccionadoParaDirecciones(null)
  }

  const limpiarFiltro = () => {
    setFiltroActivo(null)
    onFiltroChange(null)
    setPisoSeleccionadoParaDirecciones(null)
    setPisosSeleccionados([])
  }

  const volverASeleccionPiso = () => {
    setPisoSeleccionadoParaDirecciones(null)
    setDirecciones([])
  }

  const getTextoFiltroActivo = () => {
    if (!filtroActivo) return null

    if (filtroActivo.tipo === 'piso') {
      const piso = pisos.find(p => p.id === filtroActivo.valor)
      return piso ? `Piso: ${piso.piso}` : 'Piso seleccionado'
    }

    if (filtroActivo.tipo === 'multi-piso' && filtroActivo.valores.length > 0) {
      const nombresPisos = filtroActivo.valores
        .map(id => pisos.find(p => p.id === id)?.piso)
        .filter(Boolean)
        .join(', ')
      return `Pisos: ${nombresPisos}`
    }

    if (filtroActivo.tipo === 'direccion') {
      const direccion = direcciones.find(d => d.id === filtroActivo.valor)
      return direccion ? `Dirección: ${direccion.direccion}` : 'Dirección seleccionada'
    }

    return null
  }

  const getNombrePiso = (pisoId: number) => {
    const piso = pisos.find(p => p.id === pisoId)
    return piso ? piso.piso : 'Piso'
  }

  const estaPisoSeleccionado = (pisoId: number) => {
    return pisosSeleccionados.includes(pisoId)
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Botones de filtro */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAbrirModalPisos}
            disabled={loading}
            className="flex items-center transition-all duration-200 hover:scale-105 cursor-pointer gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Building size={16} />
            <span>Filtrar por Piso(s)</span>
          </button>

          <button
            onClick={handleAbrirModalDirecciones}
            disabled={loading}
            className="flex cursor-pointer transition-all duration-200 hover:scale-105 items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin size={16} />
            <span>Filtrar por Dirección</span>
          </button>
        </div>

        {/* Filtro activo */}
        {filtroActivo && (
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

      {/* Modal para Pisos - Ahora con selección múltiple */}
      {modalAbierto === 'piso' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Seleccionar Pisos {pisosSeleccionados.length > 0 && `(${pisosSeleccionados.length} seleccionados)`}
              </h3>
              <button
                onClick={() => setModalAbierto(null)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {cargandoPisos ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  {pisos.map((piso) => (
                    <div
                      key={piso.id}
                      className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                        estaPisoSeleccionado(piso.id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={estaPisoSeleccionado(piso.id)}
                          onChange={() => handleTogglePisoSeleccionado(piso.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={estaPisoSeleccionado(piso.id) ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                          {piso.piso}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSeleccionarPisoIndividual(piso.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition-colors cursor-pointer"
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
                  onClick={() => setModalAbierto(null)}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAplicarMultiplesPisos}
                  disabled={pisosSeleccionados.length === 0}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Aplicar {pisosSeleccionados.length > 0 && `(${pisosSeleccionados.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Direcciones - Con dos pasos */}
      {modalAbierto === 'direccion' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {pisoSeleccionadoParaDirecciones && (
                  <button
                    onClick={volverASeleccionPiso}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h3 className="text-lg font-semibold text-gray-800 ">
                  {pisoSeleccionadoParaDirecciones 
                    ? `Direcciones - ${getNombrePiso(pisoSeleccionadoParaDirecciones)}`
                    : 'Seleccionar Piso para Direcciones'
                  }
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalAbierto(null)
                  setPisoSeleccionadoParaDirecciones(null)
                }}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {/* Paso 1: Seleccionar piso */}
              {!pisoSeleccionadoParaDirecciones && (
                <>
                  {cargandoPisos ? (
                    <div className="flex justify-center items-center py-8 cursor-pointer">
                      <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {pisos.map((piso) => (
                        <button
                          key={piso.id}
                          onClick={() => handleSeleccionarPisoParaDirecciones(piso.id)}
                          className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>{piso.piso}</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Paso 2: Seleccionar dirección */}
              {pisoSeleccionadoParaDirecciones && (
                <>
                  {cargandoDirecciones ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {direcciones.length > 0 ? (
                        direcciones.map((direccion) => (
                          <button
                            key={direccion.id}
                            onClick={() => handleSeleccionarDireccion(direccion.id)}
                            className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {direccion.direccion}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No hay direcciones disponibles para este piso
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}