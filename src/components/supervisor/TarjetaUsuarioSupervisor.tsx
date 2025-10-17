"use client"

import { User, Mail, IdCard, MapPin, Briefcase, Building } from "lucide-react"
import { Usuario } from "../../../types/personal"

interface TarjetaUsuarioSupervisorProps {
  usuario: Usuario
  onSeleccionar: (usuario: Usuario) => void
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function TarjetaUsuarioSupervisor({ usuario, onSeleccionar }: TarjetaUsuarioSupervisorProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-105 cursor-pointer relative"
      onClick={() => onSeleccionar(usuario)}
    >
      {usuario.estado === 'Deshabilitado' && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
            Deshabilitado
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-[#001F3F]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {usuario.nombre} {usuario.apellido}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {capitalizeFirstLetter(usuario.rol.rol)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Cédula */}
        <div className="flex items-center gap-2 text-sm">
          <IdCard size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">
            {usuario.cedula || 'No registrada'}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 truncate">
            {usuario.email || 'No registrado'}
          </span>
        </div>

        {/* Dirección */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">
            {usuario.direccion.direccion}
          </span>
        </div>

        {/* Piso */}
        <div className="flex items-center gap-2 text-sm">
          <Building size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">
            {usuario.direccion.piso.piso}
          </span>
        </div>

        {/* Área */}
        {usuario.area && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">
              {usuario.area.nombre}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}