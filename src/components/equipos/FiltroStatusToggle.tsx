"use client"

interface FiltroStatusToggleProps {
  statusSeleccionado: string
  onStatusChange: (status: string) => void
  loading?: boolean
}

export default function FiltroStatusToggle({
  statusSeleccionado,
  onStatusChange,
  loading = false
}: FiltroStatusToggleProps) {
  // Status para equipos con sus IDs reales
  const statusEquipos = [
    { id: 'todos', nombre: 'Todos', valor: 'todos', statusId: 'todos' },
    { id: 'operativos', nombre: 'Operativos', valor: 'operativos', statusId: '1' },
    { id: 'inoperativos', nombre: 'Inoperativos', valor: 'inoperativos', statusId: '2' },
    { id: 'desincorporados', nombre: 'Desincorporados', valor: 'desincorporados', statusId: '3' }
  ]

  const handleStatusClick = (statusValor: string) => {
    // Encontrar el status seleccionado
    const statusSeleccionado = statusEquipos.find(status => status.valor === statusValor)
    
    if (statusSeleccionado) {
      // Pasar el statusId directamente al callback
      onStatusChange(statusSeleccionado.statusId)
    }
  }

  // Función para obtener el valor actual basado en el statusId
  const getValorActual = () => {
    const statusActual = statusEquipos.find(status => status.statusId === statusSeleccionado)
    return statusActual ? statusActual.valor : 'todos'
  }

  const valorActual = getValorActual()

  return (
    <div className="flex flex-col items-center mb-3">
      <div className="bg-gray-200 rounded-lg p-2 flex flex-wrap justify-center gap-1">
        {statusEquipos.map((status) => (
          <button
            key={status.id}
            type="button"
            onClick={() => handleStatusClick(status.valor)}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer transition-all duration-300 hover:scale-105 ${
              valorActual === status.valor
                ? 'bg-white text-[#001F3F] shadow-sm'
                : 'text-gray-600 hover:text-gray-800 disabled:hover:text-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}