'use client';

import { useState } from 'react';
import { EquipoSeleccionado } from '../../../types/eventos';
import SeleccionEquipos from './SeleccionEquipos';

interface ModalEquiposProps {
  isOpen: boolean;
  onClose: () => void;
  onEquiposSeleccionados: (equipos: EquipoSeleccionado[]) => void;
  equiposActuales: EquipoSeleccionado[];
}

export default function ModalEquipos({ isOpen, onClose, onEquiposSeleccionados, equiposActuales }: ModalEquiposProps) {
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<EquipoSeleccionado[]>(equiposActuales);

  const handleEquiposChange = (equipos: EquipoSeleccionado[]): void => {
    setEquiposSeleccionados(equipos);
  };

  const handleSubmit = (): void => {
    // Filtrar equipos con cantidad > 0
    const equiposValidos = equiposSeleccionados.filter((equipo: EquipoSeleccionado) => equipo.cantidad > 0);
    onEquiposSeleccionados(equiposValidos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Seleccionar Equipos</h2>
        
        <SeleccionEquipos
          equiposSeleccionados={equiposSeleccionados}
          onEquiposChange={handleEquiposChange}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={equiposSeleccionados.filter((e: EquipoSeleccionado) => e.cantidad > 0).length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Equipos
          </button>
        </div>
      </div>
    </div>
  );
}