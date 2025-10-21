"use client"

import { useState, useEffect } from "react"
import { X, Search, Trash2, Cpu, CheckCircle } from "lucide-react"
import axios from "axios"

// Interfaces (mantener las mismas interfaces anteriores)
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

interface EspecificacionesAdicionales {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoFormData {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string
  marca: string
  statusId: number
  estadoId: number
  especificaciones?: EspecificacionesAdicionales
}

interface EquipoPayload {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  modelo: string
  marca: string
  statusId: number
  estadoId: number
  especificaciones?: {
    memoriaRam?: string
    modulosRam?: string
    capacidadDisco?: string
    tipoDisco?: string
    procesador?: string
  }
}

interface ModalNuevoEquipoProps {
  isOpen: boolean
  onClose: () => void
  onEquipoCreado: () => void
}

// Tipos de equipos que requieren especificaciones adicionales
const EQUIPOS_CON_ESPECIFICACIONES = ["Ordenador", "Laptop", "AllInOne"]
// Tipos de equipos que pueden tener bien nacional y serial opcional
const EQUIPOS_CON_CAMPOS_OPCIONALES = ["Mouse"]

export default function ModalNuevoEquipo({ isOpen, onClose, onEquipoCreado }: ModalNuevoEquipoProps) {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [loading, setLoading] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [errores, setErrores] = useState<string[]>([])
  const [mensajeExito, setMensajeExito] = useState<string>("")

  // Estados para el formulario (mantener los mismos estados anteriores)
  const [formData, setFormData] = useState<EquipoFormData>({
    bienNacional: "",
    serial: "",
    observaciones: "",
    tipoEquipoId: 0,
    modelo: "",
    marca: "",
    statusId: 0,
    estadoId: 0,
    especificaciones: {
      memoriaRam: "",
      modulosRam: "",
      capacidadDisco: "",
      tipoDisco: "",
      procesador: ""
    }
  })

  // Estados para la selección de tipo
  const [busquedaTipo, setBusquedaTipo] = useState("")
  const [nuevoTipo, setNuevoTipo] = useState("")
  const [mostrarListaTipos, setMostrarListaTipos] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoEquipo | null>(null)
  const [usandoNuevoTipo, setUsandoNuevoTipo] = useState(false)
  const [mostrarEspecificaciones, setMostrarEspecificaciones] = useState(false)
  const [camposOpcionales, setCamposOpcionales] = useState(false)

  // Efecto para controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY
      
      // Agregar estilos para deshabilitar el scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      // Función de limpieza
      return () => {
        // Restaurar el scroll al cerrar el modal
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Efecto para mostrar mensaje de éxito por 5 segundos
  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        setMensajeExito("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [mensajeExito])

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargandoDatos(true)

        const [tiposResponse, statusResponse, estadosResponse] = await Promise.all([
          axios.get('/api/equipos/tipos'),
          axios.get('/api/equipos/status'),
          axios.get('/api/equipos/estados')
        ])

        setTiposEquipo(tiposResponse.data.tipos || [])
        setStatus(statusResponse.data.status || [])
        setEstados(estadosResponse.data.estados || [])

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setCargandoDatos(false)
      }
    }

    if (isOpen) {
      cargarDatosIniciales()
    }
  }, [isOpen])

  // Determinar si mostrar especificaciones y campos opcionales
  useEffect(() => {
    const tipoNombre = tipoSeleccionado?.nombre || formData.tipoEquipoNombre
    
    // Verificar si requiere especificaciones
    const requiereEspec = Boolean(tipoNombre && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoNombre))
    
    // Verificar si tiene campos opcionales (usando la constante)
    const tieneCamposOpcionales = Boolean(tipoNombre && EQUIPOS_CON_CAMPOS_OPCIONALES.includes(tipoNombre))

    setMostrarEspecificaciones(requiereEspec)
    setCamposOpcionales(tieneCamposOpcionales)
  }, [tipoSeleccionado, formData.tipoEquipoNombre])

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      bienNacional: "",
      serial: "",
      observaciones: "",
      tipoEquipoId: 0,
      modelo: "",
      marca: "",
      statusId: 0,
      estadoId: 0,
      especificaciones: {
        memoriaRam: "",
        modulosRam: "",
        capacidadDisco: "",
        tipoDisco: "",
        procesador: ""
      }
    })
    setTipoSeleccionado(null)
    setUsandoNuevoTipo(false)
    setBusquedaTipo("")
    setNuevoTipo("")
    setMostrarListaTipos(false)
    setErrores([])
    setMensajeExito("")
  }

  const handleChange = (field: keyof Omit<EquipoFormData, 'especificaciones'>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEspecificacionChange = (field: keyof EspecificacionesAdicionales, value: string) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones!,
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

  const crearNuevoTipoEquipo = async (): Promise<TipoEquipo | null> => {
    if (!nuevoTipo.trim()) return null

    try {
      const response = await axios.post('/api/equipos/tipos', {
        nombre: nuevoTipo.trim()
      })

      if (response.data.tipo) {
        setTiposEquipo(prev => [...prev, response.data.tipo])
        return response.data.tipo
      }
      return null
    } catch (error) {
      console.error('Error creando tipo de equipo:', error)
      throw error
    }
  }

  // Función para verificar si un tipo de equipo tiene campos opcionales
  const esTipoConCamposOpcionales = (tipoNombre: string): boolean => {
    return EQUIPOS_CON_CAMPOS_OPCIONALES.includes(tipoNombre)
  }

  const validarFormulario = (): string[] => {
    const nuevosErrores: string[] = []

    if (!tipoSeleccionado && !usandoNuevoTipo && !nuevoTipo.trim()) {
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

    // Validar campos específicos basados en el tipo de equipo
    const tipoEquipoNombre = tipoSeleccionado?.nombre || nuevoTipo || ""
    const esTipoOpcional = esTipoConCamposOpcionales(tipoEquipoNombre)

    // Solo validar bien nacional y serial si NO es un tipo con campos opcionales
    if (!esTipoOpcional) {
      if (!formData.bienNacional.trim()) {
        nuevosErrores.push("El bien nacional es requerido")
      }

      if (!formData.serial.trim()) {
        nuevosErrores.push("El serial es requerido")
      }
    }

    // Validar especificaciones técnicas si aplican
    if (mostrarEspecificaciones && formData.especificaciones) {
      const especs = formData.especificaciones
      if (!especs.memoriaRam.trim()) {
        nuevosErrores.push("La memoria RAM es requerida")
      }
      if (!especs.modulosRam.trim()) {
        nuevosErrores.push("Los módulos RAM son requeridos")
      }
      if (!especs.capacidadDisco.trim()) {
        nuevosErrores.push("La capacidad del disco es requerida")
      }
      if (!especs.tipoDisco.trim()) {
        nuevosErrores.push("El tipo de disco es requerido")
      }
      if (!especs.procesador.trim()) {
        nuevosErrores.push("El procesador es requerido")
      }
    }

    return nuevosErrores
  }

  const handleSubmit = async () => {
    const nuevosErrores = validarFormulario()
    
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    setErrores([])

    try {
      let tipoFinal: TipoEquipo | null = tipoSeleccionado

      // Si está usando un nuevo tipo, crearlo
      if (usandoNuevoTipo && nuevoTipo.trim()) {
        tipoFinal = await crearNuevoTipoEquipo()
      }

      if (!tipoFinal && !usandoNuevoTipo) {
        throw new Error("No se pudo determinar el tipo de equipo")
      }

      // Preparar datos para enviar
      const equipoData: EquipoPayload = {
        bienNacional: formData.bienNacional,
        serial: formData.serial,
        observaciones: formData.observaciones,
        tipoEquipoId: tipoFinal?.id || 0,
        modelo: formData.modelo,
        marca: formData.marca,
        statusId: formData.statusId,
        estadoId: formData.estadoId
      }

      // Si requiere especificaciones, agregarlas (solo campos con valor)
      if (mostrarEspecificaciones && formData.especificaciones) {
        equipoData.especificaciones = {}
        
        // Solo agregar campos que tengan valor
        if (formData.especificaciones.memoriaRam.trim()) {
          equipoData.especificaciones.memoriaRam = formData.especificaciones.memoriaRam
        }
        if (formData.especificaciones.modulosRam.trim()) {
          equipoData.especificaciones.modulosRam = formData.especificaciones.modulosRam
        }
        if (formData.especificaciones.capacidadDisco.trim()) {
          equipoData.especificaciones.capacidadDisco = formData.especificaciones.capacidadDisco
        }
        if (formData.especificaciones.tipoDisco.trim()) {
          equipoData.especificaciones.tipoDisco = formData.especificaciones.tipoDisco
        }
        if (formData.especificaciones.procesador.trim()) {
          equipoData.especificaciones.procesador = formData.especificaciones.procesador
        }

        // Si no hay ninguna especificación con valor, no enviar el objeto
        if (Object.keys(equipoData.especificaciones).length === 0) {
          delete equipoData.especificaciones
        }
      }

      // Crear el equipo
      const response = await axios.post('/api/equipos', equipoData)

      if (response.status === 201) {
        // Mostrar mensaje de éxito
        setMensajeExito("¡Equipo creado con éxito!")
        
        // Notificar al componente padre
        onEquipoCreado()
        
        // Cerrar el modal después de 2 segundos para que el usuario vea el mensaje
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      }

    } catch (error: unknown) {
      console.error('Error creando equipo:', error)
      if (axios.isAxiosError(error)) {
        setErrores([error.response?.data?.error || 'Error al crear el equipo'])
      } else if (error instanceof Error) {
        setErrores([error.message])
      } else {
        setErrores(['Error al crear el equipo'])
      }
    } finally {
      setLoading(false)
    }
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
            Registrar Nuevo Equipo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mensaje de éxito */}
          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">{mensajeExito}</p>
                  <p className="text-green-600 text-sm mt-1">
                    El modal se cerrará automáticamente...
                  </p>
                </div>
              </div>
            </div>
          )}

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
                    onClick={handleEliminarTipoSeleccionado}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMostrarListaTipos(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                  disabled={loading || cargandoDatos}
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
                      onChange={(e) => setBusquedaTipo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Buscar tipo de equipo..."
                      disabled={loading}
                    />
                  </div>

                  {/* Lista de tipos */}
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md mt-2">
                    {tiposFiltrados.map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => handleSeleccionarTipo(tipo)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100"
                        disabled={loading}
                      >
                        {tipo.nombre}
                      </button>
                    ))}

                    {/* Opción para nuevo tipo */}
                    <button
                      type="button"
                      onClick={handleSeleccionarNuevoTipo}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      disabled={loading}
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
                    onChange={(e) => setNuevoTipo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                    placeholder="Escriba el nuevo tipo de equipo..."
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  onChange={(e) => handleChange('serial', e.target.value)}
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
                  disabled={loading || cargandoDatos}
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
                  disabled={loading || cargandoDatos}
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
                      value={formData.especificaciones!.memoriaRam}
                      onChange={(e) => handleEspecificacionChange('memoriaRam', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 8GB"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Módulos RAM *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones!.modulosRam}
                      onChange={(e) => handleEspecificacionChange('modulosRam', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 2x4GB"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad Disco *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones!.capacidadDisco}
                      onChange={(e) => handleEspecificacionChange('capacidadDisco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: 500GB"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Disco *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones!.tipoDisco}
                      onChange={(e) => handleEspecificacionChange('tipoDisco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: SSD, HDD"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Procesador *
                    </label>
                    <input
                      type="text"
                      value={formData.especificaciones!.procesador}
                      onChange={(e) => handleEspecificacionChange('procesador', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
                      placeholder="Ej: Intel i5"
                      disabled={loading}
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
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Campo opcional</p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || cargandoDatos || !!mensajeExito}
            className="px-4 py-2 cursor-pointer bg-[#001F3F] text-white hover:bg-[#003366] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando...
              </>
            ) : (
              'Crear Equipo'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}