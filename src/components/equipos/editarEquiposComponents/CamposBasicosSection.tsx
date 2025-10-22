interface CamposBasicosSectionProps {
  formData: {
    bienNacional: string
    serial: string
    observaciones: string
  }
  loading: boolean
  camposOpcionales: boolean
  onChange: (field: 'bienNacional' | 'serial' | 'observaciones', value: string) => void
}

export default function CamposBasicosSection({
  formData,
  loading,
  camposOpcionales,
  onChange
}: CamposBasicosSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bien Nacional {!camposOpcionales && "*"}
          </label>
          <input
            type="text"
            value={formData.bienNacional}
            onChange={(e) => onChange('bienNacional', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Número de bien nacional"
            disabled={loading}
            required={!camposOpcionales}
          />
          {camposOpcionales && (
            <p className="text-xs text-gray-500 mt-1">Opcional para este tipo de equipo</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial {!camposOpcionales && "*"}
          </label>
          <input
            type="text"
            value={formData.serial}
            onChange={(e) => onChange('serial', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Número de serie"
            disabled={loading}
            required={!camposOpcionales}
          />
          {camposOpcionales && (
            <p className="text-xs text-gray-500 mt-1">Opcional para este tipo de equipo</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => onChange('observaciones', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
          placeholder="Observaciones sobre el equipo"
          rows={3}
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">Campo opcional</p>
      </div>
    </>
  )
}