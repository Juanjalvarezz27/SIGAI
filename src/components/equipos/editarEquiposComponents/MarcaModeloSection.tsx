import { Search } from "lucide-react"

interface MarcaModeloSectionProps {
  formData: {
    marca: string
    modelo: string
  }
  loading: boolean
  onShowMarcaModal: () => void
  onShowModeloModal: () => void
}

export default function MarcaModeloSection({
  formData,
  loading,
  onShowMarcaModal,
  onShowModeloModal
}: MarcaModeloSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marca *
        </label>
        <button
          type="button"
          onClick={onShowMarcaModal}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F] flex items-center justify-between"
          disabled={loading}
        >
          <span className={formData.marca ? "text-gray-900" : "text-gray-500"}>
            {formData.marca || "Seleccionar marca..."}
          </span>
          <Search size={16} className="text-gray-400" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modelo *
        </label>
        <button
          type="button"
          onClick={onShowModeloModal}
          disabled={loading || !formData.marca}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F] flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={formData.modelo ? "text-gray-900" : "text-gray-500"}>
            {formData.modelo || "Seleccionar modelo..."}
          </span>
          <Search size={16} className="text-gray-400" />
        </button>
        {!formData.marca && (
          <p className="text-xs text-gray-500 mt-1">Primero selecciona una marca</p>
        )}
      </div>
    </div>
  )
}