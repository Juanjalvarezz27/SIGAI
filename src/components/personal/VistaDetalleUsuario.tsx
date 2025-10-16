"use client"

import { User, Mail, IdCard, MapPin, Briefcase, Building, Monitor, Cpu, HardDrive } from "lucide-react"
import { Usuario, Equipo } from "../../../types/personal"

interface VistaDetalleUsuarioProps {
  usuario: Usuario
  onVolver: () => void
  onDeshabilitar: (usuario: Usuario) => void
  onHabilitar: (usuarioId: number) => void
  loading?: boolean
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Función helper para los equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    return `${equipo.modelo.nombre}-${equipo.modelo.marca.nombre}-${equipo.bienNacional || 'sin-bien'}-${equipo.serial || 'sin-serial'}`
  }

  const equiposUnicos = new Map()

  equipos.forEach(equipo => {
    const clave = crearClaveUnica(equipo)
    if (!equiposUnicos.has(clave)) {
      equiposUnicos.set(clave, equipo)
    }
  })

  return Array.from(equiposUnicos.values())
}

export default function VistaDetalleUsuario({
  usuario,
  onVolver,
  onDeshabilitar,
  onHabilitar,
  loading = false
}: VistaDetalleUsuarioProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {usuario.nombre} {usuario.apellido}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">{capitalizeFirstLetter(usuario.rol.rol)}</p>
            {usuario.estado === 'Deshabilitado' && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                Deshabilitado
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Botón de deshabilitar/habilitar - MOSTRAR SIEMPRE */}
          <button
            onClick={() => {
              if (usuario.estado === 'Activo') {
                onDeshabilitar(usuario)
              } else {
                onHabilitar(usuario.id)
              }
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium transform transition-all duration-200 hover:scale-105 cursor-pointer ${
              usuario.estado === 'Activo'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {usuario.estado === 'Activo' ? 'Deshabilitar' : 'Habilitar'}
          </button>
          <button
            onClick={onVolver}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transform transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            Volver a la lista
          </button>
        </div>
      </div>

      {/* Información Personal y Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Información Personal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Personal</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <IdCard size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{usuario.cedula || 'No registrada'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{usuario.email || 'No registrado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className={`font-medium ${
                  usuario.estado === 'Activo' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usuario.estado}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-[#A0C4FF]/[0.3] border border-[#A0C4FF]/[0.9] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[#001f3f] mb-4">Ubicación</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building size={20} className="text-[#001f3f]" />
              <div>
                <p className="font-medium">{usuario.direccion.piso.piso}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#001f3f]" />
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium">{usuario.direccion.direccion}</p>
              </div>
            </div>
            {usuario.area && (
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-[#001f3f]" />
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-medium">{usuario.area.nombre}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equipos asignados */}
      <div className="bg-[#F29F6D]/[0.4] border border-[#F29F6D] rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Equipos Asignados</h3>
        {usuario.equipos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {eliminarEquiposDuplicados(usuario.equipos).map((equipo) => (
              <div key={equipo.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor size={24} className="text-[#F29F6D]" />
                  <div>
                    <h4 className="font-semibold">{equipo.tipoEquipo.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {equipo.bienNacional && (
                    <p><span className="font-medium">Bien Nacional:</span> {equipo.bienNacional}</p>
                  )}
                  {equipo.serial && (
                    <p><span className="font-medium">Serial:</span> {equipo.serial}</p>
                  )}
                  {equipo.status && (
                    <p><span className="font-medium">Status:</span> {equipo.status.estado}</p>
                  )}
                  {equipo.estado && (
                    <p><span className="font-medium">Estado:</span> {equipo.estado.nombre}</p>
                  )}

                  {equipo.especificaciones && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="font-medium mb-1">Especificaciones:</p>
                      <div className="space-y-1">
                        {equipo.especificaciones.procesador && (
                          <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-gray-400" />
                            <span>{equipo.especificaciones.procesador}</span>
                          </div>
                        )}
                        {equipo.especificaciones.memoriaRam && (
                          <div className="flex items-center gap-2">
                            <Monitor size={14} className="text-gray-400" />
                            <span>RAM: {equipo.especificaciones.memoriaRam}</span>
                          </div>
                        )}
                        {equipo.especificaciones.capacidadDisco && (
                          <div className="flex items-center gap-2">
                            <HardDrive size={14} className="text-gray-400" />
                            <span>Disco: {equipo.especificaciones.capacidadDisco} ({equipo.especificaciones.tipoDisco})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tiene equipos asignados</p>
        )}
      </div>
    </div>
  )
}