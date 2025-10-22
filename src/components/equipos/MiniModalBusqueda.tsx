"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { X, Search, Plus } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'

interface Item {
  id: number
  nombre: string
}

interface MiniModalBusquedaProps {
  isOpen: boolean
  onClose: () => void
  onSeleccionar: (item: Item | "otro", nombre?: string) => void
  tipo: "marca" | "modelo"
  marcaId?: number // Solo necesario para modelos
  valorActual?: string
  esMarcaNueva?: boolean // Nueva prop para indicar si es una marca recién creada
}

export default function MiniModalBusqueda({
  isOpen,
  onClose,
  onSeleccionar,
  tipo,
  marcaId,
  valorActual,
  esMarcaNueva = false // Por defecto false
}: MiniModalBusquedaProps) {
  const [busqueda, setBusqueda] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [cargando, setCargando] = useState(false)
  const [esPrimeraCarga, setEsPrimeraCarga] = useState(true)
  const [mostrarInputModelo, setMostrarInputModelo] = useState(false)
  const [nombreModelo, setNombreModelo] = useState("")

  // Función para buscar items
  const buscarItems = useCallback(async (query: string) => {
    if (!query.trim()) {
      setItems([])
      setCargando(false)
      return
    }

    try {
      setCargando(true)

      if (tipo === "marca") {
        const response = await axios.get(`/api/equipos/marcas/buscar?q=${encodeURIComponent(query)}`)
        setItems(response.data.marcas || [])
      } else if (tipo === "modelo" && marcaId) {
        const response = await axios.get(`/api/equipos/modelos/buscar?q=${encodeURIComponent(query)}&marcaId=${marcaId}`)
        setItems(response.data.modelos || [])
      }
    } catch (error) {
      console.error(`Error buscando ${tipo}s:`, error)
      setItems([])
    } finally {
      setCargando(false)
    }
  }, [tipo, marcaId])

  // Función debounced para buscar
  const buscarItemsDebounced = useMemo(
    () => debounce(buscarItems, 500),
    [buscarItems]
  )

  // Cargar items iniciales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setBusqueda("")
      setItems([])
      setEsPrimeraCarga(true)
      setMostrarInputModelo(false)
      setNombreModelo("")

      // Para modelos: solo cargar automáticamente si NO es una marca nueva
      if (tipo === "modelo" && marcaId && !esMarcaNueva) {
        cargarModelosPorMarca()
      }

      // Si hay un valor actual, mostrarlo en la búsqueda (solo para marcas)
      if (valorActual && tipo === "marca") {
        setBusqueda(valorActual)
        if (valorActual.length >= 2) {
          buscarItemsDebounced(valorActual)
        }
      }
    }
  }, [isOpen, valorActual, buscarItemsDebounced, tipo, marcaId, esMarcaNueva])

  // Función para cargar todos los modelos de una marca específica
  const cargarModelosPorMarca = async () => {
    if (!marcaId) return

    try {
      setCargando(true)
      const response = await axios.get(`/api/equipos/modelos/buscar?marcaId=${marcaId}`)
      setItems(response.data.modelos || [])
      setEsPrimeraCarga(false)
    } catch (error) {
      console.error('Error cargando modelos:', error)
      setItems([])
      setEsPrimeraCarga(false)
    } finally {
      setCargando(false)
    }
  }

  // Efecto para buscar cuando cambia la búsqueda (solo para marcas)
  useEffect(() => {
    if (tipo === "marca" && busqueda && busqueda.length >= 2) {
      buscarItemsDebounced(busqueda)
    } else if (tipo === "marca") {
      // Si la búsqueda está vacía o tiene menos de 2 caracteres, limpiar items
      setItems([])
    }
  }, [busqueda, buscarItemsDebounced, tipo])

  // Cleanup del debounce
  useEffect(() => {
    return () => {
      buscarItemsDebounced.cancel()
    }
  }, [buscarItemsDebounced])

  const handleSeleccionarItem = (item: Item) => {
    onSeleccionar(item)
    onClose()
  }

  const handleCrearNuevo = () => {
    if (tipo === "modelo" && esMarcaNueva) {
      // Para modelos de marcas nuevas, mostrar input en lugar de cerrar
      setMostrarInputModelo(true)
    } else if (busqueda.trim()) {
      // Si hay texto en la búsqueda, pasar el nombre para crear nuevo
      onSeleccionar("otro", busqueda.trim())
      onClose()
    } else {
      // Si no hay texto, simplemente permitir escribir manualmente
      onSeleccionar("otro", "")
      onClose()
    }
  }

  const handleGuardarModelo = () => {
    if (nombreModelo.trim()) {
      onSeleccionar("otro", nombreModelo.trim())
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.key === 'Enter' && busqueda.trim() && !mostrarInputModelo) {
      handleCrearNuevo()
    }
    if (e.key === 'Enter' && mostrarInputModelo && nombreModelo.trim()) {
      handleGuardarModelo()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-h-[80vh] flex flex-col"
        onKeyDown={handleKeyPress}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {tipo === "marca" ? "Seleccionar Marca" : "Seleccionar Modelo"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Barra de búsqueda (SOLO para marcas) */}
          {tipo === "marca" && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                placeholder="Buscar marcas..."
                autoFocus
              />
            </div>
          )}

          {/* Para modelos, mostrar información de la marca seleccionada */}
          {tipo === "modelo" && marcaId && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {esMarcaNueva 
                  ? "Marca nueva - Crea el primer modelo para esta marca"
                  : "Mostrando modelos para la marca seleccionada"
                }
              </p>
            </div>
          )}

          {/* Input para escribir modelo nuevo (solo para marcas nuevas) */}
          {mostrarInputModelo && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3">Crear nuevo modelo</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={nombreModelo}
                  onChange={(e) => setNombreModelo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  placeholder="Escribe el nombre del modelo..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGuardarModelo}
                    disabled={!nombreModelo.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar Modelo
                  </button>
                  <button
                    onClick={() => setMostrarInputModelo(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botón para crear nuevo - Solo mostrar si no está mostrando el input */}
          {!mostrarInputModelo && (
            <button
              onClick={handleCrearNuevo}
              className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors mb-4"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <span className="font-medium text-green-800 block">
                    {busqueda.trim()
                      ? `Usar "${busqueda}" como nuevo ${tipo}`
                      : tipo === "modelo" && esMarcaNueva
                        ? "Crear nuevo modelo"
                        : `Crear nuevo ${tipo}`
                    }
                  </span>
                  <p className="text-sm text-green-600 mt-1">
                    {busqueda.trim()
                      ? `El ${tipo} se guardará como "${busqueda}"`
                      : tipo === "marca" 
                        ? "Escribe el nombre de la nueva marca arriba"
                        : tipo === "modelo" && esMarcaNueva
                          ? "Haz click aquí para escribir el nombre del modelo"
                          : "Escribe el nombre del nuevo modelo en el formulario"
                    }
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Mensaje de mínimo caracteres para búsqueda (solo marcas) */}
          {tipo === "marca" && busqueda && busqueda.length < 2 && !mostrarInputModelo && (
            <p className="text-sm text-gray-500 text-center py-2">
              Escribe al menos 2 caracteres para buscar en la base de datos
            </p>
          )}

          {/* Loader */}
          {cargando && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Lista de resultados - SOLO mostrar si hay items y no está mostrando input */}
          {!cargando && items.length > 0 && !mostrarInputModelo && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-700 mb-3">
                {tipo === "marca" ? "Marcas existentes:" : "Modelos existentes para esta marca:"}
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSeleccionarItem(item)}
                    className="w-full text-left p-3 hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{item.nombre}</span>
                      <div className="w-2 h-2 bg-[#001F3F] rounded-full"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje de no resultados para marcas */}
          {tipo === "marca" && !cargando && busqueda.length >= 2 && items.length === 0 && !mostrarInputModelo && (
            <div className="text-center py-4 border-t border-gray-200">
              <p className="text-gray-500">
                No se encontraron marcas con {busqueda}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Usa el botón verde arriba para crear una nueva
              </p>
            </div>
          )}

          {/* Mensaje cuando no hay modelos para la marca seleccionada - SOLO si NO es marca nueva */}
          {tipo === "modelo" && !cargando && items.length === 0 && !esMarcaNueva && !esPrimeraCarga && !mostrarInputModelo && (
            <div className="text-center py-4 border-t border-gray-200">
              <p className="text-gray-500">
                No hay modelos existentes para esta marca
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Usa el botón verde arriba para crear un nuevo modelo
              </p>
            </div>
          )}

          {/* Mensaje especial para marcas nuevas - SOLO si no está mostrando input */}
          {tipo === "modelo" && esMarcaNueva && !mostrarInputModelo && (
            <div className="text-center py-4 border-t border-gray-200">
              <p className="text-gray-500">
                Esta es una marca nueva
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Crea el primer modelo usando el botón verde arriba
              </p>
            </div>
          )}
        </div>

        {/* Footer - Solo mostrar si no está mostrando input */}
        {!mostrarInputModelo && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}