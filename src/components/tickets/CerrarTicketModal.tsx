"use client"

import { useState } from "react"
import { X, Calendar, User, FileText } from "lucide-react"
import { TicketCierreFormData } from "../../../types/ticket-cierre"
import { Ticket } from "../../../types/ticket"


interface CerrarTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketClosed: () => void
  ticket: Ticket | null
}

export default function CerrarTicketModal({
  isOpen,
  onClose,
  onTicketClosed,
  ticket
}: CerrarTicketModalProps) {
  const [formData, setFormData] = useState<TicketCierreFormData>({
    condicion: 'Finalizado',
    memoFinalizacion: '',
    observaciones: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !ticket) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.memoFinalizacion.trim()) {
      setError('El memo de finalización es requerido')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch('/api/tickets/cerrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: ticket.id,
          ...formData
        }),
      })

      if (response.ok) {
        onTicketClosed()
        onClose()
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al cerrar el ticket')
      }
    } catch (error) {
      console.error('Error closing ticket:', error)
      setError('Error interno del servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      condicion: 'Finalizado',
      memoFinalizacion: '',
      observaciones: ''
    })
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Cerrar Ticket</h2>
            <p className="text-gray-600 mt-1">Complete los datos para cerrar el ticket</p>
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
          {/* Información del ticket */}
          <div className="p-4 bg-blue-50 rounded-lg">
            {/* Título arriba */}
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-gray-600" />
              <p className="text-lg font-semibold text-gray-800">{ticket.titulo}</p>
            </div>
            
            {/* Analista y fecha abajo, uno al lado del otro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Analista asignado */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Analista asignado:</span>
                </div>
                <p className="text-sm text-gray-800">
                  {ticket.usuarioCerrador?.nombre} {ticket.usuarioCerrador?.apellido}
                </p>
              </div>
              
              {/* Fecha de cierre */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Fecha de cierre:</span>
                </div>
                <p className="text-sm text-gray-800">
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="space-y-4">
            {/* Condición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición del cierre *
              </label>
              <select
                value={formData.condicion}
                onChange={(e) => setFormData({
                  ...formData,
                  condicion: e.target.value as 'Finalizado' | 'Rechazado' | 'Cancelado'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Finalizado">Finalizado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* Memo de Finalización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memo de Finalización *
              </label>
              <textarea
                value={formData.memoFinalizacion}
                onChange={(e) => setFormData({
                  ...formData,
                  memoFinalizacion: e.target.value
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describa los detalles de la resolución del ticket..."
                required
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (Opcional)
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({
                  ...formData,
                  observaciones: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observaciones adicionales..."
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
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-[#001F3F] text-white rounded-md hover:bg-blue-900 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cerrando...
              </>
            ) : (
              'Cerrar Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}