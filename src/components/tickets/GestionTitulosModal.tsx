"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, AlertTriangle } from "lucide-react"

interface Titulo {
  id: number
  nombre: string
  tipoTicketId: number
  tipoTicket: {
    id: number
    tipo: string
  }
}

interface GestionTitulosModalProps {
  isOpen: boolean
  onClose: () => void
  onTituloAdded: () => void
}

export default function GestionTitulosModal({
  isOpen,
  onClose,
  onTituloAdded
}: GestionTitulosModalProps) {
  const [titulos, setTitulos] = useState<Titulo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Form state
  const [nuevoTitulo, setNuevoTitulo] = useState({
    nombre: "",
    tipoTicketId: ""
  })

  // Cargar títulos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchTitulos()
    }
  }, [isOpen])

  const fetchTitulos = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch('/api/titulos')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setTitulos(data)
    } catch (error) {
      console.error('Error fetching titulos:', error)
      setError('Error al cargar los títulos: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!nuevoTitulo.nombre.trim() || !nuevoTitulo.tipoTicketId) {
      setError("Todos los campos son requeridos")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/titulos/crearTitulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoTitulo.nombre.trim(),
          tipoTicketId: nuevoTitulo.tipoTicketId
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error('Respuesta del servidor no válida')
      }

      if (response.ok) {
        setSuccess("Título agregado correctamente")
        setNuevoTitulo({ nombre: "", tipoTicketId: "" })
        await fetchTitulos() // Recargar la lista
        onTituloAdded() // Notificar al componente padre
      } else {
        setError(data.error || `Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al agregar el título: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/titulos/${id}`, {
        method: 'DELETE',
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error('Respuesta del servidor no válida')
      }

      if (response.ok) {
        setSuccess("Título eliminado correctamente")
        await fetchTitulos() // Recargar la lista
        onTituloAdded() // Notificar al componente padre
        setShowDeleteConfirm(null)
      } else {
        setError(data.error || `Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al eliminar el título: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNuevoTitulo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Gestión de Títulos
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mensajes de estado */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Formulario para agregar título */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Título</h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Título *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nuevoTitulo.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Ej: Servicio de impresión"
                />
              </div>

              <div>
                <label htmlFor="tipoTicketId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ticket *
                </label>
                <select
                  id="tipoTicketId"
                  name="tipoTicketId"
                  value={nuevoTitulo.tipoTicketId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="1">Soporte</option>
                  <option value="2">Redes y Servidores</option>
                  <option value="3">Sistemas</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#001F3F] text-white rounded-md hover:bg-[#003366] transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  {isSubmitting ? 'Agregando...' : 'Agregar Título'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de títulos existentes */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Títulos Existentes</h4>
            {isLoading ? (
            <div className="w-16 h-16 mt-3 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
            ) : titulos.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Título</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de Ticket</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {titulos.map((titulo) => (
                        <tr key={titulo.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{titulo.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{titulo.tipoTicket.tipo}</td>
                        <td className="px-4 py-3 text-sm flex justify-center items-center h-full">
                            <button
                            onClick={() => setShowDeleteConfirm(titulo.id)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-1 rounded hover:bg-red-50 flex items-center justify-center mx-auto"
                            title="Eliminar título"
                            >
                            <Trash2 size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay títulos registrados
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h4 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h4>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea eliminar este título? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}