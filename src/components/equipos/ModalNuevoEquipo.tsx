"use client"

import { useState, useEffect, useRef } from "react" // Agregar useRef
import { X, CheckCircle } from "lucide-react"
import axios from "axios"
import MiniModalBusqueda from "./MiniModalBusqueda"
import TipoEquipoSection from "./editarEquiposComponents/TipoEquipoSection"
import MarcaModeloSection from "./editarEquiposComponents/MarcaModeloSection"
import CamposBasicosSection from "./editarEquiposComponents/CamposBasicosSection"
import StatusEstadoSection from "./editarEquiposComponents/StatusEstadoSection"
import EspecificacionesSection from "./editarEquiposComponents/EspecificacionesSection"

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
const EQUIPOS_CON_CAMPOS_OPCIONALES = ["Mouse"]

export default function ModalNuevoEquipo({ isOpen, onClose, onEquipoCreado }: ModalNuevoEquipoProps) {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [loading, setLoading] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [errores, setErrores] = useState<string[]>([])
  const [mensajeExito, setMensajeExito] = useState<string>("")

  // Referencias para scroll automático
  const mensajeExitoRef = useRef<HTMLDivElement>(null)
  const mensajeErrorRef = useRef<HTMLDivElement>(null)

  // Estados para el formulario
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

  // Estados para los mini modales de marca y modelo
  const [mostrarModalMarca, setMostrarModalMarca] = useState(false)
  const [mostrarModalModelo, setMostrarModalModelo] = useState(false)
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<{id: number, nombre: string} | null>(null)
  const [esMarcaNueva, setEsMarcaNueva] = useState(false)

  // Efecto para controlar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Efecto para hacer scroll al mensaje de éxito
  useEffect(() => {
    if (mensajeExito && mensajeExitoRef.current) {
      mensajeExitoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [mensajeExito])

  // Efecto para hacer scroll al mensaje de error
  useEffect(() => {
    if (errores.length > 0 && mensajeErrorRef.current) {
      mensajeErrorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [errores])

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
    const requiereEspec = Boolean(tipoNombre && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoNombre))
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
    setMarcaSeleccionada(null)
    setMostrarModalMarca(false)
    setMostrarModalModelo(false)
    setEsMarcaNueva(false)
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

  // Handlers para marcas y modelos
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
        setTiposEquipo(prev => [...prev, response.data.tipo])
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

    const tipoEquipoNombre = tipoSeleccionado?.nombre || nuevoTipo || ""
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

      if (usandoNuevoTipo && nuevoTipo.trim()) {
        tipoFinal = await crearNuevoTipoEquipo()
      }

      if (!tipoFinal && !usandoNuevoTipo) {
        throw new Error("No se pudo determinar el tipo de equipo")
      }

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

      if (mostrarEspecificaciones && formData.especificaciones) {
        equipoData.especificaciones = {}
        
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

        if (Object.keys(equipoData.especificaciones).length === 0) {
          delete equipoData.especificaciones
        }
      }

      const response = await axios.post('/api/equipos/crearEquipo', equipoData)

      if (response.status === 201) {
        setMensajeExito("¡Equipo creado con éxito!")
        onEquipoCreado()
        
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
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mensaje de éxito con ref para scroll automático */}
          {mensajeExito && (
            <div
              ref={mensajeExitoRef}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">{mensajeExito}</p>
                  <p className="text-green-600 text-sm mt-1">
                    El modal se cerrará automáticamente...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de error con ref para scroll automático */}
          {errores.length > 0 && (
            <div
              ref={mensajeErrorRef}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <h4 className="font-medium text-red-800 mb-2">Por favor complete los siguientes campos:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <TipoEquipoSection
              tiposEquipo={tiposEquipo}
              tipoSeleccionado={tipoSeleccionado}
              usandoNuevoTipo={usandoNuevoTipo}
              busquedaTipo={busquedaTipo}
              nuevoTipo={nuevoTipo}
              mostrarListaTipos={mostrarListaTipos}
              camposOpcionales={camposOpcionales}
              loading={loading}
              onSetBusquedaTipo={setBusquedaTipo}
              onSetMostrarListaTipos={setMostrarListaTipos}
              onSeleccionarTipo={handleSeleccionarTipo}
              onSeleccionarNuevoTipo={handleSeleccionarNuevoTipo}
              onEliminarTipoSeleccionado={handleEliminarTipoSeleccionado}
              onSetNuevoTipo={setNuevoTipo}
            />

            <MarcaModeloSection
              formData={formData}
              loading={loading}
              onShowMarcaModal={() => setMostrarModalMarca(true)}
              onShowModeloModal={() => setMostrarModalModelo(true)}
            />

            <CamposBasicosSection
              formData={formData}
              loading={loading}
              camposOpcionales={camposOpcionales}
              onChange={handleChange}
            />

            <StatusEstadoSection
              formData={formData}
              status={status}
              estados={estados}
              loading={loading}
              onChange={handleChange}
            />

            {mostrarEspecificaciones && (
              <EspecificacionesSection
                especificaciones={formData.especificaciones!}
                loading={loading}
                onChange={handleEspecificacionChange}
              />
            )}
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

      {/* Mini Modals */}
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