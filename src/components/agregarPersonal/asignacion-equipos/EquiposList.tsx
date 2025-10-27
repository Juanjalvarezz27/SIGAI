"use client"

import { Cpu, Edit, Trash2 } from "lucide-react"

interface TipoEquipo {
  id: number
  nombre: string
}

interface Status {
  id: number
  estado: string
}

interface Estado {
  id: number
  nombre: string
}

interface EspecificacionesOrdenador {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoConEspecificaciones {
  id?: number
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string
  marca: string
  statusId: number
  estadoId: number
  especificaciones?: EspecificacionesOrdenador
}

interface EquiposListProps {
  equipos: EquipoConEspecificaciones[]
  tiposEquipo: TipoEquipo[]
  estados: Estado[]
  status: Status[]
  onEditarEquipo: (index: number) => void
  onEliminarEquipo: (index: number) => void
  disabled?: boolean
}

const EQUIPOS_CON_ESPECIFICACIONES = ["Ordenador", "Laptop", "AllInOne"]

export default function EquiposList({ 
  equipos, 
  tiposEquipo, 
  estados, 
  status, 
  onEditarEquipo, 
  onEliminarEquipo, 
  disabled = false 
}: EquiposListProps) {
  if (equipos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Cpu className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No se han agregado equipos</p>
        <p className="text-sm">Haz clic en Agregar Equipo para asignar equipos al usuario</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {equipos.map((equipo, index) => {
        const tipoEquipo = equipo.tipoEquipoNombre || tiposEquipo.find(t => t.id === equipo.tipoEquipoId)?.nombre
        const requiereEspecificaciones = Boolean(tipoEquipo && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoEquipo))
        const estadoNombre = estados.find(e => e.id === equipo.estadoId)?.nombre || "No especificado"
        const statusNombre = status.find(s => s.id === equipo.statusId)?.estado || "No especificado"

        return (
          <div key={equipo.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#001F3F] flex items-center gap-2">
                <Cpu size={16} />
                {tipoEquipo || "Equipo"} {equipo.marca && `- ${equipo.marca}`} {equipo.modelo && `- ${equipo.modelo}`}
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditarEquipo(index)}
                  disabled={disabled}
                  className="text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onEliminarEquipo(index)}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {equipo.bienNacional && (
                <div>
                  <span className="font-medium">Bien Nacional:</span> {equipo.bienNacional}
                </div>
              )}
              {equipo.serial && (
                <div>
                  <span className="font-medium">Serial:</span> {equipo.serial}
                </div>
              )}
              <div>
                <span className="font-medium">Estado:</span> {estadoNombre}
              </div>
              <div>
                <span className="font-medium">Status:</span> {statusNombre}
              </div>
            </div>

            {requiereEspecificaciones && equipo.especificaciones && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">Especificaciones:</span> 
                {equipo.especificaciones.memoriaRam && ` RAM: ${equipo.especificaciones.memoriaRam}`}
                {equipo.especificaciones.procesador && `, Procesador: ${equipo.especificaciones.procesador}`}
                {equipo.especificaciones.capacidadDisco && `, Disco: ${equipo.especificaciones.capacidadDisco}`}
              </div>
            )}

            {equipo.observaciones && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Observaciones:</span> {equipo.observaciones}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}