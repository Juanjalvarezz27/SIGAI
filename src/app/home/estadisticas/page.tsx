"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import ToggleEstadisticas from "@/components/estadisticas/ToggleEstadisticas"
import ExportButtons from "@/components/estadisticas/ExportButtons"
import EstadisticasPersonal from "@/components/estadisticas/EstadisticasPersonal"
import EstadisticasEquipos from "@/components/estadisticas/EstadisticasEquipos"
import EstadisticasTickets from "@/components/estadisticas/EstadisticasTickets"

type TipoEstadistica = "personal" | "equipos" | "tickets" | "eventos"

export default function EstadisticasPage() {
  const [tipoEstadistica, setTipoEstadistica] = useState<TipoEstadistica>("personal")

  const renderEstadisticas = () => {
    switch (tipoEstadistica) {
      case "personal":
        return <EstadisticasPersonal />
      case "equipos":
        return <EstadisticasEquipos />
      case "tickets":
        return <EstadisticasTickets />
      case "eventos":
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Estadísticas de Eventos</p>
          </div>
        )
      default:
        return <EstadisticasPersonal />
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Title text="Estadísticas" />

        {/* Toggle de Estadísticas con Botones de Exportación */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <ToggleEstadisticas onTipoChange={setTipoEstadistica} />
            <ExportButtons tipoEstadistica={tipoEstadistica} />
          </div>
        </div>

        {/* Contenido de Estadísticas */}
        {renderEstadisticas()}
      </div>
    </>
  )
}