"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import ToggleEstadisticas from "@/components/estadisticas/ToggleEstadisticas"
import EstadisticasPersonal from "@/components/estadisticas/EstadisticasPersonal"
import EstadisticasEquipos from "@/components/estadisticas/EstadisticasEquipos"

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
        return (
          <div className="text-center">
            <p>Estadísticas de Tickets</p>
          </div>
        )
        
      case "eventos":
        return (
          <div className="text-center">
            <p>Estadísticas de Eventos</p>
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

        {/* Toggle de Estadísticas */}
        <div className="mb-8">
          <ToggleEstadisticas onTipoChange={setTipoEstadistica} />
        </div>

        {/* Contenido de Estadísticas */}
        {renderEstadisticas()}
      </div>
    </>
  )
}