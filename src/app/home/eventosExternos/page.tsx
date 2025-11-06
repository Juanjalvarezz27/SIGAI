'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import ModalNuevoEvento from "@/components/eventos/ModalNuevoEvento";
import ListaEventosExternos from "@/components/eventos/ListaEventosExternos";
import FiltroEventosExternos from "@/components/eventos/FiltroEventosExternos";
import BarraBusquedaEventos from "@/components/eventos/BarraBusquedaEventos";
import FiltroUbicacion, { FiltroUbicacionTipo } from "../../../components/personal/FiltroUbicacion";
import FiltroPeriodo from "@/components/tickets/FiltroPeriodo";
import PaginacionSuperiorEventos from "@/components/eventos/PaginacionSuperiorEventos";
import PaginacionInferiorEventos from "@/components/eventos/PaginacionInferiorEventos";
import { EventoExterno, PaginationInfo } from '../../../../types/eventos';

export default function EventosExternos() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string>('todos');
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionTipo>(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState<{ fechaInicio: Date | null; fechaFin: Date | null }>({
    fechaInicio: null,
    fechaFin: null
  });
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoExterno | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const listaRef = useRef<HTMLDivElement>(null);

  // Función para cargar eventos
  const fetchEventos = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (filtroSeleccionado !== 'todos') {
        params.append('estado', filtroSeleccionado);
      }

      // Agregar filtros de ubicación si existen
      if (filtroUbicacion) {
        switch (filtroUbicacion.tipo) {
          case 'piso':
            params.append('pisoId', filtroUbicacion.valor.toString());
            break;
          case 'direccion':
            params.append('direccionId', filtroUbicacion.valor.toString());
            break;
          case 'multi-piso':
            filtroUbicacion.valores.forEach(id => {
              params.append('pisoIds', id.toString());
            });
            break;
        }
      }

      // Agregar filtros de período si existen
      if (filtroPeriodo.fechaInicio && filtroPeriodo.fechaFin) {
        params.append('fechaInicio', filtroPeriodo.fechaInicio.toISOString());
        params.append('fechaFin', filtroPeriodo.fechaFin.toISOString());
      }

      const response = await fetch(`/api/eventos-externos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPagination(data.pagination || null);
      } else {
        console.error('Error fetching eventos');
      }
    } catch (error) {
      console.error('Error fetching eventos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [currentPage, filtroSeleccionado, filtroUbicacion, filtroPeriodo]);

  const handleEventCreated = (): void => {
    setRefreshKey(prev => prev + 1);
    setEventoSeleccionado(null);
    setCurrentPage(1);
  };

  const handleFiltroChange = (filtro: string): void => {
    setFiltroSeleccionado(filtro);
    setEventoSeleccionado(null);
    setCurrentPage(1);
  };

  const handleFiltroUbicacionChange = (filtro: FiltroUbicacionTipo): void => {
    setFiltroUbicacion(filtro);
    setEventoSeleccionado(null);
    setCurrentPage(1);
  };

  const handleFiltroPeriodoChange = (fechaInicio: Date | null, fechaFin: Date | null): void => {
    setFiltroPeriodo({ fechaInicio, fechaFin });
    setEventoSeleccionado(null);
    setCurrentPage(1);
  };

  const handleEventoSeleccionado = (evento: EventoExterno): void => {
    setEventoSeleccionado(evento);
    setCurrentPage(1);
    
    setTimeout(() => {
      if (listaRef.current) {
        listaRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarBusqueda = (): void => {
    setEventoSeleccionado(null);
  };

  const limpiarFiltroUbicacion = (): void => {
    setFiltroUbicacion(null);
  };

  const limpiarFiltroPeriodo = (): void => {
    setFiltroPeriodo({ fechaInicio: null, fechaFin: null });
  };

  return (
    <>
      <Navbar />
      <Title text={"Eventos Externos"} />

      <div className="container mx-auto px-4 py-8">
        {/* Header con filtros y búsqueda */}
        <div className="mb-8">
          {/* Filtro toggle y botón nuevo evento */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-6">
            <div className="w-full lg:w-auto">
              <FiltroEventosExternos
                filtroSeleccionado={filtroSeleccionado}
                onFiltroChange={handleFiltroChange}
              />
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#001f3f] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors -mt-9 font-medium flex items-center gap-2 shadow-sm whitespace-nowrap w-full lg:w-auto justify-center"
            >
              <span>+</span>
              <span>Nuevo Evento</span>
            </button>
          </div>

          {/* Barra de búsqueda completa */}
          <div className="w-full">
            <BarraBusquedaEventos
              onEventoSeleccionado={handleEventoSeleccionado}
              placeholder="Buscar por nombre de evento o solicitante..."
              label="Buscar eventos"
            />
          </div>
        </div>

        {/* Indicadores de filtros activos */}
        <div className="space-y-3 mb-6">
          {/* Indicador de búsqueda activa */}
          {eventoSeleccionado && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-sm text-blue-700">
                  Resultado de búsqueda: <strong>{eventoSeleccionado.nombre}</strong>
                  <span className="ml-2 text-blue-600">
                    • {eventoSeleccionado.usuarioSolicitante.nombre} {eventoSeleccionado.usuarioSolicitante.apellido || ''}
                  </span>
                </p>
                <button
                  onClick={limpiarBusqueda}
                  className="text-blue-500 hover:text-blue-700 underline text-sm whitespace-nowrap"
                >
                  Mostrar todos los eventos
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Paginación Superior */}
        <PaginacionSuperiorEventos
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={isLoading}
          filtro={filtroSeleccionado}
        />

        {/* Filtros de ubicación y período */}
        <div className="flex gap-6 mb-6">
          {/* Filtro de ubicación */}
              <div>
                <FiltroUbicacion
                  onFiltroChange={handleFiltroUbicacionChange}
                  loading={isLoading}
                />
              </div>

          {/* Filtro de período */}
          <div>
                <FiltroPeriodo
                  onFiltroChange={handleFiltroPeriodoChange}
                  loading={isLoading}
                />
              </div>
        </div>

        {/* Lista de eventos con ref para scroll */}
        <div ref={listaRef}>
          <ListaEventosExternos 
            key={`${refreshKey}-${filtroSeleccionado}-${JSON.stringify(filtroUbicacion)}-${JSON.stringify(filtroPeriodo)}-${currentPage}`} 
            filtro={filtroSeleccionado}
            filtroUbicacion={filtroUbicacion}
            filtroPeriodo={filtroPeriodo}
            eventoSeleccionado={eventoSeleccionado?.id}
            currentPage={currentPage}
            isLoading={isLoading}
          />
        </div>

        {/* Paginación Inferior */}
        <PaginacionInferiorEventos
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={isLoading}
        />

        <ModalNuevoEvento
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={handleEventCreated}
        />
      </div>
    </>
  );
}