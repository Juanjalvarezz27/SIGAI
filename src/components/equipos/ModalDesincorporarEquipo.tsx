"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ModalDesincorporarEquipoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void
  equipoNombre: string
  loading?: boolean
}

export default function ModalDesincorporarEquipo({
  isOpen,
  onClose,
  onConfirm,
  equipoNombre,
  loading = false
}: ModalDesincorporarEquipoProps) {
  const [motivo, setMotivo] = useState("")
  const [error, setError] = useState("")

  // Efecto para controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY

      // Agregar estilos para deshabilitar el scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      // Resetear el formulario cuando se abre el modal
      setMotivo("")
      setError("")

      // Función de limpieza
      return () => {
        // Restaurar el scroll al cerrar el modal
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (!motivo.trim()) {
      setError("El motivo es obligatorio")
      return
    }

    if (motivo.trim().length < 5) {
      setError("El motivo debe tener al menos 5 caracteres")
      return
    }

    onConfirm(motivo.trim())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleConfirm()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/[0.5] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-7/12 mx-4 transform transition-all animate-fade-in-up"
        onKeyDown={handleKeyPress}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Desincorporar Equipo
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Estás a punto de desincorporar el equipo <span className="font-semibold">{equipoNombre}</span>.
            Esta acción cambiará su status a <span className="font-semibold text-red-600">Desincorporados</span> 
             y su estado a <span className="font-semibold text-yellow-600">Sin uso</span>.
          </p>

          <div className="mb-4">
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de desincorporación *
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                setError("")
              }}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent resize-none"
              placeholder="Describe el motivo por el cual se desincorpora el equipo..."
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Información automática:</strong><br />
              • Fecha: {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              <br />
              • Desincorporado por: Usuario Actual
              <br />
              • Nuevo Status: Desincorporados
              <br />
              • Nuevo Estado: Sin uso
              <br />
              • Estado anterior: Se guardará automáticamente para futuras incorporaciones
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !motivo.trim()}
            className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Desincorporando...
              </>
            ) : (
              'Confirmar Desincorporación'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}