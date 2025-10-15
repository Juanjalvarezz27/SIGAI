"use client"

import { useState, useEffect, useRef } from "react"
import { X, Users } from "lucide-react"
import UsuarioActivoForm from "./UsuarioActivoForm"
import UsuarioNuevoForm from "./UsuarioNuevoForm"
import ActualizarDatosForm from "./ActualizarDatosForm"

interface AddPersonalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddPersonalModal({ isOpen, onClose }: AddPersonalModalProps) {
  const [modo, setModo] = useState<'activo' | 'nuevo' | 'actualizar'>('activo')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const modalContentRef = useRef<HTMLDivElement>(null)

  // Función para hacer scroll al inicio del modal
  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Resetear datos cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  // Efecto para hacer scroll cuando hay éxito
  useEffect(() => {
    if (success) {
      scrollToTop()
    }
  }, [success])

  // Efecto para hacer scroll cuando hay error
  useEffect(() => {
    if (error) {
      scrollToTop()
    }
  }, [error])

  const handleClose = () => {
    onClose()
  }

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setError('')
  }

  const handleError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col">

        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A0C4FF] rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-[#001F3F]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Personal</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del modal con scroll */}
        <div 
          ref={modalContentRef}
          className="p-6 overflow-y-auto flex-1"
        >

          {/* Toggle entre Usuario Activo, Usuario Nuevo y Actualizar Datos */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex ">
              <button
                type="button"
                onClick={() => setModo('activo')}
                disabled={loading}
                className={` cursor-pointer px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  modo === 'activo'
                    ? 'bg-white text-[#001F3F] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 disabled:hover:text-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Usuario Activo
              </button>
              <button
                type="button"
                onClick={() => setModo('actualizar')}
                disabled={loading}
                className={` cursor-pointer px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  modo === 'actualizar'
                    ? 'bg-white text-[#001F3F] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 disabled:hover:text-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Actualizar Datos
              </button>
              <button
                type="button"
                onClick={() => setModo('nuevo')}
                disabled={loading}
                className={` cursor-pointer px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  modo === 'nuevo'
                    ? 'bg-white text-[#001F3F] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 disabled:hover:text-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Usuario Nuevo
              </button>
            </div>
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Renderizar el componente correspondiente según el modo */}
          {modo === 'activo' ? (
            <UsuarioActivoForm
              loading={loading}
              onLoadingChange={handleLoadingChange}
              onSuccess={handleSuccess}
              onError={handleError}
              onClose={handleClose}
            />
          ) : modo === 'actualizar' ? (
            <ActualizarDatosForm
              loading={loading}
              onLoadingChange={handleLoadingChange}
              onSuccess={handleSuccess}
              onError={handleError}
              onClose={handleClose}
            />
          ) : (
            <UsuarioNuevoForm
              loading={loading}
              onLoadingChange={handleLoadingChange}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}