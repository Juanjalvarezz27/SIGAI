"use client"

import { TriangleAlert } from 'lucide-react';

// Props del componente modal de confirmación
interface ConfirmLogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

//Modal de confirmación para cerrar sesión

export default function ConfirmLogoutModal({ 
  isOpen, 
  onClose, 
  onConfirm
}: ConfirmLogoutModalProps) {
  // No renderizar si el modal no está abierto
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          
          {/* Icono de advertencia */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TriangleAlert className='w-12 h-12 text-red-600'/>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Cerrar Sesión
          </h3>
          
          {/* Mensaje de confirmación */}
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>

          {/* Contenedor de botones */}
          <div className="flex justify-center space-x-4">
            {/* Botón Cancelar */}
            <button
              onClick={onClose}
              className="bg-gray-300 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Cancelar
            </button>
            
            {/* Botón Confirmar */}
            <button
              onClick={onConfirm}
              className="bg-red-600 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}