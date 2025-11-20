"use client"

import { useState, useEffect } from "react"
import { 
  X, 
  Search, 
  Monitor, 
  Check, 
  Package, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  HardDrive,
  MemoryStick,
  Smartphone,
  Printer,
  Mouse,
  Keyboard,
  Headphones,
  Server,
  Network
} from "lucide-react"
import axios from "axios"

interface Status {
  id: number
  estado: string
}

interface Estado {
  id: number
  nombre: string
}

interface EquipoLibre {
  id: number
  bienNacional?: string
  serial?: string
  observaciones?: string
  tipoEquipoId: number
  modeloId: number
  statusId?: number
  estadoId?: number
  especificacionesId?: number
  tipoEquipo: {
    id: number
    nombre: string
  }
  modelo: {
    id: number
    nombre: string
    marca: {
      id: number
      nombre: string
    }
  }
  status?: {
    id: number
    estado: string
  }
  estado?: {
    id: number
    nombre: string
  }
  especificaciones?: {
    id: number
    memoriaRam?: string
    modulosRam?: string
    capacidadDisco?: string
    tipoDisco?: string
    procesador?: string
  }
}

interface ModalEquiposLibresProps {
  isOpen: boolean
  onClose: () => void
  onEquiposSeleccionados: (equipos: EquipoLibre[]) => void
  disabled?: boolean
}

// Función para obtener el icono según el tipo de equipo
const getIconoPorTipo = (tipoNombre: string) => {
  const tipo = tipoNombre.toLowerCase()
  
  if (tipo.includes('laptop') || tipo.includes('portátil')) return <Laptop className="w-6 h-6" />
  if (tipo.includes('ordenador') || tipo.includes('computadora') || tipo.includes('desktop')) return <Monitor className="w-6 h-6" />
  if (tipo.includes('all in one') || tipo.includes('all-in-one')) return <Cpu className="w-6 h-6" />
  if (tipo.includes('tablet') || tipo.includes('ipad')) return <Tablet className="w-6 h-6" />
  if (tipo.includes('impresora') || tipo.includes('printer')) return <Printer className="w-6 h-6" />
  if (tipo.includes('mouse') || tipo.includes('ratón')) return <Mouse className="w-6 h-6" />
  if (tipo.includes('teclado') || tipo.includes('keyboard')) return <Keyboard className="w-6 h-6" />
  if (tipo.includes('audífono') || tipo.includes('headphone')) return <Headphones className="w-6 h-6" />
  if (tipo.includes('servidor') || tipo.includes('server')) return <Server className="w-6 h-6" />
  if (tipo.includes('red') || tipo.includes('network') || tipo.includes('switch') || tipo.includes('router')) return <Network className="w-6 h-6" />
  if (tipo.includes('disco') || tipo.includes('hard drive')) return <HardDrive className="w-6 h-6" />
  if (tipo.includes('memoria') || tipo.includes('ram')) return <MemoryStick className="w-6 h-6" />
  
  return <Package className="w-6 h-6" />
}

// Componentes de iconos adicionales
const Laptop = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M4 6h16M5 6v10a2 2 0 002 2h10a2 2 0 002-2V6M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
  </svg>
)

const Tablet = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)

