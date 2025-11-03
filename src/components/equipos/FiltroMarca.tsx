"use client"

import { useState, useEffect } from "react"
import { Filter, X, Check, Search } from "lucide-react"
import axios from "axios"

interface Marca {
  id: number
  nombre: string
}

interface FiltroMarcaProps {
  marcaSeleccionada: string
  onMarcaChange: (marcaId: string) => void
  loading?: boolean
}

export default function FiltroMarca({
  marcaSeleccionada,
  onMarcaChange,
  loading = false
}: FiltroMarcaProps) {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [marcasFiltradas, setMarcasFiltradas] = useState<Marca[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargandoMarcas, setCargandoMarcas] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [marcaSeleccionadaModal, setMarcaSeleccionadaModal] = useState<string>("")
  const [terminoBusqueda, setTerminoBusqueda] = useState("")

  // Cargar marcas al montar el componente
  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        setCargandoMarcas(true)
        const response = await axios.get('/api/equipos/marcas')
        setMarcas(response.data.marcas || [])
        setMarcasFiltradas(response.data.marcas || [])
      } catch (error) {
        console.error('Error cargando marcas:', error)
        setMarcas([])
        setMarcasFiltradas([])
      } finally {
        setCargandoMarcas(false)
      }
    }

    cargarMarcas()
  }, [])

  // Buscar marcas cuando cambie el término de búsqueda
  useEffect(() => {
    const buscarMarcas = async () => {
      if (!terminoBusqueda.trim()) {
        // Si no hay término de búsqueda, mostrar todas las marcas
        setMarcasFiltradas(marcas)
        return
      }

      try {
        setBuscando(true)
        const response = await axios.get(`/api/equipos/marcas/buscar?q=${encodeURIComponent(terminoBusqueda)}`)
        setMarcasFiltradas(response.data.marcas || [])
      } catch (error) {
        console.error('Error buscando marcas:', error)
        setMarcasFiltradas([])
      } finally {
        setBuscando(false)
      }
    }

    const timeoutId = setTimeout(buscarMarcas, 300) // Debounce de 300ms
    return () => clearTimeout(timeoutId)
  }, [terminoBusqueda, marcas])

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
    setMarcaSeleccionadaModal(marcaSeleccionada)
  }, [marcaSeleccionada, modalAbierto])

  // Resetear búsqueda cuando se abre/cierra el modal
  useEffect(() => {
    if (modalAbierto) {
      setTerminoBusqueda("")
      setMarcasFiltradas(marcas)
    }
  }, [modalAbierto, marcas])

  const handleAbrirModal = () => {
    setModalAbierto(true)
  }

  const handleSeleccionarMarca = (marcaId: string) => {
    setMarcaSeleccionadaModal(marcaId)
  }

  const handleAplicarFiltro = () => {
    onMarcaChange(marcaSeleccionadaModal)
    setModalAbierto(false)
  }

  const limpiarFiltro = () => {
    setMarcaSeleccionadaModal("")
    onMarcaChange("")
    setModalAbierto(false)
  }

  const handleLimpiarBusqueda = () => {
    setTerminoBusqueda("")
    setMarcasFiltradas(marcas)
  }

  const getTextoFiltroActivo = () => {
    if (!marcaSeleccionada) return null

    const marca = marcas.find(m => m.id.toString() === marcaSeleccionada)
    return marca ? marca.nombre : 'Marca seleccionada'
  }

  const getNombreMarca = (marcaId: string) => {
    const marca = marcas.find(m => m.id.toString() === marcaId)
    return marca ? marca.nombre : 'Marca'
  }

  return (
    <div className="mb-4">
      {/* Botón de filtro */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAbrirModal}
          disabled={loading}
          className="flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <Filter size={16} />
          <span>Filtrar por Marca</span>
        </button>

        {/* Filtro activo - Ahora debajo del botón */}
        {marcaSeleccionada && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md w-fit">
            <Filter size={14} className="text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">
              Marca: {getTextoFiltroActivo()}
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

      {/* Modal para Marcas */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Seleccionar Marca
                {marcaSeleccionadaModal && ` - ${getNombreMarca(marcaSeleccionadaModal)}`}
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
                  placeholder="Buscar marca..."
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
              {cargandoMarcas ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Opción "Todas las marcas" */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer ${
                      marcaSeleccionadaModal === ""
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                    onClick={() => handleSeleccionarMarca("")}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        marcaSeleccionadaModal === "" 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {marcaSeleccionadaModal === "" && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className={marcaSeleccionadaModal === "" ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                        Todas las marcas
                      </span>
                    </div>
                  </div>

                  {/* Estado de búsqueda */}
                  {buscando && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Lista de marcas en 2 columnas */}
                  {!buscando && (
                    <>
                      {marcasFiltradas.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No se encontraron marcas
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {marcasFiltradas.map((marca) => (
                            <div
                              key={marca.id}
                              className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer ${
                                marcaSeleccionadaModal === marca.id.toString()
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'hover:bg-gray-100 border border-transparent'
                              }`}
                              onClick={() => handleSeleccionarMarca(marca.id.toString())}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  marcaSeleccionadaModal === marca.id.toString() 
                                    ? 'bg-blue-600 border-blue-600' 
                                    : 'border-gray-300'
                                }`}>
                                  {marcaSeleccionadaModal === marca.id.toString() && (
                                    <Check size={12} className="text-white" />
                                  )}
                                </div>
                                <span className={marcaSeleccionadaModal === marca.id.toString() ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                                  {marca.nombre}
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
                {marcasFiltradas.length} {marcasFiltradas.length === 1 ? 'marca encontrada' : 'marcas encontradas'}
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