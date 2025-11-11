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
  FileText,
  CheckCircle,
  XCircle,
  Ban,
  Clock,
  Shield,
  Calendar,
  UserCheck,
  Users,
  RefreshCw,
  Download
} from "lucide-react"
import { Ticket, Equipo } from "../../../types/ticket"
import CerrarTicketModal from "./CerrarTicketModal"
import ReasignarTicketModal from "./ReasignarTicketModal"
import ExportarPDFModal from "./ExportarPDFModal"

interface TicketsListProps {
  tickets: Ticket[]
  loading?: boolean
  error?: string
  onTicketClosed?: () => void
  onTicketReasigned?: () => void
  puedeReasignar?: boolean
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
  cierre: boolean;
  reasignaciones: boolean;
}

export default function TicketsList({ 
  tickets, 
  loading = false, 
  error = '', 
  onTicketClosed, 
  onTicketReasigned,
  puedeReasignar = false 
}: TicketsListProps) {
  const [ticketsExpandidos, setTicketsExpandidos] = useState<Record<number, TicketExpandido>>({})
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [selectedTicketReasignar, setSelectedTicketReasignar] = useState<Ticket | null>(null)
  const [isReasignarModalOpen, setIsReasignarModalOpen] = useState(false)
  const [selectedTicketExportar, setSelectedTicketExportar] = useState<Ticket | null>(null)
  const [isExportarModalOpen, setIsExportarModalOpen] = useState(false)

  const toggleSeccion = (ticketId: number, seccion: keyof TicketExpandido) => {
    setTicketsExpandidos(prev => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [seccion]: !prev[ticketId]?.[seccion]
      }
    }))
  }

  const handleCloseTicket = (ticket: Ticket) => {
    if (ticket.estadoId === 1) {
      setSelectedTicket(ticket)
      setIsCloseModalOpen(true)
    }
  }

  const handleTicketClosed = () => {
    setIsCloseModalOpen(false)
    setSelectedTicket(null)
    if (onTicketClosed) {
      onTicketClosed()
    }
  }

  // Función para manejar reasignación
  const handleReasignarTicket = (ticket: Ticket) => {
    if (puedeReasignar) {
      setSelectedTicketReasignar(ticket)
      setIsReasignarModalOpen(true)
    }
  }

  const handleTicketReasigned = () => {
    setIsReasignarModalOpen(false)
    setSelectedTicketReasignar(null)
    if (onTicketReasigned) {
      onTicketReasigned()
    }
  }

  // Función para manejar exportación a PDF
  const handleExportarPDF = (ticket: Ticket) => {
    setSelectedTicketExportar(ticket)
    setIsExportarModalOpen(true)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-green-100 text-green-800'
      case 'En Progreso':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cerrado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCondicionIcon = (condicion: string) => {
    switch (condicion) {
      case 'Finalizado':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Rechazado':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'Cancelado':
        return <Ban className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  const getCondicionColor = (condicion: string) => {
    switch (condicion) {
      case 'Finalizado':
        return 'text-green-600 bg-green-50'
      case 'Rechazado':
        return 'text-red-600 bg-red-50'
      case 'Cancelado':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre;
  };

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
      <div className="text-center py-8 animate-fade-in">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="font-medium">Error al cargar los tickets</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
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
    <>
      {/* Grid container con items stretch para que todas las tarjetas tengan la misma altura */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 items-stretch">
        {tickets.map((ticket, index) => {
          const fechaCreacion = new Date(ticket.fecha_creacion);
          const fechaCierre = ticket.fecha_cierre ? new Date(ticket.fecha_cierre) : null;
          const estaExpandido = ticketsExpandidos[ticket.id] || {
            usuarioAfectado: false,
            equipos: false,
            descripcion: false,
            cierre: false,
            reasignaciones: false
          };

          // Usar ticketReasignaciones si está disponible, de lo contrario usar reasignaciones
          const reasignaciones = ticket.ticketReasignaciones || ticket.reasignaciones || [];

          return (
            <div
              key={ticket.id}
              // h-full para que ocupe toda la altura disponible del grid item
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 animate-fade-in-up flex flex-col h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Contenido principal que crece para ocupar el espacio */}
              <div className="flex-1 flex flex-col">
                {/* Header con título y badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 mr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{ticket.id}
                      </span>
                      {/* Badge de reasignado */}
                      {reasignaciones.length > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Reasignado
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {ticket.titulo}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(ticket.estado.estado)}`}>
                      {ticket.estado.estado}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(ticket.tipoTicket.tipo)}`}>
                      {ticket.tipoTicket.tipo}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mb-4">
                  <div className="flex gap-2">

                    {/* Botones para tickets abiertos */}
                    {ticket.estadoId === 1 && (
                      <>
                        <button
                          onClick={() => handleCloseTicket(ticket)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Cerrar
                        </button>
                        
                        {puedeReasignar && (
                          <button
                            onClick={() => handleReasignarTicket(ticket)}
                            className="flex-1 px-4 py-2 bg-[#001F3F] text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Users className="w-4 h-4" />
                            Reasignar
                          </button>
                        )}
                      </>
                    )}

                    {/* Botón de exportar PDF para todos los tickets */}
                    <button
                      onClick={() => handleExportarPDF(ticket)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>

                {/* Contenedor para las secciones desplegables con scroll si es necesario */}
                <div className="flex-1 overflow-hidden">
                  {/* Historial de reasignaciones desplegable */}
                  {reasignaciones.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleSeccion(ticket.id, 'reasignaciones')}
                        className="flex items-center justify-between w-full p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-900">
                            Historial de Reasignaciones ({reasignaciones.length})
                          </span>
                        </div>
                        {estaExpandido.reasignaciones ? (
                          <ChevronUp className="w-4 h-4 text-purple-600 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-purple-600 transition-transform duration-200" />
                        )}
                      </button>

                      {estaExpandido.reasignaciones && (
                        <div className="mt-2 p-3 bg-white border border-purple-200 rounded-lg animate-slide-down">
                          <div className="space-y-4">
                            {reasignaciones.map((reasignacion, index) => (
                              <div key={reasignacion.id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                  <div>
                                    <div className="text-xs text-gray-500">De:</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {reasignacion.analistaAnterior ? getNombreCompleto(reasignacion.analistaAnterior) : 'No especificado'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">A:</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {reasignacion.analistaNuevo ? getNombreCompleto(reasignacion.analistaNuevo) : 'No especificado'}
                                    </div>
                                  </div>
                                </div>

                                {reasignacion.motivo && (
                                  <div className="mb-2">
                                    <div className="text-xs text-gray-500 mb-1">Motivo:</div>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                                      {reasignacion.motivo}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />
                                    <span>Por: {reasignacion.supervisor ? getNombreCompleto(reasignacion.supervisor) : 'No especificado'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(reasignacion.fechaReasignacion).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Descripción desplegable */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleSeccion(ticket.id, 'descripcion')}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Descripción</span>
                      </div>
                      {estaExpandido.descripcion ? (
                        <ChevronUp className="w-4 h-4 text-gray-600 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-200" />
                      )}
                    </button>

                    {estaExpandido.descripcion && (
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg animate-slide-down">
                        <p className=" text-sm">{ticket.descripcion}</p>
                      </div>
                    )}
                  </div>

                  {/* Información del usuario afectado desplegable */}
                  {ticket.usuarioAfectado && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleSeccion(ticket.id, 'usuarioAfectado')}
                        className="flex items-center justify-between w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Usuario Afectado</span>
                        </div>
                        {estaExpandido.usuarioAfectado ? (
                          <ChevronUp className="w-4 h-4 text-blue-600 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-600 transition-transform duration-200" />
                        )}
                      </button>

                      {estaExpandido.usuarioAfectado && (
                        <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg animate-slide-down">
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
                        className="flex items-center justify-between w-full p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-900">
                            Equipos Afectados ({ticket.ticketEquipos.length})
                          </span>
                        </div>
                        {estaExpandido.equipos ? (
                          <ChevronUp className="w-4 h-4 text-orange-600 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-orange-600 transition-transform duration-200" />
                        )}
                      </button>

                      {estaExpandido.equipos && (
                        <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg animate-slide-down">
                          <div className="space-y-3">
                            {ticket.ticketEquipos.map((ticketEquipo) => {
                              const infoEquipo = getInfoEquipo(ticketEquipo.equipo);
                              return (
                                <div key={ticketEquipo.id} className="pb-2 border-b border-gray-300 last:border-b-0 last:pb-0">
                                  <div className="font-bold text-md mb-1">{infoEquipo.nombre}</div>
                                  <div className="text-sm space-y-1">
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

                  {/* Información de cierre desplegable (solo para tickets cerrados) */}
                  {ticket.estadoId === 2 && ticket.ticketCierre && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleSeccion(ticket.id, 'cierre')}
                        className="flex items-center justify-between w-full p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-900">Información de Cierre</span>
                        </div>
                        {estaExpandido.cierre ? (
                          <ChevronUp className="w-4 h-4 text-green-600 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-green-600 transition-transform duration-200" />
                        )}
                      </button>

                      {estaExpandido.cierre && (
                        <div className="mt-2 p-3 bg-white border border-green-200 rounded-lg animate-slide-down">
                          <div className="space-y-4">
                            {/* Condición del cierre */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                              {getCondicionIcon(ticket.ticketCierre.condicion)}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">Condición</div>
                                <div className={`text-sm font-semibold px-2 py-1 rounded-md inline-block mt-1 ${getCondicionColor(ticket.ticketCierre.condicion)}`}>
                                  {ticket.ticketCierre.condicion}
                                </div>
                              </div>
                            </div>

                            {/* Memo de Finalización */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <div className="text-sm font-medium text-gray-900">Memo de Finalización</div>
                              </div>
                              <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                {ticket.ticketCierre.memoFinalizacion}
                              </div>
                            </div>

                            {/* Observaciones (si existen) */}
                            {ticket.ticketCierre.observaciones && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-gray-600" />
                                  <div className="text-sm font-medium text-gray-900">Observaciones Adicionales</div>
                                </div>
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  {ticket.ticketCierre.observaciones}
                                </div>
                              </div>
                            )}

                            {/* Información del cierre */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-xs text-gray-500">Cerrado por</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getNombreCompleto(ticket.ticketCierre.usuarioCerrador || ticket.usuarioCerrador!)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-xs text-gray-500">Fecha de cierre</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {fechaCierre?.toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tiempo de ejecución */}
                            {ticket.tiempoEjecucion && (
                              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                  <div className="text-sm font-medium text-blue-900">Tiempo de Ejecución</div>
                                  <div className="text-lg font-bold text-blue-700">
                                    {ticket.tiempoEjecucion}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Información del ticket (siempre visible) - Se mantiene al fondo */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="space-y-2 text-sm text-gray-900">
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

                    {/* Tiempo de ejecución para tickets cerrados */}
                    {ticket.estadoId === 2 && ticket.tiempoEjecucion && (
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Tiempo de ejecución:</span>
                        <span className="font-medium text-blue-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ticket.tiempoEjecucion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CerrarTicketModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onTicketClosed={handleTicketClosed}
        ticket={selectedTicket}
      />

      <ReasignarTicketModal
        isOpen={isReasignarModalOpen}
        onClose={() => setIsReasignarModalOpen(false)}
        onTicketReasigned={handleTicketReasigned}
        ticket={selectedTicketReasignar}
      />

      <ExportarPDFModal
        isOpen={isExportarModalOpen}
        onClose={() => setIsExportarModalOpen(false)}
        ticket={selectedTicketExportar}
      />
    </>
  )
}