'use client';

import { useState, useEffect } from 'react';
import { Cpu, User, MapPin, Calendar, Clock, CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { EventoExterno } from '../../../types/eventos';
import ModalAceptarEvento from './ModalAceptarEvento';
import ModalRechazarEvento from './ModalRechazarEvento';

interface ListaEventosExternosProps {
  filtro?: string;
  eventoSeleccionado?: number; // ID del evento seleccionado por búsqueda
}

export default function ListaEventosExternos({ 
  filtro = 'todos', 
  eventoSeleccionado 
}: ListaEventosExternosProps) {
  const [eventos, setEventos] = useState<EventoExterno[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<EventoExterno[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [descripcionAbierta, setDescripcionAbierta] = useState<{[key: number]: boolean}>({});
  const [equiposAbiertos, setEquiposAbiertos] = useState<{[key: number]: boolean}>({});
  const [motivoAbierto, setMotivoAbierto] = useState<{[key: number]: boolean}>({});
  const [modalAceptarAbierto, setModalAceptarAbierto] = useState<number | null>(null);
  const [modalRechazarAbierto, setModalRechazarAbierto] = useState<number | null>(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    if (filtro === 'todos') {
      setEventosFiltrados(eventos);
    } else {
      const filtrados = eventos.filter(evento => evento.estado === filtro);
      setEventosFiltrados(filtrados);
    }
  }, [eventos, filtro]);

  const fetchEventos = async (): Promise<void> => {
    try {
      const response = await fetch('/api/eventos-externos');
      if (response.ok) {
        const data: EventoExterno[] = await response.json();
        setEventos(data);
      } else {
        console.error('Error fetching eventos');
      }
    } catch (error) {
      console.error('Error fetching eventos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDescripcion = (eventoId: number): void => {
    setDescripcionAbierta(prev => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };

  const toggleEquipos = (eventoId: number): void => {
    setEquiposAbiertos(prev => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };

  const toggleMotivo = (eventoId: number): void => {
    setMotivoAbierto(prev => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };

  const cambiarEstado = async (eventoId: number, estado: string, motivo?: string): Promise<void> => {
    setUpdatingId(eventoId);
    try {
      const response = await fetch(`/api/eventos-externos/${eventoId}/estado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado, motivo }),
      });

      if (response.ok) {
        await fetchEventos();
        // Cerrar modales
        setModalAceptarAbierto(null);
        setModalRechazarAbierto(null);
      } else {
        const errorData: { error?: string } = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo actualizar el estado'}`);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado. Por favor, intente nuevamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  const volverAEnProceso = async (eventoId: number): Promise<void> => {
    setUpdatingId(eventoId);
    try {
      const response = await fetch(`/api/eventos-externos/${eventoId}/reset-estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchEventos();
      } else {
        const errorData: { error?: string } = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo volver a En proceso'}`);
      }
    } catch (error) {
      console.error('Error volviendo a En proceso:', error);
      alert('Error al volver a En proceso. Por favor, intente nuevamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatFechaCompleta = (fecha: string): string => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aceptado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'En proceso':
        return <Clock size={16} className="text-yellow-600" />;
      case 'Aceptado':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Rechazado':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getMotivoColor = (estado: string): string => {
    switch (estado) {
      case 'Aceptado':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Rechazado':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Cargando eventos...</p>
      </div>
    );
  }

  if (eventosFiltrados.length === 0) {
    const mensajes = {
      'todos': 'No hay eventos externos',
      'En proceso': 'No hay eventos en proceso',
      'Aceptado': 'No hay eventos aceptados',
      'Rechazado': 'No hay eventos rechazados'
    };

    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {mensajes[filtro as keyof typeof mensajes] || 'No hay eventos'}
        </h3>
        <p className="text-gray-500">
          {filtro === 'todos' 
            ? 'No se han creado eventos externos aún.'
            : `No se encontraron eventos con estado "${filtro}".`
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        {eventosFiltrados.map((evento: EventoExterno) => (
          <div 
            key={evento.id} 
            className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-300 animate-fade-in-up ${
              eventoSeleccionado === evento.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            {/* Header con título y estado */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 pr-4">
                {evento.nombre}
              </h3>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getEstadoColor(evento.estado)} flex items-center gap-1.5 shrink-0`}>
                {getEstadoIcon(evento.estado)}
                {evento.estado}
              </span>
            </div>

            {/* Información del evento en grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Columna izquierda - Información de usuarios */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-700">Solicitante</p>
                    <p className="text-sm text-gray-600">
                      {evento.usuarioSolicitante.nombre} {evento.usuarioSolicitante.apellido || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-700">Asignado a</p>
                    <p className="text-sm text-gray-600">
                      {evento.usuarioAsignado.nombre} {evento.usuarioAsignado.apellido || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Ubicación y fechas */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-700">Ubicación</p>
                    <p className="text-sm text-gray-600">
                      {evento.direccion.direccion} - Piso {evento.piso.piso}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-700">Fechas</p>
                    <p className="text-sm text-gray-600">
                      {formatFecha(evento.fechaInicial)} - {formatFecha(evento.fechaFinal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción - Botón desplegable */}
            {evento.descripcion && (
              <div className="mb-4">
                <button
                  onClick={() => toggleDescripcion(evento.id)}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition-colors duration-300">
                    Descripción
                  </span>
                  {descripcionAbierta[evento.id] ? (
                    <ChevronUp size={16} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  ) : (
                    <ChevronDown size={16} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  )}
                </button>
                {descripcionAbierta[evento.id] && (
                  <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg animate-slide-down">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {evento.descripcion}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Equipos solicitados - Botón desplegable */}
            {evento.equiposEvento.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleEquipos(evento.id)}
                  className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-sm font-bold text-green-700 group-hover:text-green-800 transition-colors duration-300">
                    Equipos solicitados ({evento.equiposEvento.length})
                  </span>
                  {equiposAbiertos[evento.id] ? (
                    <ChevronUp size={16} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  ) : (
                    <ChevronDown size={16} className="text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  )}
                </button>
                {equiposAbiertos[evento.id] && (
                  <div className="mt-2 animate-slide-down">
                    <div className="grid grid-cols-2 gap-2">
                      {evento.equiposEvento.map((equipo, index: number) => (
                        <div
                          key={index}
                          className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center justify-between transition-colors duration-300 hover:bg-green-100"
                        >
                          <span className="text-sm font-medium text-green-700 truncate">
                            {equipo.tipoEquipo.nombre}
                          </span>
                          <span className="text-sm font-bold text-green-800 bg-green-100 px-2 py-1 rounded text-xs">
                            {equipo.cantidad}u
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Motivo de aceptación/rechazo - Botón desplegable */}
            {(evento.estado === 'Aceptado' || evento.estado === 'Rechazado') && evento.estadoDetalle && (
              <div className="mb-4">
                <button
                  onClick={() => toggleMotivo(evento.id)}
                  className={`w-full flex items-center justify-between p-3 ${getMotivoColor(evento.estado)} border rounded-lg hover:opacity-90 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className={evento.estado === 'Aceptado' ? 'text-green-600' : 'text-red-600'} />
                    <span className="text-sm font-bold">
                      {evento.estado === 'Aceptado' ? 'Motivo de aceptación' : 'Motivo de rechazo'}
                    </span>
                  </div>
                  {motivoAbierto[evento.id] ? (
                    <ChevronUp size={16} className={evento.estado === 'Aceptado' ? 'text-green-600' : 'text-red-600'} />
                  ) : (
                    <ChevronDown size={16} className={evento.estado === 'Aceptado' ? 'text-green-600' : 'text-red-600'} />
                  )}
                </button>
                {motivoAbierto[evento.id] && evento.estadoDetalle && (
                  <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg animate-slide-down">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {evento.estadoDetalle.motivo || 'No se especificó un mensaje.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                      <span>
                        Por: {evento.estadoDetalle.usuario.nombre} {evento.estadoDetalle.usuario.apellido || ''}
                      </span>
                      <span>
                        {formatFechaCompleta(evento.estadoDetalle.fecha)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200">
              {evento.estado === 'En proceso' && (
                <>
                  <button
                    onClick={() => setModalAceptarAbierto(evento.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={14} />
                    Aceptar
                  </button>
                  <button
                    onClick={() => setModalRechazarAbierto(evento.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <XCircle size={14} />
                    Rechazar
                  </button>
                </>
              )}
              {(evento.estado === 'Aceptado' || evento.estado === 'Rechazado') && (
                <button
                  onClick={() => volverAEnProceso(evento.id)}
                  disabled={updatingId === evento.id}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  {updatingId === evento.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={14} />
                      Volver a En proceso
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {modalAceptarAbierto && (
        <ModalAceptarEvento
          isOpen={!!modalAceptarAbierto}
          onClose={() => setModalAceptarAbierto(null)}
          onAceptar={(motivo) => cambiarEstado(modalAceptarAbierto, 'Aceptado', motivo)}
          isLoading={updatingId === modalAceptarAbierto}
        />
      )}

      {modalRechazarAbierto && (
        <ModalRechazarEvento
          isOpen={!!modalRechazarAbierto}
          onClose={() => setModalRechazarAbierto(null)}
          onRechazar={(motivo) => cambiarEstado(modalRechazarAbierto, 'Rechazado', motivo)}
          isLoading={updatingId === modalRechazarAbierto}
        />
      )}
    </>
  );
}