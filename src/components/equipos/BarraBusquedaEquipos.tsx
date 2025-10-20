"use client"

import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Equipo } from "../../../types/equipos"

interface BarraBusquedaEquiposProps {
  onEquipoSeleccionado: (equipo: Equipo) => void
  loading?: boolean
}

// Función helper para eliminar equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    return `${equipo.bienNacional || 'sin-bien'}-${equipo.serial || 'sin-serial'}-${equipo.modelo.marca.nombre}-${equipo.modelo.nombre}`
  }

  const equiposUnicos = new Map()

  equipos.forEach(equipo => {
    const clave = crearClaveUnica(equipo)
    if (!equiposUnicos.has(clave)) {
      equiposUnicos.set(clave, equipo)
    }
  })

  return Array.from(equiposUnicos.values())
}

export default function BarraBusquedaEquipos({
  onEquipoSeleccionado,
  loading = false
}: BarraBusquedaEquiposProps) {
  const [query, setQuery] = useState("")
  const [resultados, setResultados] = useState<Equipo[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [buscando, setBuscando] = useState(false)

  const buscarEquipos = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResultados([])
      setMostrarResultados(false)
      return
    }

    try {
      setBuscando(true)
      const response = await fetch(`/api/equipos/buscar?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        // Eliminar equipos duplicados antes de mostrar los resultados
        const equiposUnicos = eliminarEquiposDuplicados(data.equipos || [])
        setResultados(equiposUnicos)
        setMostrarResultados(true)
      }
    } catch (error) {
      console.error('Error buscando equipos:', error)
      setResultados([])
    } finally {
      setBuscando(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounce para evitar muchas llamadas a la API
    const timeoutId = setTimeout(() => {
      buscarEquipos(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSeleccionarEquipo = (equipo: Equipo) => {
    onEquipoSeleccionado(equipo)
    setQuery("")
    setMostrarResultados(false)
    setResultados([])
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar equipos por serial, bien nacional, usuario..."
          disabled={loading}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {buscando && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map((equipo) => (
            <div
              key={equipo.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSeleccionarEquipo(equipo)}
            >
              <div className="font-medium text-gray-900">
                {equipo.tipoEquipo.nombre} - {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
              </div>
              <div className="text-sm text-gray-600">
                {equipo.serial && `Serial: ${equipo.serial} • `}
                {equipo.bienNacional && `BN: ${equipo.bienNacional}`}
                {equipo.usuario && ` • Asignado a: ${equipo.usuario.nombre} ${equipo.usuario.apellido}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarResultados && query && resultados.length === 0 && !buscando && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron equipos
          </div>
        </div>
      )}

      {buscando && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            Buscando equipos...
          </div>
        </div>
      )}
    </div>
  )
}