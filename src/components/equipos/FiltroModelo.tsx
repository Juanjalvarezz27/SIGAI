"use client"

import { useState, useEffect } from "react"
import { Filter, X, Check, Search } from "lucide-react"
import axios from "axios"

interface Modelo {
  id: number
  nombre: string
  marcaId: number
}

interface FiltroModeloProps {
  marcaSeleccionada: string
  modeloSeleccionado: string
  onModeloChange: (modeloId: string) => void
  loading?: boolean
}

export default function FiltroModelo({
  marcaSeleccionada,
  modeloSeleccionado,
  onModeloChange,
  loading = false
}: FiltroModeloProps) {
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [modelosFiltrados, setModelosFiltrados] = useState<Modelo[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargandoModelos, setCargandoModelos] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [modeloSeleccionadoModal, setModeloSeleccionadoModal] = useState<string>("")
  const [terminoBusqueda, setTerminoBusqueda] = useState("")

  // Cargar modelos cuando cambie la marca seleccionada
  useEffect(() => {
    const cargarModelos = async () => {
      if (!marcaSeleccionada) {
        setModelos([])
        setModelosFiltrados([])
        return
      }

      try {
        setCargandoModelos(true)
        const response = await axios.get(`/api/equipos/modelos?marcaId=${marcaSeleccionada}`)
        setModelos(response.data.modelos || [])
        setModelosFiltrados(response.data.modelos || [])
      } catch (error) {
        console.error('Error cargando modelos:', error)
        setModelos([])
        setModelosFiltrados([])
      } finally {
        setCargandoModelos(false)
      }
    }

    cargarModelos()
  }, [marcaSeleccionada])

  // Buscar modelos cuando cambie el término de búsqueda
  useEffect(() => {
    const buscarModelos = async () => {
      if (!marcaSeleccionada) return

      if (!terminoBusqueda.trim()) {
        // Si no hay término de búsqueda, mostrar todos los modelos
        setModelosFiltrados(modelos)
        return
      }

      try {
        setBuscando(true)
        const response = await axios.get(`/api/equipos/modelos/buscar?q=${encodeURIComponent(terminoBusqueda)}&marcaId=${marcaSeleccionada}`)
        setModelosFiltrados(response.data.modelos || [])
      } catch (error) {
        console.error('Error buscando modelos:', error)
        setModelosFiltrados([])
      } finally {
        setBuscando(false)
      }
    }

    const timeoutId = setTimeout(buscarModelos, 300) // Debounce de 300ms
    return () => clearTimeout(timeoutId)
  }, [terminoBusqueda, modelos, marcaSeleccionada])

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
    setModeloSeleccionadoModal(modeloSeleccionado)
  }, [modeloSeleccionado, modalAbierto])

  // Resetear búsqueda cuando se abre/cierra el modal
  useEffect(() => {
    if (modalAbierto) {
      setTerminoBusqueda("")
      setModelosFiltrados(modelos)
    }
  }, [modalAbierto, modelos])

  const handleAbrirModal = () => {
    setModalAbierto(true)
  }

  const handleSeleccionarModelo = (modeloId: string) => {
    setModeloSeleccionadoModal(modeloId)
  }

  const handleAplicarFiltro = () => {
    onModeloChange(modeloSeleccionadoModal)
    setModalAbierto(false)
  }

  const limpiarFiltro = () => {
    setModeloSeleccionadoModal("")
    onModeloChange("")
    setModalAbierto(false)
  }

  const handleLimpiarBusqueda = () => {
    setTerminoBusqueda("")
    setModelosFiltrados(modelos)
  }

  const getTextoFiltroActivo = () => {
    if (!modeloSeleccionado) return null

    const modelo = modelos.find(m => m.id.toString() === modeloSeleccionado)
    return modelo ? modelo.nombre : 'Modelo seleccionado'
  }

  const getNombreModelo = (modeloId: string) => {
    const modelo = modelos.find(m => m.id.toString() === modeloId)
    return modelo ? modelo.nombre : 'Modelo'
  }

  const estaDeshabilitado = !marcaSeleccionada

  return (
    <div className="mb-4">
      {/* Botón de filtro */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAbrirModal}
          disabled={loading || estaDeshabilitado}
          className={`flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${
            estaDeshabilitado ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Filter size={16} />
          <span>
            {estaDeshabilitado ? 'Seleccione una marca' : 'Filtrar por Modelo'}
          </span>
        </button>

        {/* Filtro activo - Ahora debajo del botón */}
        {modeloSeleccionado && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md w-fit">
            <Filter size={14} className="text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">
              Modelo: {getTextoFiltroActivo()}
            </span>
            <button
              onClick={limpiarFiltro}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer ml-1"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal para Modelos */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Seleccionar Modelo
                {modeloSeleccionadoModal && ` - ${getNombreModelo(modeloSeleccionadoModal)}`}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {terminoBusqueda && (
                  <button
                    onClick={handleLimpiarBusqueda}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {cargandoModelos ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Opción "Todos los modelos" */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer ${
                      modeloSeleccionadoModal === ""
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                    onClick={() => handleSeleccionarModelo("")}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        modeloSeleccionadoModal === "" 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {modeloSeleccionadoModal === "" && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className={modeloSeleccionadoModal === "" ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                        Todos los modelos
                      </span>
                    </div>
                  </div>

                  {/* Estado de búsqueda */}
                  {buscando && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Lista de modelos en 2 columnas */}
                  {!buscando && (
                    <>
                      {modelosFiltrados.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          {terminoBusqueda ? 'No se encontraron modelos con ese nombre' : 'No hay modelos disponibles para esta marca'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {modelosFiltrados.map((modelo) => (
                            <div
                              key={modelo.id}
                              className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer ${
                                modeloSeleccionadoModal === modelo.id.toString()
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                              onClick={() => handleSeleccionarModelo(modelo.id.toString())}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  modeloSeleccionadoModal === modelo.id.toString() 
                                    ? 'bg-blue-600 border-blue-600' 
                                    : 'border-gray-300'
                                }`}>
                                  {modeloSeleccionadoModal === modelo.id.toString() && (
                                    <Check size={12} className="text-white" />
                                  )}
                                </div>
                                <span className={modeloSeleccionadoModal === modelo.id.toString() ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                                  {modelo.nombre}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer con botones de acción */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {modelosFiltrados.length} {modelosFiltrados.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={limpiarFiltro}
                  className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAplicarFiltro}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}