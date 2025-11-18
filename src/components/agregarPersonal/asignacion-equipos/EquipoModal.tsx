"use client"

import { useState, useEffect } from "react"
import { X, Search, Trash2, Cpu } from "lucide-react"
import axios from "axios"
import MiniModalBusqueda from "../../equipos/MiniModalBusqueda"

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

interface EspecificacionesOrdenador {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoConEspecificaciones {
  id?: number
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string
  marca: string
  statusId: number
  estadoId: number
  especificaciones?: EspecificacionesOrdenador
}

interface FormDataState {
  tipoEquipoId: number
  tipoEquipoNombre: string
  marca: string
  modelo: string
  bienNacional: string
  serial: string
  observaciones: string
  statusId: number
  estadoId: number
  especificaciones: EspecificacionesOrdenador
}

interface EquipoModalProps {
  isOpen: boolean
  onClose: () => void
  onGuardar: (equipo: EquipoConEspecificaciones) => void
  equipoEditando: EquipoConEspecificaciones | null
  tiposEquipo: TipoEquipo[]
  status: Status[]
  estados: Estado[]
  disabled?: boolean
}

// Mover las constantes aquí ya que se usan en este componente
const EQUIPOS_CON_ESPECIFICACIONES = ["Ordenador", "Laptop", "AllInOne"]
const EQUIPOS_CON_CAMPOS_OPCIONALES = ["Mouse"]

const initialFormData: FormDataState = {
  tipoEquipoId: 0,
  tipoEquipoNombre: "",
  marca: "",
  modelo: "",
  bienNacional: "",
  serial: "",
  observaciones: "",
  statusId: 0,
  estadoId: 0,
  especificaciones: {
    memoriaRam: "",
    modulosRam: "",
    capacidadDisco: "",
    tipoDisco: "",
    procesador: ""
  }
}

export default function EquipoModal({ 
  isOpen, 
  onClose, 
  onGuardar, 
  equipoEditando, 
  tiposEquipo, 
  status, 
  estados, 
  disabled = false 
}: EquipoModalProps) {
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoEquipo | null>(null)
  const [usandoNuevoTipo, setUsandoNuevoTipo] = useState(false)
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false)
  const [camposOpcionales, setCamposOpcionales] = useState(false)
  const [mostrarListaTipos, setMostrarListaTipos] = useState(false)
  const [busquedaTipo, setBusquedaTipo] = useState("")
  const [nuevoTipo, setNuevoTipo] = useState("")
  const [errores, setErrores] = useState<string[]>([])
  const [mostrarModalMarca, setMostrarModalMarca] = useState(false)
  const [mostrarModalModelo, setMostrarModalModelo] = useState(false)
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<{id: number, nombre: string} | null>(null)
  const [esMarcaNueva, setEsMarcaNueva] = useState(false)

  // Inicializar formulario cuando se abre el modal o cambia equipoEditando
  useEffect(() => {
    if (equipoEditando) {
      setFormData({
        tipoEquipoId: equipoEditando.tipoEquipoId,
        tipoEquipoNombre: equipoEditando.tipoEquipoNombre || "",
        marca: equipoEditando.marca,
        modelo: equipoEditando.modelo,
        bienNacional: equipoEditando.bienNacional,
        serial: equipoEditando.serial,
        observaciones: equipoEditando.observaciones,
        statusId: equipoEditando.statusId,
        estadoId: equipoEditando.estadoId,
        especificaciones: equipoEditando.especificaciones || {
          memoriaRam: "",
          modulosRam: "",
          capacidadDisco: "",
          tipoDisco: "",
          procesador: ""
        }
      })

      const tipo = tiposEquipo.find(t => t.id === equipoEditando.tipoEquipoId)
      setTipoSeleccionado(tipo || null)
      setUsandoNuevoTipo(!tipo)
      setMostrarListaTipos(false)
    } else {
      resetForm()
      setMostrarListaTipos(true)
    }
    setErrores([])
  }, [equipoEditando, tiposEquipo])

