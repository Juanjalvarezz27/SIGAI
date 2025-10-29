"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Users, UserCheck, FileText } from "lucide-react"
import { TicketReasignacionFormData } from "../../../types/ticket-reasignacion"
import { Ticket } from "../../../types/ticket"

interface ReasignarTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketReasigned: () => void
  ticket: Ticket | null
}

interface Analista {
  id: number
  nombre: string
  apellido?: string | null
  tipoAnalista?: {
    tipo: string
  }
}

interface Supervisor {
  id: number
  nombre: string
  apellido?: string | null
  supervisorTipo?: {
    tipo: string
  }
}

export default function ReasignarTicketModal({
  isOpen,
  onClose,
  onTicketReasigned,
  ticket
}: ReasignarTicketModalProps) {
  const [formData, setFormData] = useState<TicketReasignacionFormData>({
    analistaNuevoId: '',
    motivo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [analistas, setAnalistas] = useState<Analista[]>([])
  const [supervisores, setSupervisores] = useState<Supervisor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')

  // Función para cargar analistas y supervisores
  const cargarAnalistasYSupervisores = useCallback(async () => {
    if (!ticket?.tipoTicket?.id || !ticket?.id) return

    try {
      setIsLoading(true)
      // INCLUIR EL TICKET ID PARA EXCLUIR AL USUARIO ACTUALMENTE ASIGNADO
      const response = await fetch(`/api/tickets/analistas-supervisores?tipoTicketId=${ticket.tipoTicket.id}&ticketId=${ticket.id}`)
      if (response.ok) {
        const data = await response.json()
        
        setAnalistas(data.analistas || [])
        setSupervisores(data.supervisores || [])
      } else {
        setError('Error al cargar los analistas y supervisores')
      }
    } catch (error) {
      console.error('Error cargando analistas y supervisores:', error)
      setError('Error al cargar los analistas y supervisores')
    } finally {
      setIsLoading(false)
    }
  }, [ticket?.tipoTicket?.id, ticket?.id])

  // Cargar analistas y supervisores cuando se abre el modal
  useEffect(() => {
    if (isOpen && ticket) {
      cargarAnalistasYSupervisores()
      // Resetear el formulario cuando se abre
      setFormData({
        analistaNuevoId: '',
        motivo: ''
      })
      setError('')
    }
  }, [isOpen, ticket, cargarAnalistasYSupervisores])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.analistaNuevoId) {
      setError('Debe seleccionar un analista o supervisor')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch('/api/tickets/reasignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticket?.id,
          ...formData
        }),
      })

      if (response.ok) {
        setMensajeExito('Ticket reasignado exitosamente')

        setTimeout(() => {
          onTicketReasigned()
          onClose()
          resetForm()
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al reasignar el ticket')
      }
    } catch (error) {
      console.error('Error reasignando ticket:', error)
      setError('Error interno del servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      analistaNuevoId: '',
      motivo: ''
    })
    setError('')
    setMensajeExito('')
    setAnalistas([])
    setSupervisores([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen || !ticket) return null

  const obtenerNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Reasignar Ticket</h2>
            <p className="text-gray-600 mt-1">Reasigne el ticket a otro analista o supervisor</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Mensaje de éxito interno */}
          {mensajeExito && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <div className="flex items-center gap-2 text-green-700">
                <UserCheck className="w-5 h-5" />
                <span className="font-medium">{mensajeExito}</span>
              </div>
            </div>
          )}

          {/* Información del ticket */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Ticket:</span>
              </div>
              <p className="font-semibold text-gray-800">{ticket.titulo}</p>
              <p className="text-sm text-gray-600">Tipo: {ticket.tipoTicket.tipo}</p>

              {ticket.usuarioCerrador && (
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Actualmente asignado a: {obtenerNombreCompleto(ticket.usuarioCerrador)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="space-y-4">
            {/* Selección de analista/supervisor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignar a *
              </label>

              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <select
                  value={formData.analistaNuevoId}
                  onChange={(e) => setFormData({
                    ...formData,
                    analistaNuevoId: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting || !!mensajeExito}
                >
                  <option value="">Seleccionar analista o supervisor</option>

                  {/* Grupo de Analistas */}
                  {analistas.length > 0 && (
                    <optgroup label="Analistas">
                      {analistas.map((analista) => (
                        <option key={`analista-${analista.id}`} value={`analista-${analista.id}`}>
                          {obtenerNombreCompleto(analista)} - {analista.tipoAnalista?.tipo}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Grupo de Supervisores */}
                  {supervisores.length > 0 && (
                    <optgroup label="Supervisores">
                      {supervisores.map((supervisor) => (
                        <option key={`supervisor-${supervisor.id}`} value={`supervisor-${supervisor.id}`}>
                          {obtenerNombreCompleto(supervisor)} - Supervisor {supervisor.supervisorTipo?.tipo}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Mensaje si no hay opciones disponibles */}
                  {analistas.length === 0 && supervisores.length === 0 && !isLoading && (
                    <option value="" disabled>
                      No hay usuarios disponibles para reasignar
                    </option>
                  )}
                </select>
              )}
            </div>

            {/* Motivo de reasignación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de reasignación (Opcional)
              </label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({
                  ...formData,
                  motivo: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explique el motivo de la reasignación..."
                disabled={isSubmitting || !!mensajeExito}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !!mensajeExito}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Reasignando...
              </>
            ) : mensajeExito ? (
              <>
                <UserCheck size={16} />
                ¡Reasignado!
              </>
            ) : (
              <>
                <Users size={16} />
                Reasignar Ticket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}