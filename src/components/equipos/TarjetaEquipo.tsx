"use client"

import { Cpu, User, Hash, Barcode } from "lucide-react"
import { Equipo } from "../../../types/equipos"

interface TarjetaEquipoProps {
  equipo: Equipo
  onSeleccionar: (equipo: Equipo) => void
}

export default function TarjetaEquipo({ equipo, onSeleccionar }: TarjetaEquipoProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-105 cursor-pointer"
      onClick={() => onSeleccionar(equipo)}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center flex-shrink-0">
          <Cpu className="w-6 h-6 text-[#001F3F]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {equipo.tipoEquipo.nombre}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Serial */}
        {equipo.serial && (
          <div className="flex items-center gap-2 text-sm">
            <Barcode size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate">
              {equipo.serial}
            </span>
          </div>
        )}

        {/* Bien Nacional */}
        {equipo.bienNacional && (
          <div className="flex items-center gap-2 text-sm">
            <Hash size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">
              BN: {equipo.bienNacional}
            </span>
          </div>
        )}

        {/* Usuario asignado */}
        {equipo.usuario && (
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate">
              {equipo.usuario.nombre} {equipo.usuario.apellido}
            </span>
          </div>
        )}

        {/* Estado - Basado en ID */}
        {equipo.estado && (
          <div className="flex items-center gap-2 text-sm">
            <div 
              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                equipo.estado.id === 1 ? 'bg-green-500' :    // En uso - Verde
                equipo.estado.id === 2 ? 'bg-yellow-500' :  // Sin uso - Amarillo
                'bg-gray-500'                               // Otros estados - Gris
              }`}
            />
            <span className="text-gray-600">
              {equipo.estado.nombre}
            </span>
          </div>
        )}

      </div>
    </div>
  )
}