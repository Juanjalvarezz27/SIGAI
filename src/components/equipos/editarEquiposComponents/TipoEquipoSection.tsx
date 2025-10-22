import { Search, Trash2 } from "lucide-react"
import { TipoEquipo } from "../../../../types/equipos"

interface TipoEquipoSectionProps {
  tiposEquipo: TipoEquipo[]
  tipoSeleccionado: TipoEquipo | null
  usandoNuevoTipo: boolean
  busquedaTipo: string
  nuevoTipo: string
  mostrarListaTipos: boolean
  camposOpcionales: boolean
  loading: boolean
  onSetBusquedaTipo: (value: string) => void
  onSetMostrarListaTipos: (value: boolean) => void
  onSeleccionarTipo: (tipo: TipoEquipo) => void
  onSeleccionarNuevoTipo: () => void
  onEliminarTipoSeleccionado: () => void
  onSetNuevoTipo: (value: string) => void
}

export default function TipoEquipoSection({
  tiposEquipo,
  tipoSeleccionado,
  usandoNuevoTipo,
  busquedaTipo,
  nuevoTipo,
  mostrarListaTipos,
  camposOpcionales,
  loading,
  onSetBusquedaTipo,
  onSetMostrarListaTipos,
  onSeleccionarTipo,
  onSeleccionarNuevoTipo,
  onEliminarTipoSeleccionado,
  onSetNuevoTipo
}: TipoEquipoSectionProps) {
  const tiposFiltrados = tiposEquipo.filter(tipo =>
    tipo.nombre.toLowerCase().includes(busquedaTipo.toLowerCase())
  )

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Equipo *
      </label>

      {(tipoSeleccionado || usandoNuevoTipo) ? (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 p-2 bg-green-50 border border-green-200 rounded-md">
            <span className="text-green-700 font-medium">
              Tipo seleccionado: {tipoSeleccionado?.nombre || nuevoTipo}
              {camposOpcionales && " (Bien Nacional y Serial opcionales)"}
            </span>
          </div>
          <button
            type="button"
            onClick={onEliminarTipoSeleccionado}
            className="text-red-500 hover:text-red-700 transition-colors p-2"
            disabled={loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSetMostrarListaTipos(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
          disabled={loading}
        >
          <span className="text-gray-500">Seleccionar tipo de equipo...</span>
        </button>
      )}

      {mostrarListaTipos && (
        <>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={busquedaTipo}
              onChange={(e) => onSetBusquedaTipo(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
              placeholder="Buscar tipo de equipo..."
              disabled={loading}
            />
          </div>

          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md mt-2">
            {tiposFiltrados.map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => onSeleccionarTipo(tipo)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100"
                disabled={loading}
              >
                {tipo.nombre}
              </button>
            ))}

            <button
              type="button"
              onClick={onSeleccionarNuevoTipo}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              disabled={loading}
            >
              + Agregar nuevo tipo
            </button>
          </div>
        </>
      )}

      {usandoNuevoTipo && (
        <div className="mt-2">
          <input
            type="text"
            value={nuevoTipo}
            onChange={(e) => onSetNuevoTipo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
            placeholder="Escriba el nuevo tipo de equipo..."
            disabled={loading}
            required
          />
        </div>
      )}
    </div>
  )
}