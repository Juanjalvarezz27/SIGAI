"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Monitor, Cpu, Edit, Search, X } from "lucide-react"
import axios from "axios"

// Interfaces
interface TipoEquipo {
  id: number
  nombre: string
}

interface Status {
  id: number
  estado: string
}

interface Estado {
  id: number
  nombre: string
}

interface EquipoBase {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string
  marca: string
  statusId: number
  estadoId: number
}

interface EspecificacionesOrdenador {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoConEspecificaciones extends EquipoBase {
  especificaciones?: EspecificacionesOrdenador
  id?: number // Para identificar equipos existentes
}

interface AsignacionEquiposProps {
  onEquiposChange: (equipos: EquipoConEspecificaciones[]) => void
  disabled?: boolean
}

// Tipos de equipos que requieren especificaciones adicionales
const EQUIPOS_CON_ESPECIFICACIONES = ["Ordenador", "Laptop", "AllInOne"]

// Tipos de equipos que pueden tener bien nacional y serial opcional
const EQUIPOS_CON_CAMPOS_OPCIONALES = ["Mouse"]

export default function AsignacionEquipos({ onEquiposChange, disabled = false }: AsignacionEquiposProps) {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [equipos, setEquipos] = useState<EquipoConEspecificaciones[]>([])
  const [cargandoDatos, setCargandoDatos] = useState(true)
  
  // Estados para el modal de tipo de equipo
  const [modalTipoAbierto, setModalTipoAbierto] = useState(false)
  const [equipoEditando, setEquipoEditando] = useState<number | null>(null)
  const [busquedaTipo, setBusquedaTipo] = useState("")
  const [nuevoTipo, setNuevoTipo] = useState("")
  const [mostrarListaTipos, setMostrarListaTipos] = useState(false)
  const [errores, setErrores] = useState<string[]>([])

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargandoDatos(true)

        // Cargar tipos de equipo
        const tiposResponse = await axios.get('/api/equipos/tipos')
        setTiposEquipo(tiposResponse.data.tipos || [])

        // Cargar status
        const statusResponse = await axios.get('/api/equipos/status')
        setStatus(statusResponse.data.status || [])

        // Cargar estados
        const estadosResponse = await axios.get('/api/equipos/estados')
        setEstados(estadosResponse.data.estados || [])

      } catch (error) {
        console.error('Error cargando datos de equipos:', error)
      } finally {
        setCargandoDatos(false)
      }
    }

    cargarDatosIniciales()
  }, [])

  const agregarEquipo = () => {
    setEquipoEditando(null)
    setModalTipoAbierto(true)
    setMostrarListaTipos(true)
    setErrores([])
  }

  const editarEquipo = (index: number) => {
    setEquipoEditando(index)
    setModalTipoAbierto(true)
    setMostrarListaTipos(false) // No mostrar lista al editar, ya tiene tipo seleccionado
    setErrores([])
  }

  const eliminarEquipo = (index: number) => {
    setEquipos(prev => prev.filter((_, i) => i !== index))
    setErrores([]) // Limpiar errores al eliminar equipo
  }

  const guardarEquipo = async (equipoData: Omit<EquipoConEspecificaciones, 'id'>) => {
    try {
      // Validaciones
      const nuevosErrores: string[] = []
      
      if (!equipoData.tipoEquipoId && !equipoData.tipoEquipoNombre) {
        nuevosErrores.push("El tipo de equipo es requerido")
      }
      
      if (!equipoData.marca.trim()) {
        nuevosErrores.push("La marca es requerida")
      }
      
      if (!equipoData.modelo.trim()) {
        nuevosErrores.push("El modelo es requerido")
      }
      
      if (!equipoData.statusId) {
        nuevosErrores.push("El status es requerido")
      }
      
      if (!equipoData.estadoId) {
        nuevosErrores.push("El estado es requerido")
      }

      // Validar campos específicos basados en el tipo de equipo
      const tipoEquipoNombre = equipoData.tipoEquipoNombre?.toLowerCase() || ""
      const esMouse = tipoEquipoNombre.includes("mouse")
      
      if (!esMouse) {
        // Para todos los equipos excepto Mouse, bien nacional y serial son requeridos
        if (!equipoData.bienNacional.trim()) {
          nuevosErrores.push("El bien nacional es requerido")
        }
        
        if (!equipoData.serial.trim()) {
          nuevosErrores.push("El serial es requerido")
        }
      }

      // Validar especificaciones técnicas si aplican
      if (EQUIPOS_CON_ESPECIFICACIONES.includes(equipoData.tipoEquipoNombre || "")) {
        if (equipoData.especificaciones) {
          if (!equipoData.especificaciones.memoriaRam.trim()) {
            nuevosErrores.push("La memoria RAM es requerida")
          }
          if (!equipoData.especificaciones.modulosRam.trim()) {
            nuevosErrores.push("Los módulos RAM son requeridos")
          }
          if (!equipoData.especificaciones.capacidadDisco.trim()) {
            nuevosErrores.push("La capacidad del disco es requerida")
          }
          if (!equipoData.especificaciones.tipoDisco.trim()) {
            nuevosErrores.push("El tipo de disco es requerido")
          }
          if (!equipoData.especificaciones.procesador.trim()) {
            nuevosErrores.push("El procesador es requerido")
          }
        }
      }

      if (nuevosErrores.length > 0) {
        setErrores(nuevosErrores)
        return
      }

      // Si estamos editando, actualizar el equipo existente
      if (equipoEditando !== null) {
        setEquipos(prev => {
          const nuevosEquipos = [...prev]
          nuevosEquipos[equipoEditando] = {
            ...equipoData,
            id: nuevosEquipos[equipoEditando].id // Mantener el ID si existe
          }
          return nuevosEquipos
        })
      } else {
        // Si es nuevo, agregar con un ID temporal
        const nuevoEquipo: EquipoConEspecificaciones = {
          ...equipoData,
          id: Date.now() // ID temporal
        }
        setEquipos(prev => [...prev, nuevoEquipo])
      }

      setModalTipoAbierto(false)
      setEquipoEditando(null)
      setBusquedaTipo("")
      setNuevoTipo("")
      setMostrarListaTipos(false)
      setErrores([])
    } catch (error) {
      console.error('Error guardando equipo:', error)
    }
  }

  const seleccionarTipoEquipo = async (tipo: TipoEquipo | null, esNuevo: boolean = false): Promise<TipoEquipo | null> => {
    if (esNuevo && nuevoTipo.trim()) {
      try {
        // Crear nuevo tipo de equipo
        const response = await axios.post('/api/equipos/tipos', {
          nombre: nuevoTipo.trim()
        })
        
        if (response.data.tipo) {
          setTiposEquipo(prev => [...prev, response.data.tipo])
          return response.data.tipo
        }
      } catch (error) {
        console.error('Error creando tipo de equipo:', error)
        throw error
      }
    }
    return tipo
  }

  // Notificar cambios al componente padre
  useEffect(() => {
    onEquiposChange(equipos)
  }, [equipos, onEquiposChange])

  // Obtener equipo actual para edición
  const equipoActual = equipoEditando !== null ? equipos[equipoEditando] : null

  // Filtrar tipos de equipo basado en la búsqueda
  const tiposFiltrados = tiposEquipo.filter(tipo =>
    tipo.nombre.toLowerCase().includes(busquedaTipo.toLowerCase())
  )

  if (cargandoDatos) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F0F8FF] border border-[#B0D4FF] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#001F3F] flex items-center gap-2">
          <Monitor className="w-5 h-5 text-[#001F3F]" />
          Asignación de Equipos
        </h3>
        <button
          type="button"
          onClick={agregarEquipo}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-2 bg-[#001F3F] hover:bg-[#003366] text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Agregar Equipo
        </button>
      </div>

      {equipos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No se han agregado equipos</p>
          <p className="text-sm">Haz clic en Agregar Equipo para asignar equipos al usuario</p>
        </div>
      ) : (
        <div className="space-y-3">
          {equipos.map((equipo, index) => {
            const tipoEquipo = equipo.tipoEquipoNombre || tiposEquipo.find(t => t.id === equipo.tipoEquipoId)?.nombre
            const requiereEspecificaciones = Boolean(tipoEquipo && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoEquipo))
            const estadoNombre = estados.find(e => e.id === equipo.estadoId)?.nombre || "No especificado"
            const statusNombre = status.find(s => s.id === equipo.statusId)?.estado || "No especificado"

            return (
              <div key={equipo.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#001F3F] flex items-center gap-2">
                    <Cpu size={16} />
                    {tipoEquipo || "Equipo"} {equipo.marca && `- ${equipo.marca}`} {equipo.modelo && `- ${equipo.modelo}`}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editarEquipo(index)}
                      disabled={disabled}
                      className="text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarEquipo(index)}
                      disabled={disabled}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {equipo.bienNacional && (
                    <div>
                      <span className="font-medium">Bien Nacional:</span> {equipo.bienNacional}
                    </div>
                  )}
                  {equipo.serial && (
                    <div>
                      <span className="font-medium">Serial:</span> {equipo.serial}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Estado:</span> {estadoNombre}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {statusNombre}
                  </div>
                </div>

                {requiereEspecificaciones && equipo.especificaciones && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium">Especificaciones:</span> 
                    {equipo.especificaciones.memoriaRam && ` RAM: ${equipo.especificaciones.memoriaRam}`}
                    {equipo.especificaciones.procesador && `, Procesador: ${equipo.especificaciones.procesador}`}
                    {equipo.especificaciones.capacidadDisco && `, Disco: ${equipo.especificaciones.capacidadDisco}`}
                  </div>
                )}

                {equipo.observaciones && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Observaciones:</span> {equipo.observaciones}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para agregar/editar equipo */}
      {modalTipoAbierto && (
        <FormularioEquipoModal
          equipo={equipoActual}
          tiposEquipo={tiposEquipo}
          tiposFiltrados={tiposFiltrados}
          status={status}
          estados={estados}
          busquedaTipo={busquedaTipo}
          nuevoTipo={nuevoTipo}
          mostrarListaTipos={mostrarListaTipos}
          errores={errores}
          onBusquedaTipoChange={setBusquedaTipo}
          onNuevoTipoChange={setNuevoTipo}
          onMostrarListaTiposChange={setMostrarListaTipos}
          onSeleccionarTipo={seleccionarTipoEquipo}
          onGuardar={guardarEquipo}
          onCancelar={() => {
            setModalTipoAbierto(false)
            setEquipoEditando(null)
            setBusquedaTipo("")
            setNuevoTipo("")
            setMostrarListaTipos(false)
            setErrores([])
          }}
          disabled={disabled}
        />
      )}
    </div>
  )
}

// Componente Modal para el formulario de equipo
interface FormularioEquipoModalProps {
  equipo: EquipoConEspecificaciones | null
  tiposEquipo: TipoEquipo[]
  tiposFiltrados: TipoEquipo[]
  status: Status[]
  estados: Estado[]
  busquedaTipo: string
  nuevoTipo: string
  mostrarListaTipos: boolean
  errores: string[]
  onBusquedaTipoChange: (value: string) => void
  onNuevoTipoChange: (value: string) => void
  onMostrarListaTiposChange: (value: boolean) => void
  onSeleccionarTipo: (tipo: TipoEquipo | null, esNuevo: boolean) => Promise<TipoEquipo | null>
  onGuardar: (equipo: Omit<EquipoConEspecificaciones, 'id'>) => void
  onCancelar: () => void
  disabled?: boolean
}

function FormularioEquipoModal({
  equipo,
  tiposEquipo,
  tiposFiltrados,
  status,
  estados,
  busquedaTipo,
  nuevoTipo,
  mostrarListaTipos,
  errores,
  onBusquedaTipoChange,
  onNuevoTipoChange,
  onMostrarListaTiposChange,
  onSeleccionarTipo,
  onGuardar,
  onCancelar,
  disabled = false
}: FormularioEquipoModalProps) {
  const [formData, setFormData] = useState({
    tipoEquipoId: equipo?.tipoEquipoId || 0,
    tipoEquipoNombre: equipo?.tipoEquipoNombre || "",
    marca: equipo?.marca || "",
    modelo: equipo?.modelo || "",
    bienNacional: equipo?.bienNacional || "",
    serial: equipo?.serial || "",
    observaciones: equipo?.observaciones || "",
    statusId: equipo?.statusId || 0,
    estadoId: equipo?.estadoId || 0,
    especificaciones: equipo?.especificaciones || {
      memoriaRam: "",
      modulosRam: "",
      capacidadDisco: "",
      tipoDisco: "",
      procesador: ""
    }
  })

  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoEquipo | null>(null)
  const [usandoNuevoTipo, setUsandoNuevoTipo] = useState(false)
  const [camposOpcionales, setCamposOpcionales] = useState(false)

  // Determinar si mostrar especificaciones y campos opcionales
  useEffect(() => {
    const tipoNombre = tipoSeleccionado?.nombre || formData.tipoEquipoNombre
    const requiereEspec = Boolean(tipoNombre && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoNombre))
    const esMouse = tipoNombre?.toLowerCase().includes("mouse") || false
    
    setMostrarEspecificaciones(requiereEspec)
    setCamposOpcionales(esMouse)
  }, [tipoSeleccionado, formData.tipoEquipoNombre])

  // Inicializar tipo seleccionado si estamos editando
  useEffect(() => {
    if (equipo && equipo.tipoEquipoId) {
      const tipo = tiposEquipo.find(t => t.id === equipo.tipoEquipoId)
      setTipoSeleccionado(tipo || null)
      setUsandoNuevoTipo(!tipo)
      if (tipo) {
        setFormData(prev => ({
          ...prev,
          tipoEquipoNombre: tipo.nombre
        }))
      }
    }
  }, [equipo, tiposEquipo])

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEspecificacionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones,
        [field]: value
      }
    }))
  }

  const handleSeleccionarTipo = (tipo: TipoEquipo) => {
    setTipoSeleccionado(tipo)
    setUsandoNuevoTipo(false)
    setFormData(prev => ({
      ...prev,
      tipoEquipoId: tipo.id,
      tipoEquipoNombre: tipo.nombre
    }))
    onBusquedaTipoChange("")
    onMostrarListaTiposChange(false) // Cerrar la lista después de seleccionar
  }

  const handleSeleccionarNuevoTipo = () => {
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(true)
    setFormData(prev => ({
      ...prev,
      tipoEquipoId: 0,
      tipoEquipoNombre: ""
    }))
    onMostrarListaTiposChange(false) // Cerrar la lista
  }

  const handleEliminarTipoSeleccionado = () => {
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(false)
    setFormData(prev => ({
      ...prev,
      tipoEquipoId: 0,
      tipoEquipoNombre: ""
    }))
    onNuevoTipoChange("")
    onMostrarListaTiposChange(true) // Mostrar lista para nueva selección
  }

  const handleAbrirListaTipos = () => {
    onMostrarListaTiposChange(true)
  }

  const handleGuardar = async () => {
    let tipoFinal: TipoEquipo | null = tipoSeleccionado

    // Si está usando un nuevo tipo, crearlo
    if (usandoNuevoTipo && nuevoTipo.trim()) {
      try {
        tipoFinal = await onSeleccionarTipo(null, true)
      } catch (error) {
        console.error('Error creando tipo de equipo:', error)
        return
      }
    }

    const equipoData: Omit<EquipoConEspecificaciones, 'id'> = {
      tipoEquipoId: tipoFinal?.id || 0,
      tipoEquipoNombre: tipoFinal?.nombre || nuevoTipo.trim() || formData.tipoEquipoNombre,
      marca: formData.marca,
      modelo: formData.modelo,
      bienNacional: formData.bienNacional,
      serial: formData.serial,
      observaciones: formData.observaciones,
      statusId: formData.statusId,
      estadoId: formData.estadoId,
      especificaciones: mostrarEspecificaciones ? formData.especificaciones : undefined
    }

    onGuardar(equipoData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5]">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {equipo ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
          </h3>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mostrar errores - SOLO si hay errores */}
          {errores.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800 mb-2">Por favor complete los siguientes campos:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {/* Selección de Tipo de Equipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Equipo *
              </label>
              
              {/* Mostrar tipo seleccionado o botón para seleccionar */}
              {(tipoSeleccionado || usandoNuevoTipo || formData.tipoEquipoNombre) ? (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 p-2 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-green-700 font-medium">
                      Tipo seleccionado: {tipoSeleccionado?.nombre || nuevoTipo || formData.tipoEquipoNombre}
                      {camposOpcionales && " (Bien Nacional y Serial opcionales)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEliminarTipoSeleccionado}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    disabled={disabled}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAbrirListaTipos}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  disabled={disabled}
                >
                  <span className="text-gray-500">Seleccionar tipo de equipo...</span>
                </button>
              )}

              {/* Búsqueda y lista de tipos */}
              {mostrarListaTipos && (
                <>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={busquedaTipo}
                      onChange={(e) => onBusquedaTipoChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Buscar tipo de equipo..."
                      disabled={disabled}
                    />
                  </div>

                  {/* Lista de tipos */}
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md mt-2">
                    {tiposFiltrados.map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => handleSeleccionarTipo(tipo)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 ${
                          tipoSeleccionado?.id === tipo.id ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                        disabled={disabled}
                      >
                        {tipo.nombre}
                      </button>
                    ))}
                    
                    {/* Opción para nuevo tipo */}
                    <button
                      type="button"
                      onClick={handleSeleccionarNuevoTipo}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        usandoNuevoTipo ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                      disabled={disabled}
                    >
                      + Agregar nuevo tipo
                    </button>
                  </div>
                </>
              )}

              {/* Campo para nuevo tipo */}
              {usandoNuevoTipo && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={nuevoTipo}
                    onChange={(e) => onNuevoTipoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                    placeholder="Escriba el nuevo tipo de equipo..."
                    disabled={disabled}
                    required
                  />
                </div>
              )}
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleChange('marca', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  placeholder="Ej: Dell, HP, Lenovo"
                  disabled={disabled}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleChange('modelo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  placeholder="Ej: Optiplex 7070, ThinkPad X1"
                  disabled={disabled}
                  required
                />
              </div>
            </div>

            {/* Bien Nacional y Serial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bien Nacional {!camposOpcionales && "*"}
                </label>
                <input
                  type="text"
                  value={formData.bienNacional}
                  onChange={(e) => handleChange('bienNacional', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  placeholder="Número de bien nacional"
                  disabled={disabled}
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
                  onChange={(e) => handleChange('serial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  placeholder="Número de serie"
                  disabled={disabled}
                  required={!camposOpcionales}
                />
                {camposOpcionales && (
                  <p className="text-xs text-gray-500 mt-1">Opcional para este tipo de equipo</p>
                )}
              </div>
            </div>

            {/* Status y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.statusId}
                  onChange={(e) => handleChange('statusId', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  disabled={disabled}
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
                  onChange={(e) => handleChange('estadoId', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  disabled={disabled}
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

            {/* Especificaciones Técnicas (solo para ordenadores) */}
            {mostrarEspecificaciones && (
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
                      value={formData.especificaciones.memoriaRam}
                      onChange={(e) => handleEspecificacionChange('memoriaRam', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 8GB"
                      disabled={disabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Módulos RAM *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones.modulosRam}
                      onChange={(e) => handleEspecificacionChange('modulosRam', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 2x4GB"
                      disabled={disabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad Disco *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones.capacidadDisco}
                      onChange={(e) => handleEspecificacionChange('capacidadDisco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 500GB"
                      disabled={disabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Disco *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones.tipoDisco}
                      onChange={(e) => handleEspecificacionChange('tipoDisco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: SSD, HDD"
                      disabled={disabled}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Procesador *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones.procesador}
                      onChange={(e) => handleEspecificacionChange('procesador', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: Intel i5"
                      disabled={disabled}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                placeholder="Observaciones sobre el equipo"
                rows={3}
                disabled={disabled}
              />
              <p className="text-xs text-gray-500 mt-1">Campo opcional</p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            className="px-4 py-2 bg-[#001F3F] text-white hover:bg-[#003366] rounded-md transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            {equipo ? 'Actualizar Equipo' : 'Agregar Equipo'}
          </button>
        </div>
      </div>
    </div>
  )
}