'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import BarraBusquedaTickets from '@/components/tickets/BarraBusquedaTickets';
import CreateTicketModal from "../../../components/tickets/CreateTicketModal";
import TicketsList from "../../../components/tickets/TicketsList";
import BotonNuevoTicket from "../../../components/tickets/BotonNuevoTicket";
import ToggleTickets, { TipoTicketFiltro } from "../../../components/tickets/ToggleTickets";
import ToggleEstadoTickets, { EstadoTicketFiltro } from "../../../components/tickets/ToggleEstadoTickets";
import { Ticket } from "../../../../types/ticket";
import FiltroUbicacion, { FiltroUbicacionTipo } from "../../../components/personal/FiltroUbicacion";
import PaginacionSuperiorTickets from "../../../components/tickets/PaginacionSuperiorTickets";
import PaginacionInferiorTickets from "../../../components/tickets/PaginacionInferiorTickets";
import { PaginationInfo } from "../../../../types/ticket";
import { CheckCircle } from "lucide-react";
import { useUserRol } from '../../hooks/useUserRol';
import AgregarSistemaButton from "../../../components/tickets/AgregarSistemaButton";
import FiltroPeriodo from "../../../components/tickets/FiltroPeriodo";

// Constantes para paginación
const ITEMS_PER_PAGE = 10;

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsFiltrados, setTicketsFiltrados] = useState<Ticket[]>([]);
  const [ticketsMostrados, setTicketsMostrados] = useState<Ticket[]>([]);
  const [ticketsPaginados, setTicketsPaginados] = useState<Ticket[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<TipoTicketFiltro>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoTicketFiltro>("activos");
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionTipo>(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState<{
    fechaInicio: Date | null;
    fechaFin: Date | null;
  }>({
    fechaInicio: null,
    fechaFin: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string>('');

  const { userRol, loading: loadingRol } = useUserRol();

  // Determinar qué elementos mostrar según el rol
  const puedeCrearTickets = userRol ? (userRol.rolId === 1 || userRol.rolId === 3) : false;
  const puedeVerFiltrosUbicacion = userRol ? userRol.rolId === 1 : false;
  const puedeReasignarTickets = userRol ? (userRol.rolId === 1 || userRol.rolId === 2) : false;

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

  // Función para cargar tickets
  const fetchTickets = useCallback(async () => {
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
  }, [calcularPaginacion]);

  // Función para mostrar mensaje de éxito temporal
  const mostrarMensajeExito = useCallback((mensaje: string) => {
    setMensajeExito(mensaje);
    setTimeout(() => {
      setMensajeExito('');
    }, 3000);
  }, []);

  // Función para cambiar de página
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    calcularPaginacion(ticketsMostrados, page);
  }, [ticketsMostrados, calcularPaginacion]);

  useEffect(() => {
    if (!loadingRol) {
      fetchTickets();
    }
  }, [loadingRol, fetchTickets]);

  // Función para aplicar filtro de ubicación
  const aplicarFiltroUbicacion = useCallback((ticketsList: Ticket[], filtro: FiltroUbicacionTipo): Ticket[] => {
    if (!filtro || !puedeVerFiltrosUbicacion) return ticketsList;

    return ticketsList.filter(ticket => {
      if (!ticket.usuarioAfectado?.direccion) return false;

      const direccionUsuario = ticket.usuarioAfectado.direccion;

      if (!direccionUsuario.piso || !direccionUsuario.piso.id) {
        return false;
      }

      switch (filtro.tipo) {
        case 'piso':
          return direccionUsuario.piso.id === Number(filtro.valor);
        case 'multi-piso':
          return filtro.valores.includes(Number(direccionUsuario.piso.id));
        case 'direccion':
          return direccionUsuario.id === Number(filtro.valor);
        default:
          return true;
      }
    });
  }, [puedeVerFiltrosUbicacion]);

  // Función para aplicar filtro de estado
  const aplicarFiltroEstado = useCallback((ticketsList: Ticket[], estado: EstadoTicketFiltro): Ticket[] => {
    if (estado === "activos") {
      return ticketsList.filter(ticket => ticket.estadoId === 1);
    } else {
      return ticketsList.filter(ticket => ticket.estadoId === 2);
    }
  }, []);

  // Función para aplicar filtro de período
  const aplicarFiltroPeriodo = useCallback((ticketsList: Ticket[], periodo: { fechaInicio: Date | null; fechaFin: Date | null }): Ticket[] => {
    if (!periodo.fechaInicio || !periodo.fechaFin) return ticketsList;

    return ticketsList.filter(ticket => {
      const fechaCreacion = new Date(ticket.fecha_creacion);
      return fechaCreacion >= periodo.fechaInicio! && fechaCreacion <= periodo.fechaFin!;
    });
  }, []);

  // Función para manejar el cambio de filtro de período
  const handleFiltroPeriodoChange = (fechaInicio: Date | null, fechaFin: Date | null) => {
    setFiltroPeriodo({ fechaInicio, fechaFin });
  };

  // Filtrar tickets por tipo, estado, ubicación y período
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
          case "sistemas":
            return tipoTicket === "sistemas";
          default:
            return true;
        }
      });
    }

    // Aplicar filtro de estado
    const ticketsConEstado = aplicarFiltroEstado(ticketsFiltradosPorTipo, estadoFiltro);

    // Aplicar filtro de ubicación si existe y tiene permisos
    const ticketsConUbicacion = aplicarFiltroUbicacion(ticketsConEstado, filtroUbicacion);

    // Aplicar filtro de período
    const ticketsConPeriodo = aplicarFiltroPeriodo(ticketsConUbicacion, filtroPeriodo);

    setTicketsFiltrados(ticketsConPeriodo);
  }, [tickets, tipoFiltro, estadoFiltro, filtroUbicacion, filtroPeriodo, aplicarFiltroUbicacion, aplicarFiltroEstado, aplicarFiltroPeriodo]);

  // Actualizar tickets mostrados cuando cambian los filtrados
  useEffect(() => {
    setTicketsMostrados(ticketsFiltrados);
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

  const handleEstadoFiltroChange = (estado: EstadoTicketFiltro) => {
    setEstadoFiltro(estado);
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

  const handleTicketClosed = () => {
    fetchTickets();
    mostrarMensajeExito('Ticket cerrado con éxito');
  };

  const handleTicketReasigned = () => {
    fetchTickets();
    mostrarMensajeExito('Ticket reasignado con éxito');
  };

  if (loadingRol) {
    return (
      <>
        <Navbar />
        <Title text={"Tickets"} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Title text={"Tickets"} />

      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className="fixed top-20 right-4 z-50 animate-fade-in">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{mensajeExito}</span>
            </div>
          </div>
        )}

        <div className='flex justify-center gap-3'>
          {/* Toggle de filtros justo debajo del título */}
          <div className="flex justify-center mb-6">
            <ToggleTickets
              onTipoChange={handleTipoFiltroChange}
              tipoActivo={tipoFiltro}
            />
          </div>

          {/* Filtro por período */}
          <div className="z-[-1] mb-6 flex justify-end">
            <FiltroPeriodo
              onFiltroChange={handleFiltroPeriodoChange}
              loading={isLoading}
            />
          </div>
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
          estadoFiltro={estadoFiltro}
        />

        {/* Contenedor principal con filtros de ubicación y botones a la derecha */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filtros de ubicación a la izquierda - Solo para Admin */}
            {puedeVerFiltrosUbicacion && (
              <div className="flex-1 w-full sm:w-auto">
                <FiltroUbicacion
                  onFiltroChange={handleFiltroUbicacionChange}
                  loading={isLoading}
                />
              </div>
            )}

            {/* Botones a la derecha: Agregar Sistema, Nuevo ticket y Toggle estado */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Botón Agregar Sistema - Solo se muestra cuando el filtro es "sistemas" */}
              <AgregarSistemaButton tipoFiltro={tipoFiltro} />
              
              {/* Botón Nuevo Ticket - Solo para Admin y Solicitante */}
              {puedeCrearTickets && (
                <BotonNuevoTicket
                  onClick={() => setIsModalOpen(true)}
                  loading={isLoading}
                />
              )}
              <ToggleEstadoTickets
                onEstadoChange={handleEstadoFiltroChange}
                estadoActivo={estadoFiltro}
              />
            </div>
          </div>
        </div>

        {/* Lista de tickets paginados */}
        <TicketsList
          tickets={ticketsPaginados}
          loading={isLoading}
          error={error}
          onTicketClosed={handleTicketClosed}
          onTicketReasigned={handleTicketReasigned}
          puedeReasignar={puedeReasignarTickets}
        />

        {/* Paginación Inferior */}
        <PaginacionInferiorTickets
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={isLoading}
        />

        {/* Modal de crear ticket - Solo para Admin y Solicitante */}
        {puedeCrearTickets && (
          <CreateTicketModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTicketCreated={handleTicketCreated}
            userRol={userRol}
          />
        )}
      </div>
    </>
  );
}