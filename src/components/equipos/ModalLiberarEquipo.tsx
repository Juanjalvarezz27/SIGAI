"use client";

import { AlertTriangle, X } from "lucide-react";

interface ModalLiberarEquipoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  equipoNombre: string;
  loading?: boolean;
}

export default function ModalLiberarEquipo({
  isOpen,
  onClose,
  onConfirm,
  equipoNombre,
  loading = false,
}: ModalLiberarEquipoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5] bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Liberar Equipo
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas liberar el equipo?
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-medium text-orange-800 text-sm">
              {equipoNombre}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Acción:</strong> El campo de usuarioId quedará en null, 
              liberando este equipo del usuario actualmente asignado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Liberando...
              </>
            ) : (
              "Sí, Liberar Equipo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}