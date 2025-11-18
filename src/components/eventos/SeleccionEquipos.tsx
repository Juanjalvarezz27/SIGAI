'use client';

import { useState, useEffect } from 'react';
import { Cpu, X, Plus, Minus, CheckCircle, Search } from 'lucide-react';
import { EquipoSeleccionado, TipoEquipo } from '../../../types/eventos';
import BarraBusquedaTiposEquipo from './BarraBusquedaTiposEquipo';

interface SeleccionEquiposProps {
  equiposSeleccionados: EquipoSeleccionado[];
  onEquiposChange: (equipos: EquipoSeleccionado[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SeleccionEquipos({
  equiposSeleccionados,
  onEquiposChange,
  isOpen,
  onClose
}: SeleccionEquiposProps) {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [equiposTemporales, setEquiposTemporales] = useState<EquipoSeleccionado[]>([]);
  const [mostrarBusqueda, setMostrarBusqueda] = useState<boolean>(false);

  useEffect(() => {
    fetchTiposEquipo();
  }, []);

  // Sincronizar equipos temporales con los seleccionados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setEquiposTemporales([...equiposSeleccionados]);
    }
  }, [isOpen, equiposSeleccionados]);

  // Efecto para controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchTiposEquipo = async (): Promise<void> => {
    try {
      const response = await fetch('/api/equipos/tipos');
      if (response.ok) {
        const data = await response.json();
        setTiposEquipo(data.tipos || []);
      }
    } catch (error) {
      console.error('Error fetching tipos de equipo:', error);
      setTiposEquipo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEquipo = (tipoEquipo: TipoEquipo): void => {
    setEquiposTemporales(prev => {
      const existe = prev.find(e => e.tipoEquipoId === tipoEquipo.id);
      if (existe) {
        // Si ya existe, lo removemos
        return prev.filter(e => e.tipoEquipoId !== tipoEquipo.id);
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prev, {
          tipoEquipoId: tipoEquipo.id,
          nombre: tipoEquipo.nombre,
          cantidad: 1
        }];
      }
    });
  };

  const handleTipoEquipoSeleccionado = (tipoEquipo: TipoEquipo) => {
    handleToggleEquipo(tipoEquipo);
    setMostrarBusqueda(false);
  };

  const handleCantidadChange = (tipoEquipoId: number, cantidad: number): void => {
    if (cantidad < 0) return;

    setEquiposTemporales(prev =>
      prev.map(equipo =>
        equipo.tipoEquipoId === tipoEquipoId
          ? { ...equipo, cantidad }
          : equipo
      )
    );
  };

  const handleAplicar = (): void => {
    // Filtrar equipos con cantidad > 0
    const equiposValidos = equiposTemporales.filter(equipo => equipo.cantidad > 0);
    onEquiposChange(equiposValidos);
    onClose();
  };

  const limpiarSeleccion = (): void => {
    setEquiposTemporales([]);
  };

  const estaEquipoSeleccionado = (tipoEquipoId: number): boolean => {
    return equiposTemporales.some(e => e.tipoEquipoId === tipoEquipoId);
  };

  const getCantidadTemporal = (tipoEquipoId: number): number => {
    const equipo = equiposTemporales.find(e => e.tipoEquipoId === tipoEquipoId);
    return equipo?.cantidad || 0;
  };

  const totalEquipos: number = equiposTemporales.reduce((sum: number, equipo: EquipoSeleccionado) => sum + equipo.cantidad, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Seleccionar Equipos
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona los tipos de equipo y configura las cantidades necesarias
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Lista de tipos de equipo */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">Tipos de Equipo Disponibles</h4>
              <button
                onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search size={16} />
                {mostrarBusqueda ? 'Ocultar búsqueda' : 'Buscar equipo'}
              </button>
            </div>

            {/* Barra de búsqueda */}
            {mostrarBusqueda && (
              <div className="mb-6">
                <BarraBusquedaTiposEquipo
                  onTipoEquipoSeleccionado={handleTipoEquipoSeleccionado}
                  placeholder="Buscar por nombre de equipo..."
                  label="Buscar equipo rápido"
                />
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tiposEquipo.map((tipo: TipoEquipo) => {
                  const seleccionado = estaEquipoSeleccionado(tipo.id);
                  const cantidad = getCantidadTemporal(tipo.id);

                  return (
                    <div
                      key={tipo.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        seleccionado
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleToggleEquipo(tipo)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            seleccionado ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Cpu size={20} />
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${
                              seleccionado ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {tipo.nombre}
                            </span>
                            {seleccionado && cantidad > 0 && (
                              <p className="text-sm text-blue-600 mt-1">
                                {cantidad} unidad{cantidad !== 1 ? 'es' : ''} seleccionada{cantidad !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        {seleccionado && (
                          <div className="flex items-center gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleCantidadChange(tipo.id, cantidad - 1)}
                              disabled={cantidad <= 1}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-medium text-lg">
                              {cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCantidadChange(tipo.id, cantidad + 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen de selección */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
            <h4 className="font-medium text-gray-700 mb-4">Resumen de Selección</h4>

            {equiposTemporales.filter(e => e.cantidad > 0).length === 0 ? (
              <div className="text-center py-8">
                <Cpu size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No hay equipos seleccionados
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Haz clic en los tipos de equipo para seleccionarlos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total de equipos:</span>
                    <span className="text-lg font-bold text-blue-600">{totalEquipos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tipos seleccionados:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {equiposTemporales.filter(e => e.cantidad > 0).length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Detalle:</h5>
                  {equiposTemporales
                    .filter((equipo: EquipoSeleccionado) => equipo.cantidad > 0)
                    .map((equipo: EquipoSeleccionado) => (
                      <div key={equipo.tipoEquipoId} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-800 flex-1 pr-2">
                            {equipo.nombre}
                          </span>
                          <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                            {equipo.cantidad}u
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(equipo.tipoEquipoId, equipo.cantidad - 1)}
                            disabled={equipo.cantidad <= 1}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCantidadChange(equipo.tipoEquipoId, equipo.cantidad + 1)}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors flex-1"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleEquipo({ id: equipo.tipoEquipoId, nombre: equipo.nombre })}
                            className="w-6 h-6 rounded border border-red-300 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors flex-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botones de acción */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={limpiarSeleccion}
              disabled={equiposTemporales.length === 0}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Limpiar todo
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAplicar}
              disabled={equiposTemporales.filter(e => e.cantidad > 0).length === 0}
              className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Aplicar ({equiposTemporales.filter(e => e.cantidad > 0).length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}