"use client"

import { useState, useEffect } from "react"
import { Search, X, Check, Settings } from "lucide-react"
import { useUserRol } from "../../app/hooks/useUserRol"
import GestionTitulosModal from "./GestionTitulosModal"

interface Titulo {
  id: number
  nombre: string
  tipoTicketId: number
  tipoTicket: {
    id: number
    tipo: string
  }
}

interface SelectorTitulosModalProps {
  isOpen: boolean
  onClose: () => void
  onTituloSelect: (titulo: Titulo) => void
  currentTitulo?: string
}

export default function SelectorTitulosModal({
  isOpen,
  onClose,
  onTituloSelect,
  currentTitulo
}: SelectorTitulosModalProps) {
  const [titulos, setTitulos] = useState<Titulo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredTitulos, setFilteredTitulos] = useState<Titulo[]>([])
  const [showGestionModal, setShowGestionModal] = useState(false)
  
  const { userRol } = useUserRol()
  const esAdmin = userRol?.rolId === 1 // Asumiendo que el rolId 1 es Admin

  // Cargar todos los títulos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchTitulos()
    }
  }, [isOpen])

  // Filtrar títulos basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTitulos(titulos)
    } else {
      const filtered = titulos.filter(titulo =>
        titulo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTitulos(filtered)
    }
  }, [searchTerm, titulos])

  const fetchTitulos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/titulos')
      if (response.ok) {
        const data = await response.json()
        setTitulos(data)
      }
    } catch (error) {
      console.error('Error fetching titulos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTituloSelect = (titulo: Titulo) => {
    onTituloSelect(titulo)
    onClose()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTituloAdded = () => {
    fetchTitulos() // Recargar la lista cuando se agregue un nuevo título
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Seleccionar Título
            </h3>
            <div className="flex items-center gap-2">
              {/* Botón de gestión para admin */}
              {esAdmin && (
                <button
                  onClick={() => setShowGestionModal(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-[#001F3F] text-white rounded-md hover:bg-[#003366] transition-colors cursor-pointer"
                  title="Gestionar títulos"
                >
                  <Settings size={16} />
                  Gestionar
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar título..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de títulos */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
            <div className="w-16 h-16 mt-3 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
            ) : filteredTitulos.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredTitulos.map((titulo) => (
                  <button
                    key={titulo.id}
                    onClick={() => handleTituloSelect(titulo)}
                    className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                      currentTitulo === titulo.nombre ? 'bg-blue-50 border-l-4 border-l-[#001F3F]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {titulo.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          Tipo: {titulo.tipoTicket.tipo}
                        </div>
                      </div>
                      {currentTitulo === titulo.nombre && (
                        <Check className="w-5 h-5 text-[#001F3F] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center py-8 text-gray-500">
                No se encontraron títulos
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de gestión para admin */}
      {esAdmin && (
        <GestionTitulosModal
          isOpen={showGestionModal}
          onClose={() => setShowGestionModal(false)}
          onTituloAdded={handleTituloAdded}
        />
      )}
    </>
  )
}