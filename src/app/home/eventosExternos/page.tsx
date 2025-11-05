'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import ModalNuevoEvento from "@/components/eventos/ModalNuevoEvento";
import ListaEventosExternos from "@/components/eventos/ListaEventosExternos";

export default function EventosExternos() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleEventCreated = (): void => {
    setRefreshKey(prev => prev + 1); // Forzar recarga de la lista
  };

  return (
    <>
      <Navbar />
      <Title text={"Eventos Externos"} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#001f3f] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <span>+</span>
            <span>Nuevo Evento</span>
          </button>
        </div>

        <ListaEventosExternos key={refreshKey} />
        
        <ModalNuevoEvento
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={handleEventCreated}
        />
      </div>
    </>
  );
}