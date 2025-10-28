"use client"

import { useState } from "react"
import { 
  MessageSquare, 
  User, 
  MapPin, 
  Building, 
  Monitor, 
  Briefcase, 
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react"
import { Ticket, Equipo } from "../../../types/ticket"

interface TicketsListProps {
  tickets: Ticket[]
  loading?: boolean
  error?: string
}

// Interface para la información del equipo
interface InfoEquipo {
  nombre: string;
  bienNacional: string;
  serial: string;
  status: string;
}

interface TicketExpandido {
  usuarioAfectado: boolean;
  equipos: boolean;
  descripcion: boolean;
}

export default function TicketsList({ tickets, loading = false, error = '' }: TicketsListProps) {
  const [ticketsExpandidos, setTicketsExpandidos] = useState<Record<number, TicketExpandido>>({})

  const toggleSeccion = (ticketId: number, seccion: keyof TicketExpandido) => {
    setTicketsExpandidos(prev => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [seccion]: !prev[ticketId]?.[seccion]
      }
    }))
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-green-100 text-green-800'
      case 'En Progreso':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cerrado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Soporte':
        return 'bg-purple-100 text-purple-800'
      case 'Redes':
        return 'bg-blue-100 text-blue-800'
      case 'Desarrollo':
        return 'bg-green-100 text-green-800'
      case 'Siges':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el nombre completo
  const getNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre;
  };

  // Función para obtener información del equipo de forma segura
  const getInfoEquipo = (equipo: Equipo): InfoEquipo => {
    const tipo = equipo.tipoEquipo?.nombre || 'Equipo'
    const marca = equipo.modelo?.marca?.nombre || ''
    const modelo = equipo.modelo?.nombre || ''
    
    return {
      nombre: `${tipo} ${marca} ${modelo}`.trim(),
      bienNacional: equipo.bienNacional || 'No asignado',
      serial: equipo.serial || 'No asignado',
      status: equipo.status?.estado || 'No especificado'
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-medium">Error al cargar los tickets</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tickets</h3>
        <p className="text-gray-500">
          No se encontraron tickets en el sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
      {tickets.map((ticket) => {
        const fechaCreacion = new Date(ticket.fecha_creacion);
        const fechaCierre = ticket.fecha_cierre ? new Date(ticket.fecha_cierre) : null;
        const estaExpandido = ticketsExpandidos[ticket.id] || {
          usuarioAfectado: false,
          equipos: false,
          descripcion: false
        };
        
        return (
          <div
            key={ticket.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            {/* Header con título y badges */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1 mr-2">
                {ticket.titulo}
              </h3>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(ticket.estado.estado)}`}>
                  {ticket.estado.estado}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(ticket.tipoTicket.tipo)}`}>
                  {ticket.tipoTicket.tipo}
                </span>
              </div>
            </div>

            {/* Descripción desplegable */}
            <div className="mb-4">
              <button
                onClick={() => toggleSeccion(ticket.id, 'descripcion')}
                className="flex items-center justify-between w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Descripción</span>
                </div>
                {estaExpandido.descripcion ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              {estaExpandido.descripcion && (
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">{ticket.descripcion}</p>
                </div>
              )}
            </div>

            {/* Información del usuario afectado desplegable */}
            {ticket.usuarioAfectado && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSeccion(ticket.id, 'usuarioAfectado')}
                  className="flex items-center justify-between w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Usuario Afectado</span>
                  </div>
                  {estaExpandido.usuarioAfectado ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  )}
                </button>
                
                {estaExpandido.usuarioAfectado && (
                  <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre: </span>
                        <span className="font-medium">
                          {getNombreCompleto(ticket.usuarioAfectado)}
                        </span>
                      </div>
                      
                      {ticket.usuarioAfectado.cedula && (
                        <div>
                          <span className="text-gray-600">Cédula: </span>
                          <span className="font-medium">{ticket.usuarioAfectado.cedula}</span>
                        </div>
                      )}

                      {ticket.usuarioAfectado.direccion && (
                        <>
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">Piso: </span>
                            <span className="font-medium">{ticket.usuarioAfectado.direccion.piso.piso}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">Dirección: </span>
                            <span className="font-medium">{ticket.usuarioAfectado.direccion.direccion}</span>
                          </div>
                        </>
                      )}

                      {ticket.usuarioAfectado.area && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">Área: </span>
                          <span className="font-medium">{ticket.usuarioAfectado.area.nombre}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Equipos afectados desplegable */}
            {ticket.ticketEquipos && ticket.ticketEquipos.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSeccion(ticket.id, 'equipos')}
                  className="flex items-center justify-between w-full p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-900">
                      Equipos Afectados ({ticket.ticketEquipos.length})
                    </span>
                  </div>
                  {estaExpandido.equipos ? (
                    <ChevronUp className="w-4 h-4 text-orange-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-orange-600" />
                  )}
                </button>
                
                {estaExpandido.equipos && (
                  <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg">
                    <div className="space-y-3">
                      {ticket.ticketEquipos.map((ticketEquipo) => {
                        const infoEquipo = getInfoEquipo(ticketEquipo.equipo);
                        return (
                          <div key={ticketEquipo.id} className="pb-2 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <div className="font-medium text-sm mb-1">{infoEquipo.nombre}</div>
                            <div className="text-gray-600 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Bien Nacional:</span>
                                <span className="font-medium">{infoEquipo.bienNacional}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Serial:</span>
                                <span className="font-medium">{infoEquipo.serial}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-medium">{infoEquipo.status}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información del ticket (siempre visible) */}
            <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Creado por:</span>
                <span className="font-medium text-gray-700">
                  {getNombreCompleto(ticket.usuarioCreador)}
                </span>
              </div>

              {ticket.usuarioCerrador && (
                <div className="flex justify-between">
                  <span>Asignado a:</span>
                  <span className="font-medium text-gray-700">
                    {getNombreCompleto(ticket.usuarioCerrador)}
                    {ticket.usuarioCerrador.tipoAnalista && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({ticket.usuarioCerrador.tipoAnalista.tipo})
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Fecha creación:</span>
                <span className="font-medium text-gray-700">
                  {fechaCreacion.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {fechaCierre ? (
                <div className="flex justify-between">
                  <span>Fecha cierre:</span>
                  <span className="font-medium text-gray-700">
                    {fechaCierre.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Fecha cierre:</span>
                  <span className="font-medium text-yellow-600 text-xs">
                    Aún no cerrado
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}