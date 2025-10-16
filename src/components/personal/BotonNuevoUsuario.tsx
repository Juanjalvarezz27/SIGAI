"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import UsuarioNuevoForm from "@/components/agregarPersonal/UsuarioNuevoForm"

interface BotonNuevoUsuarioProps {
  loading?: boolean
}

export default function BotonNuevoUsuario({ loading = false }: BotonNuevoUsuarioProps) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [mensajeError, setMensajeError] = useState("")

  const abrirModal = () => {
    setModalAbierto(true)
    setMensajeExito("")
    setMensajeError("")
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden"
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMensajeExito("")
    setMensajeError("")
    // Restaurar scroll del body cuando el modal se cierra
    document.body.style.overflow = "auto"
  }

  const manejarExito = (mensaje: string) => {
    setMensajeExito(mensaje)
    setMensajeError("")
  }

  const manejarError = (mensaje: string) => {
    setMensajeError(mensaje)
    setMensajeExito("")
  }

  return (
    <>
      {/* Botón Nuevo Usuario */}
      <button
        onClick={abrirModal}
        disabled={loading}
        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#001F3F] hover:bg-[#003366] text-white rounded-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={20} />
        Nuevo usuario
      </button>

      {/* Modal para crear nuevo usuario */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/[0.5] transition-opacity"
            onClick={cerrarModal}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-8/12 mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear Nuevo Usuario
              </h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            {/* Mensajes de estado */}
            {(mensajeExito || mensajeError) && (
              <div className="px-6 pt-4 flex-shrink-0">
                {mensajeExito && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                    {mensajeExito}
                  </div>
                )}
                {mensajeError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    {mensajeError}
                  </div>
                )}
              </div>
            )}

            {/* Contenido del formulario con scroll interno */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4">
              <UsuarioNuevoForm
                loading={loading}
                onLoadingChange={() => {}}
                onSuccess={manejarExito}
                onError={manejarError}
                onCancel={cerrarModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}