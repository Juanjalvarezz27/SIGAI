"use client"

import { Cpu } from "lucide-react"
import TarjetaEquipo from "./TarjetaEquipo"
import { Equipo } from "../../../types/equipos"

interface ListaEquiposProps {
  equipos: Equipo[]
  onEquipoSeleccionado: (equipo: Equipo) => void
  loading?: boolean
  error?: string
}

export default function ListaEquipos({
  equipos,
  onEquipoSeleccionado,
  loading = false,
  error = ''
}: ListaEquiposProps) {
  if (error) return null

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (equipos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
        <p className="text-gray-500">
          No se encontraron equipos en el inventario con los filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {equipos.map((equipo) => (
        <TarjetaEquipo
          key={equipo.id}
          equipo={equipo}
          onSeleccionar={onEquipoSeleccionado}
        />
      ))}
    </div>
  )
}