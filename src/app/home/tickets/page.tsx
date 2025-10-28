'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import BarraBusquedaTickets from '@/components/tickets/BarraBusquedaTickets';
import CreateTicketModal from "../../../components/tickets/CreateTicketModal";
import TicketsList from "../../../components/tickets/TicketsList";
import BotonNuevoTicket from "../../../components/tickets/BotonNuevoTicket";
import ToggleTickets, { TipoTicketFiltro } from "../../../components/tickets/ToggleTickets";
import { Ticket } from "../../../../types/ticket";
import FiltroUbicacion, { FiltroUbicacionTipo } from "../../../components/personal/FiltroUbicacion";
import PaginacionSuperiorTickets from "../../../components/tickets/PaginacionSuperiorTickets";
import PaginacionInferiorTickets from "../../../components/tickets/PaginacionInferiorTickets";
import { PaginationInfo } from "../../../../types/ticket";

// Constantes para paginación
const ITEMS_PER_PAGE = 10;

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsFiltrados, setTicketsFiltrados] = useState<Ticket[]>([]);
  const [ticketsMostrados, setTicketsMostrados] = useState<Ticket[]>([]);
  const [ticketsPaginados, setTicketsPaginados] = useState<Ticket[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<TipoTicketFiltro>("todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionTipo>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
        setTicketsFiltrados(data);
        setTicketsMostrados(data);
        
        // Calcular paginación inicial
        calcularPaginacion(data, 1);
      } else {
        setError('Error al cargar los tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular la paginación
  const calcularPaginacion = useCallback((ticketsList: Ticket[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTickets = ticketsList.slice(startIndex, endIndex);
    
    setTicketsPaginados(paginatedTickets);
    
    const totalPages = Math.ceil(ticketsList.length / ITEMS_PER_PAGE);
    setPagination({
      currentPage: page,
      totalPages,
      totalCount: ticketsList.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  }, []);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    calcularPaginacion(ticketsMostrados, page);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Función para aplicar filtro de ubicación
  const aplicarFiltroUbicacion = useCallback((ticketsList: Ticket[], filtro: FiltroUbicacionTipo): Ticket[] => {
    if (!filtro) return ticketsList;

    return ticketsList.filter(ticket => {
      // Solo filtrar tickets que tengan usuario afectado con dirección
      if (!ticket.usuarioAfectado?.direccion) return false;

      const direccionUsuario = ticket.usuarioAfectado.direccion;
      
      // Asegurarnos de que tenemos los datos necesarios
      if (!direccionUsuario.piso || !direccionUsuario.piso.id) {
        return false;
      }

      switch (filtro.tipo) {
        case 'piso':
          // Filtrar por ID de piso - asegurar comparación numérica
          return direccionUsuario.piso.id === Number(filtro.valor);

        case 'multi-piso':
          // Filtrar por múltiples IDs de piso - asegurar comparación numérica
          return filtro.valores.includes(Number(direccionUsuario.piso.id));

        case 'direccion':
          // Filtrar por ID de dirección - asegurar comparación numérica
          return direccionUsuario.id === Number(filtro.valor);

        default:
          return true;
      }
    });
  }, []);

  // Filtrar tickets por tipo
  useEffect(() => {
    let ticketsFiltradosPorTipo: Ticket[] = [];

    if (tipoFiltro === "todos") {
      ticketsFiltradosPorTipo = tickets;
    } else {
      ticketsFiltradosPorTipo = tickets.filter(ticket => {
        const tipoTicket = ticket.tipoTicket.tipo.toLowerCase();
        switch (tipoFiltro) {
          case "soporte":
            return tipoTicket === "soporte";
          case "redes":
            return tipoTicket === "redes" || tipoTicket === "redes y servidores";
          case "desarrollo":
            return tipoTicket === "desarrollo";
          case "sigesp":
            return tipoTicket === "siges";
          default:
            return true;
        }
      });
    }

    // Aplicar filtro de ubicación si existe
    const ticketsConUbicacion = aplicarFiltroUbicacion(ticketsFiltradosPorTipo, filtroUbicacion);
    setTicketsFiltrados(ticketsConUbicacion);
  }, [tickets, tipoFiltro, filtroUbicacion, aplicarFiltroUbicacion]);

  // Actualizar tickets mostrados cuando cambian los filtrados
  useEffect(() => {
    setTicketsMostrados(ticketsFiltrados);
    // Resetear a página 1 cuando cambian los filtros
    setCurrentPage(1);
    calcularPaginacion(ticketsFiltrados, 1);
  }, [ticketsFiltrados, calcularPaginacion]);

  // Actualizar paginación cuando cambia la página actual
  useEffect(() => {
    calcularPaginacion(ticketsMostrados, currentPage);
  }, [currentPage, ticketsMostrados, calcularPaginacion]);

  const handleTipoFiltroChange = (tipo: TipoTicketFiltro) => {
    setTipoFiltro(tipo);
  };

  const handleFiltroUbicacionChange = (filtro: FiltroUbicacionTipo) => {
    setFiltroUbicacion(filtro);
  };

  const handleResultadosBusqueda = (ticketsBuscados: Ticket[]) => {
    setTicketsMostrados(ticketsBuscados);
    setCurrentPage(1);
    calcularPaginacion(ticketsBuscados, 1);
  };

  const handleTicketCreated = () => {
    fetchTickets();
  };

  return (
    <>
      <Navbar />
      <Title text={"Tickets"} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Toggle de filtros justo debajo del título */}
        <div className="flex justify-center mb-6">
          <ToggleTickets 
            onTipoChange={handleTipoFiltroChange}
            tipoActivo={tipoFiltro}
          />
        </div>

        {/* Barra de búsqueda */}
        <BarraBusquedaTickets
          onResultadosChange={handleResultadosBusqueda}
          tickets={ticketsFiltrados}
          loading={isLoading}
        />

        {/* Paginación Superior */}
        <PaginacionSuperiorTickets
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={isLoading}
          tipoFiltro={tipoFiltro}
        />

        {/* Contenedor principal con filtros de ubicación y botón de nuevo ticket */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filtros de ubicación a la izquierda */}
            <div className="flex-1 w-full sm:w-auto">
              <FiltroUbicacion 
                onFiltroChange={handleFiltroUbicacionChange}
                loading={isLoading}
              />
            </div>

            {/* Botón de nuevo ticket a la derecha */}
            <div className="w-full sm:w-auto">
              <BotonNuevoTicket 
                onClick={() => setIsModalOpen(true)}
                loading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Lista de tickets paginados */}
        <TicketsList 
          tickets={ticketsPaginados}
          loading={isLoading}
          error={error}
        />

        {/* Paginación Inferior */}
        <PaginacionInferiorTickets
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={isLoading}
        />

        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    </>
  );
}