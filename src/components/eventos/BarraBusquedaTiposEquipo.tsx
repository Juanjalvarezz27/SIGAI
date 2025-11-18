"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, Cpu } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'
import { TipoEquipo } from '../../../types/eventos'

interface BarraBusquedaTiposEquipoProps {
  onTipoEquipoSeleccionado: (tipoEquipo: TipoEquipo) => void;
  loading?: boolean;
  placeholder?: string;
  label?: string;
}

export default function BarraBusquedaTiposEquipo({
  onTipoEquipoSeleccionado,
  loading = false,
  placeholder = "Buscar tipos de equipo...",
  label = "Buscar Tipo de Equipo"
}: BarraBusquedaTiposEquipoProps) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)
  const busquedaRef = useRef<string>('')

  // Función debounced para buscar tipos de equipo
  const buscarTiposEquipo = useMemo(
    () => debounce(async (query: string) => {
      // Guardar la consulta actual
      busquedaRef.current = query

      if (!query.trim() || query.length < 2) {
        setTiposEquipo([])
        setBuscando(false)
        return
      }

      try {
        setBuscando(true)

        const response = await axios.get(`/api/equipos/tipos/buscar?q=${encodeURIComponent(query)}`)

        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setTiposEquipo(response.data.tipos || [])
        }
      } catch (error: unknown) {
        console.error('Error buscando tipos de equipo:', error)
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setTiposEquipo([])
        }
      } finally {
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setBuscando(false)
        }
      }
    }, 400),
    []
  )

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda && busqueda.length >= 2) {
      buscarTiposEquipo(busqueda)
    } else {
      // Limpiar inmediatamente cuando la búsqueda es muy corta o está vacía
      setTiposEquipo([])
      setBuscando(false)
      busquedaRef.current = '' // Resetear la referencia
    }
  }, [busqueda, buscarTiposEquipo])

  // Cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      buscarTiposEquipo.cancel()
    }
  }, [buscarTiposEquipo])

  const handleSeleccionarTipoEquipo = (tipoEquipo: TipoEquipo) => {
    onTipoEquipoSeleccionado(tipoEquipo)
    setBusqueda('')
    setTiposEquipo([])
    setBuscando(false)
    busquedaRef.current = '' // Resetear la referencia
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)

    // Si el usuario borra todo, limpiar inmediatamente
    if (value === '') {
      setTiposEquipo([])
      setBuscando(false)
      buscarTiposEquipo.cancel() // Cancelar cualquier búsqueda pendiente
      busquedaRef.current = '' // Resetear la referencia
    }
  }

  // Determinar qué mostrar
  const mostrarResultados = busqueda && busqueda.length >= 2 && !buscando && tiposEquipo.length > 0
  const mostrarNoResultados = busqueda && busqueda.length >= 2 && !buscando && tiposEquipo.length === 0
  const mostrarMensajeMinimo = busqueda && busqueda.length < 2

  return (
    <div>
      <label htmlFor="busqueda-tipos-equipo" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda-tipos-equipo"
          value={busqueda}
          onChange={handleInputChange}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
          placeholder={placeholder}
          disabled={loading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Mensaje de mínimo caracteres - SOLO cuando hay texto pero menos de 2 caracteres */}
      {mostrarMensajeMinimo && (
        <p className="mt-2 text-sm text-gray-500">
          Escribe al menos 2 caracteres para buscar
        </p>
      )}

      {/* Loader de búsqueda - SOLO se muestra cuando está buscando activamente */}
      {buscando && (
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Lista de resultados - SOLO se muestra cuando hay resultados y no está buscando */}
      {mostrarResultados && (
        <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-lg">
          {tiposEquipo.map(tipoEquipo => (
            <div
              key={tipoEquipo.id}
              onClick={() => handleSeleccionarTipoEquipo(tipoEquipo)}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {tipoEquipo.nombre}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de no resultados - SOLO se muestra cuando hay búsqueda válida pero no hay resultados */}
      {mostrarNoResultados && (
        <div className="mt-2 text-center text-gray-500 py-4 border border-gray-200 rounded-md">
          No se encontraron tipos de equipo
        </div>
      )}
    </div>
  )
}