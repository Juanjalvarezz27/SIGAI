'use client';

import { useState, FormEvent } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ModalAceptarEventoProps {
  isOpen: boolean;
  onClose: () => void;
  onAceptar: (motivo?: string) => void;
  isLoading?: boolean;
}

export default function ModalAceptarEvento({ 
  isOpen, 
  onClose, 
  onAceptar, 
  isLoading = false 
}: ModalAceptarEventoProps) {
  const [motivo, setMotivo] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onAceptar(motivo.trim() || undefined);
  };

  const handleClose = (): void => {
    setMotivo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Aceptar Evento</h3>
              <p className="text-sm text-gray-600">Confirmar la aceptación del evento</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de aceptación (Opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              placeholder="Puedes agregar un mensaje opcional para el solicitante..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este mensaje será visible para el usuario que solicitó el evento.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Aceptar Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}