export default function ModalEquiposLibres({
  isOpen,
  onClose,
  onEquiposSeleccionados,
  disabled = false
}: ModalEquiposLibresProps) {
  const [equiposLibres, setEquiposLibres] = useState<EquipoLibre[]>([])
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<EquipoLibre[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [equiposExpandidos, setEquiposExpandidos] = useState<Set<number>>(new Set())

  // Cargar equipos libres
  useEffect(() => {
    if (isOpen) {
      cargarEquiposLibres()
    }
  }, [isOpen])

  const cargarEquiposLibres = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get('/api/equipos/libres')
      setEquiposLibres(response.data.equipos || [])
    } catch (error) {
      console.error('Error cargando equipos libres:', error)
      setError("Error al cargar los equipos libres")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar equipos basado en la búsqueda (solo por bienNacional, serial o tipo)
  const equiposFiltrados = equiposLibres.filter(equipo => {
    const searchLower = searchTerm.toLowerCase()
    return (
      equipo.bienNacional?.toLowerCase().includes(searchLower) ||
      equipo.serial?.toLowerCase().includes(searchLower) ||
      equipo.tipoEquipo.nombre.toLowerCase().includes(searchLower)
    )
  })

  const toggleEquipoSeleccionado = (equipo: EquipoLibre) => {
    setEquiposSeleccionados(prev => {
      const yaSeleccionado = prev.find(e => e.id === equipo.id)
      if (yaSeleccionado) {
        return prev.filter(e => e.id !== equipo.id)
      } else {
        return [...prev, equipo]
      }
    })
  }

  const toggleExpandirEquipo = (equipoId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir propagación del evento
    setEquiposExpandidos(prev => {
      const nuevoSet = new Set(prev)
      if (nuevoSet.has(equipoId)) {
        nuevoSet.delete(equipoId)
      } else {
        nuevoSet.add(equipoId)
      }
      return nuevoSet
    })
  }

  const handleCheckboxClick = (equipo: EquipoLibre, e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir propagación del evento
    if (!disabled) {
      toggleEquipoSeleccionado(equipo)
    }
  }

  const estaSeleccionado = (equipoId: number) => {
    return equiposSeleccionados.some(e => e.id === equipoId)
  }

  const estaExpandido = (equipoId: number) => {
    return equiposExpandidos.has(equipoId)
  }

  const handleAsignarEquipos = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir submit del formulario padre
    onEquiposSeleccionados(equiposSeleccionados)
    setEquiposSeleccionados([])
    setSearchTerm("")
    setEquiposExpandidos(new Set())
    onClose()
  }

  const handleCerrar = (e: React.MouseEvent) => {
    e.preventDefault() // Prevenir submit del formulario padre
    setEquiposSeleccionados([])
    setSearchTerm("")
    setError("")
    setEquiposExpandidos(new Set())
    onClose()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation() // Prevenir propagación
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevenir submit del formulario padre
    }
  }

  // Prevenir que los eventos del modal se propaguen al formulario padre
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleCerrar} // Cerrar al hacer click fuera
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={handleModalClick} // Prevenir cierre al hacer click dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#001F3F]" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Asignar Equipos Libres</h3>
              <p className="text-gray-600 text-sm">
                Selecciona equipos disponibles para asignar
              </p>
            </div>
          </div>
          <button
            onClick={handleCerrar}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            type="button" // Especificar que es un botón, no submit
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Barra de búsqueda y contador */}
          <div className="p-4 border-b border-gray-200 bg-[#F0F8FF] flex-shrink-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-[#A0C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Buscar por bien nacional, serial o tipo de equipo..."
                  disabled={disabled || loading}
                />
              </div>
              <div className="bg-[#001F3F] text-white px-3 py-1 rounded-full text-sm font-medium">
                {equiposSeleccionados.length} seleccionados
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-[#003366]">
              <span>{equiposFiltrados.length} equipos encontrados</span>
              <span>{equiposLibres.length} equipos libres en total</span>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                {error}
              </div>
            ) : equiposFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No se encontraron equipos libres</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {equiposFiltrados.map((equipo) => (
                  <div
                    key={equipo.id}
                    className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                      estaSeleccionado(equipo.id)
                        ? 'border-[#001F3F] bg-[#A0C4FF]/20 ring-2 ring-[#A0C4FF]'
                        : 'border-gray-200 hover:border-[#A0C4FF] hover:shadow-lg'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* Header con icono y controles */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Icono del tipo de equipo */}
                        <div className="text-[#001F3F]">
                          {getIconoPorTipo(equipo.tipoEquipo.nombre)}
                        </div>
                        
                        {/* Checkbox de selección */}
                        <div
                          onClick={(e) => handleCheckboxClick(equipo, e)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
                            estaSeleccionado(equipo.id)
                              ? 'bg-[#001F3F] border-[#001F3F] text-white'
                              : 'border-gray-300 hover:border-[#001F3F]'
                          } ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                          {estaSeleccionado(equipo.id) && <Check size={12} />}
                        </div>
                      </div>
                      
                      {/* Botón para expandir */}
                      <button
                        onClick={(e) => toggleExpandirEquipo(equipo.id, e)}
                        className="flex items-center gap-1 text-sm text-[#001F3F] hover:text-[#003366] transition-colors px-2 py-1 rounded hover:bg-[#A0C4FF]/30"
                        disabled={disabled}
                        type="button" // Especificar que es un botón, no submit
                      >
                        {estaExpandido(equipo.id) ? (
                          <>
                            <ChevronUp size={16} />
                            Menos
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Más
                          </>
                        )}
                      </button>
                    </div>

                    {/* Información básica siempre visible */}
                    <div className="space-y-3">
                      {/* Tipo de Equipo */}
                      <div>
                        <p className="text-xs font-medium text-[#001F3F]">Tipo de Equipo</p>
                        <p className="text-lg font-semibold text-gray-900">{equipo.tipoEquipo.nombre}</p>
                      </div>

                      {/* Bien Nacional y Serial */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F0F8FF] rounded-lg p-2">
                          <p className="text-xs font-medium text-[#001F3F]">Bien Nacional</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {equipo.bienNacional || "N/A"}
                          </p>
                        </div>
                        <div className="bg-[#F0F8FF] rounded-lg p-2">
                          <p className="text-xs font-medium text-[#001F3F]">Serial</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {equipo.serial || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Marca y Modelo */}
                      <div className="bg-[#F0F8FF] rounded-lg p-2">
                        <p className="text-xs font-medium text-[#001F3F]">Marca y Modelo</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                        </p>
                      </div>
                    </div>

                    {/* Información expandida */}
                    {estaExpandido(equipo.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        {/* Status y Estado */}
                        <div className="grid grid-cols-2 gap-3">
                          {equipo.status && (
                            <div className="bg-[#F0F8FF] rounded-lg p-2">
                              <p className="text-xs font-medium text-[#001F3F]">Status</p>
                              <p className="text-sm text-gray-900">{equipo.status.estado}</p>
                            </div>
                          )}
                          {equipo.estado && (
                            <div className="bg-[#F0F8FF] rounded-lg p-2">
                              <p className="text-xs font-medium text-[#001F3F]">Estado</p>
                              <p className="text-sm text-gray-900">{equipo.estado.nombre}</p>
                            </div>
                          )}
                        </div>

                        {/* Especificaciones Técnicas */}
                        {equipo.especificaciones && (
                          <div>
                            <p className="text-xs font-medium text-[#001F3F] mb-2">Especificaciones Técnicas</p>
                            <div className="space-y-2">
                              {equipo.especificaciones.procesador && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <Cpu className="w-3 h-3" />
                                    Procesador:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.procesador}</span>
                                </div>
                              )}
                              {equipo.especificaciones.memoriaRam && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <MemoryStick className="w-3 h-3" />
                                    Memoria RAM:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.memoriaRam}</span>
                                </div>
                              )}
                              {equipo.especificaciones.modulosRam && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <MemoryStick className="w-3 h-3" />
                                    Módulos RAM:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.modulosRam}</span>
                                </div>
                              )}
                              {equipo.especificaciones.capacidadDisco && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    Capacidad Disco:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.capacidadDisco}</span>
                                </div>
                              )}
                              {equipo.especificaciones.tipoDisco && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    Tipo Disco:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.tipoDisco}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Observaciones */}
                        {equipo.observaciones && (
                          <div>
                            <p className="text-xs font-medium text-[#001F3F] mb-1">Observaciones</p>
                            <p className="text-sm text-gray-600 bg-[#F0F8FF] rounded p-2">
                              {equipo.observaciones}
                            </p>
                          </div>
                        )}

                        {/* ID del equipo */}
                        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                          ID: {equipo.id}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 flex-shrink-0 bg-[#F0F8FF]">
          <div className="text-sm text-[#001F3F]">
            {equiposSeleccionados.length} equipos seleccionados para asignar
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCerrar}
              className="px-6 py-2 text-[#001F3F] bg-white border border-[#A0C4FF] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
              disabled={disabled}
              type="button" // Especificar que es un botón, no submit
            >
              Cancelar
            </button>
            <button
              onClick={handleAsignarEquipos}
              disabled={disabled || equiposSeleccionados.length === 0}
              className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              type="button" // Especificar que es un botón, no submit
            >
              Asignar {equiposSeleccionados.length} Equipo(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}