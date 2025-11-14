'use client';

import { useState } from 'react';

interface ModalMasInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalMasInfo({ isOpen, onClose }: ModalMasInfoProps) {
  const [desplegables, setDesplegables] = useState({
    desplegable1: false,
    desplegable2: false,
    desplegable3: false
  });

  const toggleDesplegable = (key: keyof typeof desplegables) => {
    setDesplegables(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Más Información</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Desplegable 1 */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleDesplegable('desplegable1')}
              className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <span className="font-medium">Desplegable 1</span>
              <span className="text-gray-500">
                {desplegables.desplegable1 ? '−' : '+'}
              </span>
            </button>
            {desplegables.desplegable1 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <p className="text-gray-600">
                  Desplegable 1
                </p>
              </div>
            )}
          </div>

          {/* Desplegable 2 */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleDesplegable('desplegable2')}
              className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <span className="font-medium">Desplegable 2</span>
              <span className="text-gray-500">
                {desplegables.desplegable2 ? '−' : '+'}
              </span>
            </button>
            {desplegables.desplegable2 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <p className="text-gray-600">
                  Desplegable 2. 
                </p>
              </div>
            )}
          </div>

          {/* Desplegable 3 */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleDesplegable('desplegable3')}
              className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <span className="font-medium">Desplegable 3</span>
              <span className="text-gray-500">
                {desplegables.desplegable3 ? '−' : '+'}
              </span>
            </button>
            {desplegables.desplegable3 && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <p className="text-gray-600">
                  Desplegable 3.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}