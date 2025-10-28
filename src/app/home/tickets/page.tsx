'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import BarraBusquedaTickets from '@/components/tickets/BarraBusquedaTickets';
import CreateTicketModal from "../../../components/tickets/CreateTicketModal";
import TicketsList from "../../../components/tickets/TicketsList";
import BotonNuevoTicket from "../../../components/tickets/BotonNuevoTicket";
import ToggleTickets, { TipoTicketFiltro } from "../../../components/tickets/ToggleTickets";
import { Ticket } from "../../../../types/ticket";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsFiltrados, setTicketsFiltrados] = useState<Ticket[]>([]);
  const [ticketsMostrados, setTicketsMostrados] = useState<Ticket[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<TipoTicketFiltro>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filtrar tickets por tipo
  useEffect(() => {
    if (tipoFiltro === "todos") {
      setTicketsFiltrados(tickets);
    } else {
      const ticketsFiltrados = tickets.filter(ticket => {
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
      setTicketsFiltrados(ticketsFiltrados);
    }
  }, [tickets, tipoFiltro]);

  // Actualizar tickets mostrados cuando cambian los filtrados
  useEffect(() => {
    setTicketsMostrados(ticketsFiltrados);
  }, [ticketsFiltrados]);

  const handleTipoFiltroChange = (tipo: TipoTicketFiltro) => {
    setTipoFiltro(tipo);
  };

  const handleResultadosBusqueda = (ticketsBuscados: Ticket[]) => {
    setTicketsMostrados(ticketsBuscados);
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

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Gestión de Tickets</h2>
              <p className="text-gray-600 mt-1">Crea y gestiona los tickets del sistema</p>
            </div>
            <BotonNuevoTicket 
              onClick={() => setIsModalOpen(true)}
              loading={isLoading}
            />
          </div>
        </div>

        <TicketsList 
          tickets={ticketsMostrados}
          loading={isLoading}
          error={error}
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