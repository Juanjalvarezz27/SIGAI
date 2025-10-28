"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Search, ChevronDown, User, Hash, X } from "lucide-react"
import { Ticket } from "../../../types/ticket"

interface BarraBusquedaTicketsProps {
  onResultadosChange: (tickets: Ticket[]) => void
  tickets: Ticket[]
  loading?: boolean
}

type TipoBusqueda = 'usuario' | 'id'

export default function BarraBusquedaTickets({
  onResultadosChange,
  tickets,
  loading = false
}: BarraBusquedaTicketsProps) {
  const [query, setQuery] = useState("")
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('usuario')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Opciones de filtro
  const opcionesFiltro = [
    {
      valor: 'usuario',
      label: 'Usuario Afectado',
      icono: User,
      placeholder: 'Buscar por nombre de usuario afectado...'
    },
    {
      valor: 'id',
      label: 'Número de Ticket',
      icono: Hash,
      placeholder: 'Buscar por número de ticket...'
    }
  ]

  const opcionSeleccionada = opcionesFiltro.find(op => op.valor === tipoBusqueda)

  // Función de búsqueda memorizada
  const buscarTickets = useCallback((searchQuery: string, searchType: TipoBusqueda, ticketsList: Ticket[]) => {
    if (!searchQuery.trim()) {
      onResultadosChange(ticketsList) // Mostrar todos si no hay query
      return
    }

    const queryLimpia = searchQuery.trim().toLowerCase()
    let resultadosFiltrados: Ticket[] = []

    switch (searchType) {
      case 'usuario':
        resultadosFiltrados = ticketsList.filter(ticket => 
          ticket.usuarioAfectado && 
          (
            ticket.usuarioAfectado.nombre.toLowerCase().includes(queryLimpia) ||
            (ticket.usuarioAfectado.apellido && ticket.usuarioAfectado.apellido.toLowerCase().includes(queryLimpia)) ||
            `${ticket.usuarioAfectado.nombre} ${ticket.usuarioAfectado.apellido || ''}`.toLowerCase().includes(queryLimpia)
          )
        )
        break
      
      case 'id':
        // Buscar por ID exacto o parcial
        resultadosFiltrados = ticketsList.filter(ticket => 
          ticket.id.toString().includes(queryLimpia)
        )
        break
      
      default:
        resultadosFiltrados = ticketsList
    }

    onResultadosChange(resultadosFiltrados)
  }, [onResultadosChange])

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarTickets(query, tipoBusqueda, tickets)
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [query, tipoBusqueda, tickets, buscarTickets])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleLimpiarBusqueda = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const handleCambiarFiltro = (nuevoTipo: TipoBusqueda) => {
    setTipoBusqueda(nuevoTipo)
    setMostrarFiltros(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative mb-6">
      <div className="flex gap-2">
        {/* Selector de filtro */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-between"
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
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {opcionesFiltro.map((opcion) => (
                <button
                  key={opcion.valor}
                  onClick={() => handleCambiarFiltro(opcion.valor as TipoBusqueda)}
                  className={`w-full text-left cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={opcionSeleccionada?.placeholder}
            disabled={loading}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {query && (
            <button
              type="button"
              onClick={handleLimpiarBusqueda}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

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