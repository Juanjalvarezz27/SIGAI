'use client';

import { useState, FormEvent } from 'react';
import { XCircle, X } from 'lucide-react';

interface ModalRechazarEventoProps {
  isOpen: boolean;
  onClose: () => void;
  onRechazar: (motivo: string) => void;
  isLoading?: boolean;
}

export default function ModalRechazarEvento({ 
  isOpen, 
  onClose, 
  onRechazar, 
  isLoading = false 
}: ModalRechazarEventoProps) {
  const [motivo, setMotivo] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!motivo.trim()) {
      alert('El motivo del rechazo es requerido');
      return;
    }
    onRechazar(motivo.trim());
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
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rechazar Evento</h3>
              <p className="text-sm text-gray-600">Especificar el motivo del rechazo</p>
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
              Motivo del rechazo *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              required
              placeholder="Explica los motivos por los cuales se rechaza este evento..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
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
              disabled={isLoading || !motivo.trim()}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  Rechazar Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}