"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle } from "lucide-react"

interface ModalDeshabilitacionProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void
  usuarioNombre: string
  loading?: boolean
  mostrarExito?: boolean
}

export default function ModalDeshabilitacion({
  isOpen,
  onClose,
  onConfirm,
  usuarioNombre,
  loading = false,
  mostrarExito = false
}: ModalDeshabilitacionProps) {
  const [motivo, setMotivo] = useState("")
  const [error, setError] = useState("")

  // Resetear el formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setMotivo("")
      setError("")
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/[0.5] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-7/12 mx-4 transform transition-all"
        onKeyDown={handleKeyPress}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {mostrarExito ? "Deshabilitación Exitosa" : "Deshabilitar Usuario"}
          </h3>
          {!mostrarExito && (
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {mostrarExito ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-800 mb-2">
                Usuario deshabilitado exitosamente
              </p>
              <p className="text-gray-600">
                El usuario <span className="font-semibold">{usuarioNombre}</span> ha sido deshabilitado.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Cerrando automáticamente...
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                Estás a punto de deshabilitar a <span className="font-semibold">{usuarioNombre}</span>.
                Esta acción cambiará su estado a Deshabilitado.
              </p>

              <div className="mb-4">
                <textarea
                  id="motivo"
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value)
                    setError("")
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent resize-none"
                  placeholder="Describe el motivo por el cual se deshabilita al usuario..."
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
                  • Deshabilitado por: Usuario Actual
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!mostrarExito && (
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
              disabled={loading}
              className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deshabilitando...
                </>
              ) : (
                'Confirmar Deshabilitación'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}