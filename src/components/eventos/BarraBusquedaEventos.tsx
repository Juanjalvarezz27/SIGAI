"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, User, Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'
import { EventoExterno } from '../../../types/eventos'

interface BarraBusquedaEventosProps {
  onEventoSeleccionado: (evento: EventoExterno) => void
  loading?: boolean
  placeholder?: string
  label?: string
}

// Función para formatear fecha
function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Función para obtener color del estado
function getEstadoColor(estado: string): string {
  switch (estado) {
    case 'En proceso':
      return 'bg-yellow-100 text-yellow-800';
    case 'Aceptado':
      return 'bg-green-100 text-green-800';
    case 'Rechazado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Función para obtener icono del estado
function getEstadoIcon(estado: string) {
  switch (estado) {
    case 'En proceso':
      return <Clock size={14} className="text-yellow-600" />;
    case 'Aceptado':
      return <CheckCircle size={14} className="text-green-600" />;
    case 'Rechazado':
      return <XCircle size={14} className="text-red-600" />;
    default:
      return <Clock size={14} className="text-gray-600" />;
  }
}

export default function BarraBusquedaEventos({
  onEventoSeleccionado,
  loading = false,
  placeholder = "Buscar por nombre de evento o solicitante...",
  label = "Buscar eventos"
}: BarraBusquedaEventosProps) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [eventos, setEventos] = useState<EventoExterno[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)
  const busquedaRef = useRef<string>('')

  // Función debounced para buscar eventos
  const buscarEventos = useMemo(
    () => debounce(async (query: string) => {
      // Guardar la consulta actual
      busquedaRef.current = query

      if (!query.trim() || query.length < 3) {
        setEventos([])
        setBuscando(false)
        return
      }

      try {
        setBuscando(true)

        const endpoint = `/api/eventos-externos/buscar?q=${encodeURIComponent(query)}`

        const response = await axios.get(endpoint)

        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setEventos(response.data.eventos || [])
        }
      } catch (error: unknown) {
        console.error('Error buscando eventos:', error)
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setEventos([])
        }
      } finally {
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setBuscando(false)
        }
      }
    }, 500),
    []
  )

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda && busqueda.length >= 3) {
      buscarEventos(busqueda)
    } else {
      // Limpiar inmediatamente cuando la búsqueda es muy corta o está vacía
      setEventos([])
      setBuscando(false)
      busquedaRef.current = '' // Resetear la referencia
    }
  }, [busqueda, buscarEventos])

  // Cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      buscarEventos.cancel()
    }
  }, [buscarEventos])

  const handleSeleccionarEvento = (evento: EventoExterno) => {
    onEventoSeleccionado(evento)
    setBusqueda('')
    setEventos([])
    setBuscando(false)
    busquedaRef.current = '' // Resetear la referencia
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)

    // Si el usuario borra todo, limpiar inmediatamente
    if (value === '') {
      setEventos([])
      setBuscando(false)
      buscarEventos.cancel() // Cancelar cualquier búsqueda pendiente
      busquedaRef.current = '' // Resetear la referencia
    }
  }

  // Determinar qué mostrar
  const mostrarResultados = busqueda && busqueda.length >= 3 && !buscando && eventos.length > 0
  const mostrarNoResultados = busqueda && busqueda.length >= 3 && !buscando && eventos.length === 0
  const mostrarMensajeMinimo = busqueda && busqueda.length < 3

  return (
    <div className="w-full">
      <label htmlFor="busqueda-eventos" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda-eventos"
          value={busqueda}
          onChange={handleInputChange}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent text-base"
          placeholder={placeholder}
          disabled={loading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
      </div>

      {/* Mensaje de mínimo caracteres - SOLO cuando hay texto pero menos de 3 caracteres */}
      {mostrarMensajeMinimo && (
        <p className="mt-2 text-sm text-gray-500">
          Escribe al menos 3 caracteres para buscar
        </p>
      )}

      {/* Loader de búsqueda - SOLO se muestra cuando está buscando activamente */}
      {buscando && (
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Lista de resultados - SOLO se muestra cuando hay resultados y no está buscando */}
      {mostrarResultados && (
        <div className="mt-2 border border-gray-200 rounded-lg max-h-80 overflow-y-auto shadow-lg bg-white">
          {eventos.map(evento => (
            <div
              key={evento.id}
              onClick={() => handleSeleccionarEvento(evento)}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-base line-clamp-1 flex-1 pr-2">
                  {evento.nombre}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(evento.estado)} flex items-center gap-1 shrink-0`}>
                  {getEstadoIcon(evento.estado)}
                  {evento.estado}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} className="text-gray-400" />
                  <span className="font-medium">Solicitante:</span>
                  <span>
                    {evento.usuarioSolicitante.nombre} {evento.usuarioSolicitante.apellido || ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="font-medium">Ubicación:</span>
                  <span>
                    {evento.direccion.direccion} - Piso {evento.piso.piso}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="font-medium">Fechas:</span>
                  <span>
                    {formatFecha(evento.fechaInicial)} - {formatFecha(evento.fechaFinal)}
                  </span>
                </div>
              </div>

              {evento.equiposEvento.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {evento.equiposEvento.slice(0, 4).map((equipo, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200 font-medium"
                      >
                        {equipo.tipoEquipo.nombre} ({equipo.cantidad})
                      </span>
                    ))}
                    {evento.equiposEvento.length > 4 && (
                      <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                        +{evento.equiposEvento.length - 4} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de no resultados - SOLO se muestra cuando hay búsqueda válida pero no hay resultados */}
      {mostrarNoResultados && (
        <div className="mt-2 text-center text-gray-500 py-6 border border-gray-200 rounded-lg bg-white">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium">No se encontraron eventos</p>
          <p className="text-xs text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}