  // Determinar si mostrar especificaciones y campos opcionales
  useEffect(() => {
    const tipoNombre = tipoSeleccionado?.nombre || formData.tipoEquipoNombre
    const requiereEspec = Boolean(tipoNombre && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoNombre))
    const tieneCamposOpcionales = Boolean(tipoNombre && EQUIPOS_CON_CAMPOS_OPCIONALES.includes(tipoNombre))

    setMostrarEspecificaciones(requiereEspec)
    setCamposOpcionales(tieneCamposOpcionales)
  }, [tipoSeleccionado, formData.tipoEquipoNombre])

  const resetForm = () => {
    setFormData(initialFormData)
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(false)
    setBusquedaTipo("")
    setNuevoTipo("")
    setMostrarListaTipos(false)
    setMarcaSeleccionada(null)
    setEsMarcaNueva(false)
  }

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
    setBusquedaTipo("")
    setMostrarListaTipos(false)
  }

  const handleSeleccionarNuevoTipo = () => {
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(true)
    setFormData(prev => ({
      ...prev,
      tipoEquipoId: 0,
      tipoEquipoNombre: ""
    }))
    setMostrarListaTipos(false)
  }

  const handleEliminarTipoSeleccionado = () => {
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(false)
    setFormData(prev => ({
      ...prev,
      tipoEquipoId: 0,
      tipoEquipoNombre: ""
    }))
    setNuevoTipo("")
    setMostrarListaTipos(true)
  }

  const handleSeleccionarMarca = async (marca: {id: number, nombre: string} | "otro", nombreNuevo?: string) => {
    if (marca === "otro") {
      if (nombreNuevo) {
        try {
          const response = await axios.post('/api/equipos/marcas/crearMarca', {
            nombre: nombreNuevo
          })
          
          if (response.data.marca) {
            const nuevaMarca = response.data.marca
            setFormData(prev => ({ ...prev, marca: nuevaMarca.nombre }))
            setMarcaSeleccionada(nuevaMarca)
            setEsMarcaNueva(true)
          }
        } catch (error) {
          console.error('Error creando nueva marca:', error)
          setFormData(prev => ({ ...prev, marca: nombreNuevo }))
          setMarcaSeleccionada(null)
          setEsMarcaNueva(true)
        }
      } else {
        setFormData(prev => ({ ...prev, marca: "" }))
        setMarcaSeleccionada(null)
        setEsMarcaNueva(true)
      }
    } else {
      setFormData(prev => ({ ...prev, marca: marca.nombre }))
      setMarcaSeleccionada(marca)
      setEsMarcaNueva(false)
    }
    
    setFormData(prev => ({ ...prev, modelo: "" }))
    setMostrarModalMarca(false)
  }

  const handleSeleccionarModelo = async (modelo: {id: number, nombre: string} | "otro", nombreNuevo?: string) => {
    if (modelo === "otro") {
      if (nombreNuevo && marcaSeleccionada) {
        try {
          const response = await axios.post('/api/equipos/modelos/crearModelo', {
            nombre: nombreNuevo,
            marcaId: marcaSeleccionada.id
          })
          
          if (response.data.modelo) {
            const nuevoModelo = response.data.modelo
            setFormData(prev => ({ ...prev, modelo: nuevoModelo.nombre }))
          }
        } catch (error) {
          console.error('Error creando nuevo modelo:', error)
          setFormData(prev => ({ ...prev, modelo: nombreNuevo }))
        }
      } else {
        setFormData(prev => ({ ...prev, modelo: nombreNuevo || "" }))
      }
    } else {
      setFormData(prev => ({ ...prev, modelo: modelo.nombre }))
    }
    setMostrarModalModelo(false)
  }

  const crearNuevoTipoEquipo = async (): Promise<TipoEquipo | null> => {
    if (!nuevoTipo.trim()) return null

    try {
      const response = await axios.post('/api/equipos/tipos', {
        nombre: nuevoTipo.trim()
      })

      if (response.data.tipo) {
        return response.data.tipo
      }
      return null
    } catch (error) {
      console.error('Error creando tipo de equipo:', error)
      throw error
    }
  }

  const esTipoConCamposOpcionales = (tipoNombre: string): boolean => {
    return EQUIPOS_CON_CAMPOS_OPCIONALES.includes(tipoNombre)
  }

  const validarFormulario = (): string[] => {
    const nuevosErrores: string[] = []

    if (!tipoSeleccionado && !usandoNuevoTipo && !nuevoTipo.trim() && !formData.tipoEquipoNombre) {
      nuevosErrores.push("El tipo de equipo es requerido")
    }

    if (!formData.marca.trim()) {
      nuevosErrores.push("La marca es requerida")
    }

    if (!formData.modelo.trim()) {
      nuevosErrores.push("El modelo es requerido")
    }

    if (!formData.statusId) {
      nuevosErrores.push("El status es requerido")
    }

    if (!formData.estadoId) {
      nuevosErrores.push("El estado es requerido")
    }

    const tipoEquipoNombre = tipoSeleccionado?.nombre || nuevoTipo || formData.tipoEquipoNombre
    const esTipoOpcional = esTipoConCamposOpcionales(tipoEquipoNombre)

    if (!esTipoOpcional) {
      if (!formData.bienNacional.trim()) {
        nuevosErrores.push("El bien nacional es requerido")
      }

      if (!formData.serial.trim()) {
        nuevosErrores.push("El serial es requerido")
      }
    }

    if (mostrarEspecificaciones && formData.especificaciones) {
      const especs = formData.especificaciones
      if (!especs.memoriaRam.trim()) nuevosErrores.push("La memoria RAM es requerida")
      if (!especs.modulosRam.trim()) nuevosErrores.push("Los módulos RAM son requeridos")
      if (!especs.capacidadDisco.trim()) nuevosErrores.push("La capacidad del disco es requerida")
      if (!especs.tipoDisco.trim()) nuevosErrores.push("El tipo de disco es requerido")
      if (!especs.procesador.trim()) nuevosErrores.push("El procesador es requerido")
    }

    return nuevosErrores
  }

  const handleGuardar = async () => {
    const nuevosErrores = validarFormulario()
    
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores)
      return
    }

    try {
      let tipoFinal: TipoEquipo | null = tipoSeleccionado

      if (usandoNuevoTipo && nuevoTipo.trim()) {
        tipoFinal = await crearNuevoTipoEquipo()
      }

      if (!tipoFinal && !usandoNuevoTipo && !formData.tipoEquipoNombre) {
        throw new Error("No se pudo determinar el tipo de equipo")
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

      onGuardar(equipoData as EquipoConEspecificaciones)
      resetForm()
      setErrores([])
    } catch (error) {
      console.error('Error guardando equipo:', error)
    }
  }

  const handleCerrar = () => {
    onClose()
    resetForm()
    setErrores([])
  }

  // Filtrar tipos de equipo basado en la búsqueda
  const tiposFiltrados = tiposEquipo.filter(tipo =>
    tipo.nombre.toLowerCase().includes(busquedaTipo.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5]">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {equipoEditando ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
          </h3>
          <button
            onClick={handleCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  onClick={() => setMostrarListaTipos(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  disabled={disabled}
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
                      onChange={(e) => setBusquedaTipo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Buscar tipo de equipo..."
                      disabled={disabled}
                    />
                  </div>

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

              {usandoNuevoTipo && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
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
                <button
                  type="button"
                  onClick={() => setMostrarModalMarca(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F] flex items-center justify-between"
                  disabled={disabled}
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
                  onClick={() => setMostrarModalModelo(true)}
                  disabled={disabled || !formData.marca}
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

            {/* Bien Nacional y Serial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bien Nacional {!camposOpcionales && "*"}
                </label>
                <input
                  type="number"
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

            {/* Especificaciones Técnicas */}
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
            onClick={handleCerrar}
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
            {equipoEditando ? 'Actualizar Equipo' : 'Agregar Equipo'}
          </button>
        </div>
      </div>

      {/* Mini Modals para marca y modelo */}
      <MiniModalBusqueda
        isOpen={mostrarModalMarca}
        onClose={() => setMostrarModalMarca(false)}
        onSeleccionar={handleSeleccionarMarca}
        tipo="marca"
        valorActual={formData.marca}
      />

      <MiniModalBusqueda
        isOpen={mostrarModalModelo}
        onClose={() => setMostrarModalModelo(false)}
        onSeleccionar={handleSeleccionarModelo}
        tipo="modelo"
        marcaId={marcaSeleccionada?.id}
        valorActual={formData.modelo}
        esMarcaNueva={esMarcaNueva}
      />
    </div>
  )
}