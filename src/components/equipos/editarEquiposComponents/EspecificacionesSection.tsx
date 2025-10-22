import { Cpu } from "lucide-react"

interface EspecificacionesFormData {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EspecificacionesSectionProps {
  especificaciones: EspecificacionesFormData
  loading: boolean
  onChange: (field: keyof EspecificacionesFormData, value: string) => void
}

export default function EspecificacionesSection({
  especificaciones,
  loading,
  onChange
}: EspecificacionesSectionProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-[#001F3F] mb-3 flex items-center gap-2">
        <Cpu size={16} />
        Especificaciones Técnicas *
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Memoria RAM *
          </label>
          <input
            type="text"
            value={especificaciones.memoriaRam}
            onChange={(e) => onChange('memoriaRam', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Ej: 8GB"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Módulos RAM *
          </label>
          <input
            type="text"
            value={especificaciones.modulosRam}
            onChange={(e) => onChange('modulosRam', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Ej: 2x4GB"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad Disco *
          </label>
          <input
            type="text"
            value={especificaciones.capacidadDisco}
            onChange={(e) => onChange('capacidadDisco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Ej: 500GB"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo Disco *
          </label>
          <input
            type="text"
            value={especificaciones.tipoDisco}
            onChange={(e) => onChange('tipoDisco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Ej: SSD, HDD"
            disabled={loading}
            required
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Procesador *
          </label>
          <input
            type="text"
            value={especificaciones.procesador}
            onChange={(e) => onChange('procesador', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Ej: Intel i5"
            disabled={loading}
            required
          />
        </div>
      </div>
    </div>
  )
}