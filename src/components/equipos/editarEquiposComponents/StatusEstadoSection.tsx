import { Status, Estados } from "../../../../types/equipos"

interface StatusEstadoSectionProps {
  formData: {
    statusId: number
    estadoId: number
  }
  status: Status[]
  estados: Estados[]
  loading: boolean
  onChange: (field: 'statusId' | 'estadoId', value: number) => void
}

export default function StatusEstadoSection({
  formData,
  status,
  estados,
  loading,
  onChange
}: StatusEstadoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          value={formData.statusId}
          onChange={(e) => onChange('statusId', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
          disabled={loading}
          required
        >
          <option value={0}>Selecciona status</option>
          {status.map((s) => (
            <option key={s.id} value={s.id}>
              {s.estado}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado *
        </label>
        <select
          value={formData.estadoId}
          onChange={(e) => onChange('estadoId', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
          disabled={loading}
          required
        >
          <option value={0}>Selecciona estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}