"use client"

export type EstadoTicketFiltro = "activos" | "cerrados"

interface ToggleEstadoTicketsProps {
  onEstadoChange: (estado: EstadoTicketFiltro) => void
  estadoActivo: EstadoTicketFiltro
}

export default function ToggleEstadoTickets({ 
  onEstadoChange, 
  estadoActivo 
}: ToggleEstadoTicketsProps) {
  return (
    <div className="flex bg-gray-200 rounded-lg p-2 flex">
      <button
        onClick={() => onEstadoChange("activos")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
          estadoActivo === "activos"
            ? "bg-white text-gray-800 shadow-sm"
            : "text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer hover:scale-105"
        }`}
      >
        Tickets Activos
      </button>
      <button
        onClick={() => onEstadoChange("cerrados")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${
          estadoActivo === "cerrados"
            ? "bg-white text-gray-800 shadow-sm"
            : "text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer hover:scale-105"
        }`}
      >
        Tickets Cerrados
      </button>
    </div>
  )
}