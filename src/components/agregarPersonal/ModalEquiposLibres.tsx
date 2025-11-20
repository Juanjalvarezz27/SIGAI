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
  const [isVisible, setIsVisible] = useState(false)

  // Controlar visibilidad con animación
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      cargarEquiposLibres()
    } else {
      setIsVisible(false)
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
    e.stopPropagation()
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
    e.stopPropagation()
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
    e.preventDefault()
    onEquiposSeleccionados(equiposSeleccionados)
    setEquiposSeleccionados([])
    setSearchTerm("")
    setEquiposExpandidos(new Set())
    onClose()
  }

  const handleCerrar = (e: React.MouseEvent) => {
    e.preventDefault()
    setEquiposSeleccionados([])
    setSearchTerm("")
    setError("")
    setEquiposExpandidos(new Set())
    onClose()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCerrar(e)
    }
  }

  if (!isOpen && !isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all duration-300 ${
        isVisible ? 'animate-fade-in' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ${
          isVisible ? 'animate-fade-in-up scale-100' : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 animate-fade-in">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#001F3F]" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 font-montserrat">Asignar Equipos Libres</h3>
              <p className="text-gray-600 text-sm font-poppins">
                Selecciona equipos disponibles para asignar
              </p>
            </div>
          </div>
          <button
            onClick={handleCerrar}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer transition-transform hover:scale-110 duration-200"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Barra de búsqueda y contador */}
          <div className="p-4 border-b border-gray-200 bg-[#F0F8FF] flex-shrink-0 animate-fade-in">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-[#A0C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent font-poppins transition-all duration-200"
                  placeholder="Buscar por bien nacional, serial o tipo de equipo..."
                  disabled={disabled || loading}
                />
              </div>
              <div className="bg-[#001F3F] text-white px-3 py-1 rounded-full text-sm font-medium font-poppins animate-fade-in">
                {equiposSeleccionados.length} seleccionados
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-[#003366] font-poppins">
              <span>{equiposFiltrados.length} equipos encontrados</span>
              <span>{equiposLibres.length} equipos libres en total</span>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12 animate-fade-in">
                <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600 animate-fade-in">
                {error}
              </div>
            ) : equiposFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500 animate-fade-in">
                <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-poppins">No se encontraron equipos libres</p>
                {searchTerm && (
                  <p className="text-sm mt-2 font-poppins">Intenta con otros términos de búsqueda</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {equiposFiltrados.map((equipo, index) => (
                  <div
                    key={equipo.id}
                    className={`border-2 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] ${
                      estaSeleccionado(equipo.id)
                        ? 'border-[#001F3F] bg-[#A0C4FF]/20 ring-2 ring-[#A0C4FF]'
                        : 'border-gray-200 hover:border-[#A0C4FF] hover:shadow-lg'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Header con icono y controles */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Icono del tipo de equipo */}
                        <div className="text-[#001F3F] transition-transform hover:scale-110 duration-200">
                          {getIconoPorTipo(equipo.tipoEquipo.nombre)}
                        </div>
                        
                        {/* Checkbox de selección */}
                        <div
                          onClick={(e) => handleCheckboxClick(equipo, e)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            estaSeleccionado(equipo.id)
                              ? 'bg-[#001F3F] border-[#001F3F] text-white scale-110'
                              : 'border-gray-300 hover:border-[#001F3F] hover:scale-105'
                          } ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                          {estaSeleccionado(equipo.id) && <Check size={12} />}
                        </div>
                      </div>
                      
                      {/* Botón para expandir */}
                      <button
                        onClick={(e) => toggleExpandirEquipo(equipo.id, e)}
                        className="flex items-center gap-1 text-sm text-[#001F3F] hover:text-[#003366] transition-all duration-200 px-2 py-1 rounded hover:bg-[#A0C4FF]/30 font-poppins"
                        disabled={disabled}
                        type="button"
                      >
                        {estaExpandido(equipo.id) ? (
                          <>
                            <ChevronUp size={16} className="transition-transform duration-200" />
                            Menos
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} className="transition-transform duration-200" />
                            Más
                          </>
                        )}
                      </button>
                    </div>

                    {/* Información básica siempre visible */}
                    <div className="space-y-3">
                      {/* Tipo de Equipo */}
                      <div>
                        <p className="text-xs font-medium text-[#001F3F] font-montserrat">Tipo de Equipo</p>
                        <p className="text-lg font-semibold text-gray-900 font-montserrat">{equipo.tipoEquipo.nombre}</p>
                      </div>

                      {/* Bien Nacional y Serial */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F0F8FF] rounded-lg p-2 transition-all duration-200 hover:shadow-md">
                          <p className="text-xs font-medium text-[#001F3F] font-poppins">Bien Nacional</p>
                          <p className="text-sm font-semibold text-gray-900 font-poppins">
                            {equipo.bienNacional || "N/A"}
                          </p>
                        </div>
                        <div className="bg-[#F0F8FF] rounded-lg p-2 transition-all duration-200 hover:shadow-md">
                          <p className="text-xs font-medium text-[#001F3F] font-poppins">Serial</p>
                          <p className="text-sm font-semibold text-gray-900 font-poppins">
                            {equipo.serial || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Marca y Modelo */}
                      <div className="bg-[#F0F8FF] rounded-lg p-2 transition-all duration-200 hover:shadow-md">
                        <p className="text-xs font-medium text-[#001F3F] font-poppins">Marca y Modelo</p>
                        <p className="text-sm font-semibold text-gray-900 font-poppins">
                          {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                        </p>
                      </div>
                    </div>

                    {/* Información expandida con animación */}
                    {estaExpandido(equipo.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-slide-down">
                        {/* Status y Estado */}
                        <div className="grid grid-cols-2 gap-3">
                          {equipo.status && (
                            <div className="bg-[#F0F8FF] rounded-lg p-2 transition-all duration-200 hover:shadow-md">
                              <p className="text-xs font-medium text-[#001F3F] font-poppins">Status</p>
                              <p className="text-sm text-gray-900 font-poppins">{equipo.status.estado}</p>
                            </div>
                          )}
                          {equipo.estado && (
                            <div className="bg-[#F0F8FF] rounded-lg p-2 transition-all duration-200 hover:shadow-md">
                              <p className="text-xs font-medium text-[#001F3F] font-poppins">Estado</p>
                              <p className="text-sm text-gray-900 font-poppins">{equipo.estado.nombre}</p>
                            </div>
                          )}
                        </div>

                        {/* Especificaciones Técnicas */}
                        {equipo.especificaciones && (
                          <div className="animate-fade-in">
                            <p className="text-xs font-medium text-[#001F3F] mb-2 font-montserrat">Especificaciones Técnicas</p>
                            <div className="space-y-2">
                              {equipo.especificaciones.procesador && (
                                <div className="flex justify-between items-center text-sm font-poppins animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <Cpu className="w-3 h-3 transition-transform duration-200 hover:scale-110" />
                                    Procesador:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.procesador}</span>
                                </div>
                              )}
                              {equipo.especificaciones.memoriaRam && (
                                <div className="flex justify-between items-center text-sm font-poppins animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <MemoryStick className="w-3 h-3 transition-transform duration-200 hover:scale-110" />
                                    Memoria RAM:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.memoriaRam}</span>
                                </div>
                              )}
                              {equipo.especificaciones.modulosRam && (
                                <div className="flex justify-between items-center text-sm font-poppins animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <MemoryStick className="w-3 h-3 transition-transform duration-200 hover:scale-110" />
                                    Módulos RAM:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.modulosRam}</span>
                                </div>
                              )}
                              {equipo.especificaciones.capacidadDisco && (
                                <div className="flex justify-between items-center text-sm font-poppins animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <HardDrive className="w-3 h-3 transition-transform duration-200 hover:scale-110" />
                                    Capacidad Disco:
                                  </span>
                                  <span className="font-medium text-gray-900">{equipo.especificaciones.capacidadDisco}</span>
                                </div>
                              )}
                              {equipo.especificaciones.tipoDisco && (
                                <div className="flex justify-between items-center text-sm font-poppins animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <HardDrive className="w-3 h-3 transition-transform duration-200 hover:scale-110" />
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
                          <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                            <p className="text-xs font-medium text-[#001F3F] mb-1 font-montserrat">Observaciones</p>
                            <p className="text-sm text-gray-600 bg-[#F0F8FF] rounded p-2 font-poppins transition-all duration-200 hover:shadow-md">
                              {equipo.observaciones}
                            </p>
                          </div>
                        )}

                        {/* ID del equipo */}
                        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200 font-poppins animate-fade-in">
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
        <div className="flex justify-between items-center p-6 border-t border-gray-200 flex-shrink-0 bg-[#F0F8FF] animate-fade-in">
          <div className="text-sm text-[#001F3F] font-poppins">
            {equiposSeleccionados.length} equipos seleccionados para asignar
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCerrar}
              className="px-6 py-2 text-[#001F3F] bg-white border border-[#A0C4FF] rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer font-medium font-poppins hover:shadow-md transform hover:scale-105"
              disabled={disabled}
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleAsignarEquipos}
              disabled={disabled || equiposSeleccionados.length === 0}
              className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-all duration-200 cursor-pointer font-medium font-poppins hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="button"
            >
              Asignar {equiposSeleccionados.length} Equipo(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}