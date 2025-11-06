'use client';

import { useState, useRef} from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import ModalNuevoEvento from "@/components/eventos/ModalNuevoEvento";
import ListaEventosExternos from "@/components/eventos/ListaEventosExternos";
import FiltroEventosExternos from "@/components/eventos/FiltroEventosExternos";
import BarraBusquedaEventos from "@/components/eventos/BarraBusquedaEventos";
import { EventoExterno } from '../../../../types/eventos';

export default function EventosExternos() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string>('todos');
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoExterno | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const listaRef = useRef<HTMLDivElement>(null);

  const handleEventCreated = (): void => {
    setRefreshKey(prev => prev + 1);
    setEventoSeleccionado(null);
    setCurrentPage(1); // Volver a la primera página al crear nuevo evento
  };

  const handleFiltroChange = (filtro: string): void => {
    setFiltroSeleccionado(filtro);
    setEventoSeleccionado(null);
    setCurrentPage(1); // Resetear a página 1 al cambiar filtro
  };

  const handleEventoSeleccionado = (evento: EventoExterno): void => {
    setEventoSeleccionado(evento);
    setCurrentPage(1); // Ir a página 1 al seleccionar búsqueda
    
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
  };

  const limpiarBusqueda = (): void => {
    setEventoSeleccionado(null);
  };

  return (
    <>
      <Navbar />
      <Title text={"Eventos Externos"} />

      <div className="container mx-auto px-4 py-8">
        {/* Header con filtros y búsqueda */}
        <div className="mb-8">
          {/* Primera fila: Filtro toggle y botón nuevo evento */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full lg:w-auto">
              <FiltroEventosExternos
                filtroSeleccionado={filtroSeleccionado}
                onFiltroChange={handleFiltroChange}
              />
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#001f3f] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center gap-2 shadow-sm whitespace-nowrap w-full lg:w-auto justify-center"
            >
              <span>+</span>
              <span>Nuevo Evento</span>
            </button>
          </div>

          {/* Segunda fila: Barra de búsqueda completa */}
          <div className="w-full">
            <BarraBusquedaEventos
              onEventoSeleccionado={handleEventoSeleccionado}
              placeholder="Buscar por nombre de evento o solicitante..."
              label="Buscar eventos"
            />
          </div>
        </div>

        {/* Indicador de búsqueda activa */}
        {eventoSeleccionado && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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

        {/* Lista de eventos con ref para scroll */}
        <div ref={listaRef}>
          <ListaEventosExternos 
            key={`${refreshKey}-${filtroSeleccionado}`} 
            filtro={filtroSeleccionado}
            eventoSeleccionado={eventoSeleccionado?.id}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <ModalNuevoEvento
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={handleEventCreated}
        />
      </div>
    </>
  );
}