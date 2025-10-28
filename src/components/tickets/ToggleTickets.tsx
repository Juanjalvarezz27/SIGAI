"use client"

import { useState } from "react"
import { Monitor, Server, Code, Database, List } from "lucide-react"

export type TipoTicketFiltro = "todos" | "soporte" | "redes" | "desarrollo" | "sigesp"

interface ToggleTicketsProps {
  onTipoChange: (tipo: TipoTicketFiltro) => void
  tipoActivo?: TipoTicketFiltro
}

export default function ToggleTickets({ onTipoChange, tipoActivo = "todos" }: ToggleTicketsProps) {
  const [tipoInterno, setTipoInterno] = useState<TipoTicketFiltro>(tipoActivo)

  const opciones = [
    { 
      tipo: "todos" as TipoTicketFiltro, 
      label: "Todos", 
      icono: List,
    },
    { 
      tipo: "soporte" as TipoTicketFiltro, 
      label: "Soporte", 
      icono: Monitor,
    },
    { 
      tipo: "redes" as TipoTicketFiltro, 
      label: "Redes", 
      icono: Server,
    },
    { 
      tipo: "desarrollo" as TipoTicketFiltro, 
      label: "Desarrollo", 
      icono: Code,
    },
    { 
      tipo: "sigesp" as TipoTicketFiltro, 
      label: "Sigesp", 
      icono: Database,
    }
  ]

  const handleTipoChange = (tipo: TipoTicketFiltro) => {
    setTipoInterno(tipo)
    onTipoChange(tipo)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 rounded-lg p-2 flex">
        {opciones.map((opcion) => {
          const Icono = opcion.icono
          const estaActivo = tipoInterno === opcion.tipo
          
          return (
            <button
              key={opcion.tipo}
              onClick={() => handleTipoChange(opcion.tipo)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer
                ${
                  estaActivo
                    ? 'bg-white text-[#001F3F] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              <Icono className="w-4 h-4" />
              <span>{opcion.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}