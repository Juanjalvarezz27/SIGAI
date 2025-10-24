"use client"

import { useState } from "react"
import { Users, Laptop, Ticket, Calendar } from "lucide-react"

type TipoEstadistica = "personal" | "equipos" | "tickets" | "eventos"

interface ToggleEstadisticasProps {
  onTipoChange: (tipo: TipoEstadistica) => void
}

export default function ToggleEstadisticas({ onTipoChange }: ToggleEstadisticasProps) {
  const [tipoActivo, setTipoActivo] = useState<TipoEstadistica>("personal")

  const opciones = [
    { 
      tipo: "personal" as TipoEstadistica, 
      label: "Personal", 
      icono: Users,
    },
    { 
      tipo: "equipos" as TipoEstadistica, 
      label: "Equipos", 
      icono: Laptop,
    },
    { 
      tipo: "tickets" as TipoEstadistica, 
      label: "Tickets", 
      icono: Ticket,
    },
    { 
      tipo: "eventos" as TipoEstadistica, 
      label: "Eventos", 
      icono: Calendar,
    }
  ]

  const handleTipoChange = (tipo: TipoEstadistica) => {
    setTipoActivo(tipo)
    onTipoChange(tipo)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-200 rounded-lg p-2 flex">
        {opciones.map((opcion) => {
          const Icono = opcion.icono
          const estaActivo = tipoActivo === opcion.tipo
          
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