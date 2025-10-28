'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import TicketsList from "@/components/tickets/TicketsList";
import BotonNuevoTicket from "@/components/tickets/BotonNuevoTicket";
import { Ticket } from "../../../../types/ticket";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
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

  const handleTicketCreated = () => {
    fetchTickets(); // Refrescar la lista después de crear un ticket
  };

  return (
    <>
      <Navbar />
      <Title text={"Tickets"} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <BotonNuevoTicket 
              onClick={() => setIsModalOpen(true)}
              loading={isLoading}
            />
          </div>
        </div>

        <TicketsList 
          tickets={tickets}
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