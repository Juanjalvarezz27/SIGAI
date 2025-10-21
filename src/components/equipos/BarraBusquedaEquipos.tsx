"use client"

import { useState, useCallback, useRef } from "react"
import { Search, ChevronDown, User, Hash, Barcode, AlertCircle } from "lucide-react"
import axios from "axios"
import { Equipo } from "../../../types/equipos"

interface BarraBusquedaEquiposProps {
  onEquipoSeleccionado: (equipo: Equipo) => void
  loading?: boolean
}

// Tipos de búsqueda disponibles
type TipoBusqueda = 'usuario' | 'bienNacional' | 'serial'

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
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('usuario')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [errorValidacion, setErrorValidacion] = useState("")
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Opciones de filtro
  const opcionesFiltro = [
    { 
      valor: 'usuario', 
      label: 'Usuario', 
      icono: User,
      placeholder: 'Buscar por nombre y apellido...',
      minCaracteres: 3
    },
    { 
      valor: 'bienNacional', 
      label: 'Bien Nacional', 
      icono: Hash,
      placeholder: 'Buscar por número de bien nacional...',
      minCaracteres: 3
    },
    { 
      valor: 'serial', 
      label: 'Serial', 
      icono: Barcode,
      placeholder: 'Buscar por número de serial...',
      minCaracteres: 3
    }
  ]

  const opcionSeleccionada = opcionesFiltro.find(op => op.valor === tipoBusqueda)

  // Función para validar la query
  const validarQuery = (searchQuery: string): boolean => {
    const queryLimpia = searchQuery.trim()
    
    if (queryLimpia.length === 0) {
      setErrorValidacion("")
      return false
    }

    if (queryLimpia.length < 3) {
      setErrorValidacion(`Debe escribir al menos 3 caracteres para buscar por ${opcionSeleccionada?.label.toLowerCase()}`)
      return false
    }

    setErrorValidacion("")
    return true
  }

  const buscarEquipos = useCallback(async (searchQuery: string, tipo: TipoBusqueda) => {
    if (!searchQuery.trim()) {
      setResultados([])
      setMostrarResultados(false)
      setErrorValidacion("")
      return
    }

    // Validar longitud mínima
    if (!validarQuery(searchQuery)) {
      setResultados([])
      setMostrarResultados(false)
      return
    }

    try {
      setBuscando(true)
      const response = await axios.get(`/api/equipos/buscar`, {
        params: {
          q: searchQuery,
          tipo: tipo
        }
      })
      
      // Eliminar equipos duplicados antes de mostrar los resultados
      const equiposUnicos = eliminarEquiposDuplicados(response.data.equipos || [])
      setResultados(equiposUnicos)
      setMostrarResultados(true)
    } catch (error) {
      console.error('Error buscando equipos:', error)
      setResultados([])
    } finally {
      setBuscando(false)
    }
  }, [opcionSeleccionada])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Validar en tiempo real
    if (value.trim().length > 0 && value.trim().length < 3) {
      setErrorValidacion(`Debe escribir al menos 3 caracteres para buscar por ${opcionSeleccionada?.label.toLowerCase()}`)
      setResultados([])
      setMostrarResultados(false)
      return
    } else {
      setErrorValidacion("")
    }

    // Debounce para evitar muchas llamadas a la API
    timeoutRef.current = setTimeout(() => {
      buscarEquipos(value, tipoBusqueda)
    }, 300)
  }

  const handleSeleccionarEquipo = (equipo: Equipo) => {
    onEquipoSeleccionado(equipo)
    setQuery("")
    setMostrarResultados(false)
    setResultados([])
    setErrorValidacion("")
  }

  const handleCambiarFiltro = (nuevoTipo: TipoBusqueda) => {
    setTipoBusqueda(nuevoTipo)
    setMostrarFiltros(false)
    setErrorValidacion("") // Limpiar error al cambiar filtro
    
    // Si hay una query válida, realizar búsqueda con el nuevo filtro
    if (query.trim() && query.trim().length >= 3) {
      buscarEquipos(query, nuevoTipo)
    }
    
    // Enfocar el input después de cambiar el filtro
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Selector de filtro */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            disabled={loading}
            className="flex cursor-pointer items-center mt-0.5 gap-2 px-4 py-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-between"
          >
            <div className="flex items-center gap-2">
              {opcionSeleccionada && <opcionSeleccionada.icono size={16} className="text-gray-600" />}
              <span className="text-sm font-medium text-gray-700">
                {opcionSeleccionada?.label}
              </span>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Dropdown de filtros */}
          {mostrarFiltros && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {opcionesFiltro.map((opcion) => (
                <button
                  key={opcion.valor}
                  onClick={() => handleCambiarFiltro(opcion.valor as TipoBusqueda)}
                  className={`w-full text-left cursor-pointer px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    tipoBusqueda === opcion.valor ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <opcion.icono size={16} />
                  <span className="text-sm">{opcion.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="relative flex-1 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={opcionSeleccionada?.placeholder}
            disabled={loading}
            className="w-full pl-10 pr-4 py-4  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {buscando && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de error de validación */}
      {errorValidacion && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <AlertCircle size={16} />
          <span>{errorValidacion}</span>
        </div>
      )}

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
              <div className="text-xs text-blue-600 mt-1">
                Buscado por: {opcionSeleccionada?.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarResultados && query && resultados.length === 0 && !buscando && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron equipos {opcionSeleccionada && `por ${opcionSeleccionada.label.toLowerCase()}`}
          </div>
        </div>
      )}

      {buscando && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            Buscando equipos por {opcionSeleccionada?.label.toLowerCase()}...
          </div>
        </div>
      )}

      {/* Cerrar dropdown cuando se hace click fuera */}
      {mostrarFiltros && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setMostrarFiltros(false)}
        />
      )}
    </div>
  )
}