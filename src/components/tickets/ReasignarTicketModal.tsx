"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Users, UserCheck, FileText, ChevronDown, Search } from "lucide-react"
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

interface UsuarioOption {
  id: number
  nombreCompleto: string
  tipo: string
  rol: 'analista' | 'supervisor'
  tipoEspecifico?: string
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
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Función cargarAnalistasYSupervisores
  const cargarAnalistasYSupervisores = useCallback(async () => {
    if (!ticket?.id) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/tickets/analistas-supervisores?ticketId=${ticket.id}`)
      if (response.ok) {
        const data = await response.json()

        setAnalistas(data.analistas || [])
        setSupervisores(data.supervisores || [])
      } else {
        setError('Error al cargar los analistas y supervisores')
      }
    } catch (error) {
      console.error('Error cargando analistas y supervisores:', error)
      setError('Error al cargarlos')
    } finally {
      setIsLoading(false)
    }
  }, [ticket?.id])

  // Cargar analistas y supervisores cuando se abre el modal
  useEffect(() => {
    if (isOpen && ticket) {
      cargarAnalistasYSupervisores()
      setFormData({
        analistaNuevoId: '',
        motivo: ''
      })
      setError('')
      setSearchTerm('')
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
    setSearchTerm('')
    setIsUsuarioModalOpen(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen || !ticket) return null

  const obtenerNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre
  }

  // Combinar usuarios para el modal
  const usuariosCombinados: UsuarioOption[] = [
    ...analistas.map(analista => ({
      id: analista.id,
      nombreCompleto: obtenerNombreCompleto(analista),
      tipo: 'Analista',
      rol: 'analista' as const,
      tipoEspecifico: analista.tipoAnalista?.tipo
    })),
    ...supervisores.map(supervisor => ({
      id: supervisor.id,
      nombreCompleto: obtenerNombreCompleto(supervisor),
      tipo: 'Supervisor',
      rol: 'supervisor' as const,
      tipoEspecifico: supervisor.supervisorTipo?.tipo
    }))
  ]

  // Filtrar usuarios basado en búsqueda
  const usuariosFiltrados = usuariosCombinados.filter(usuario =>
    usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.tipoEspecifico?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUsuarioSeleccionado = () => {
    if (!formData.analistaNuevoId) return null
    const [rol, id] = formData.analistaNuevoId.split('-')
    return usuariosCombinados.find(u => u.rol === rol && u.id === parseInt(id))
  }

  const seleccionarUsuario = (usuario: UsuarioOption) => {
    setFormData({
      ...formData,
      analistaNuevoId: `${usuario.rol}-${usuario.id}`
    })
    setIsUsuarioModalOpen(false)
    setSearchTerm('')
  }

  const usuarioSeleccionado = getUsuarioSeleccionado()

  return (
    <>
      {/* Modal principal */}
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
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <UserCheck className="w-5 h-5" />
                  <span className="font-medium">{mensajeExito}</span>
                </div>
              </div>
            )}

            {/* Información del ticket */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Ticket:</span>
                </div>
                <p className="font-semibold text-gray-800 text-lg">{ticket.titulo}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium text-gray-800">{ticket.tipoTicket.tipo}</p>
                  </div>
                  {ticket.usuarioCerrador && (
                    <div>
                      <span className="text-gray-600">Asignado actualmente:</span>
                      <p className="font-medium text-gray-800">
                        {obtenerNombreCompleto(ticket.usuarioCerrador)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campos del formulario */}
            <div className="space-y-4">
              {/* Selección de analista/supervisor con modal interno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignar a *
                </label>

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Botón para abrir modal de selección */}
                    <button
                      type="button"
                      onClick={() => setIsUsuarioModalOpen(true)}
                      disabled={isSubmitting || !!mensajeExito}
                      className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                      {usuarioSeleccionado ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{usuarioSeleccionado.nombreCompleto}</p>
                            <p className="text-sm text-gray-600">
                              {usuarioSeleccionado.tipo} • {usuarioSeleccionado.tipoEspecifico}
                            </p>
                          </div>
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-gray-500">
                          <span>Seleccionar analista o supervisor...</span>
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      )}
                    </button>

                    {/* Contadores */}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Analistas: {analistas.length}</span>
                      <span>Supervisores: {supervisores.length}</span>
                    </div>
                  </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explique el motivo de la reasignación..."
                  disabled={isSubmitting || !!mensajeExito}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
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
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || !!mensajeExito || !formData.analistaNuevoId}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
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

      {/* Modal interno para selección de usuarios */}
      {isUsuarioModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Header del modal interno */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Seleccionar Usuario</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {usuariosCombinados.length} usuarios disponibles
                </p>
              </div>
              <button
                onClick={() => setIsUsuarioModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de usuarios */}
            <div className="overflow-y-auto max-h-96">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <button
                    key={`${usuario.rol}-${usuario.id}`}
                    type="button"
                    onClick={() => seleccionarUsuario(usuario)}
                    className="w-full p-4 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{usuario.nombreCompleto}</p>
                        <p className="text-sm text-gray-600">
                          {usuario.tipo} • {usuario.tipoEspecifico}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        usuario.rol === 'analista' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {usuario.rol === 'analista' ? 'Analista' : 'Supervisor'}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No se encontraron usuarios</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}