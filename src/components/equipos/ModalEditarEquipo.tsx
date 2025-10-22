"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle } from "lucide-react"
import axios from "axios"
import { Equipo, TipoEquipo, Status, Estados } from "../../../types/equipos"
import ReasignacionEquipo from "./ReasignacionEquipo"
import MiniModalBusqueda from "./MiniModalBusqueda"
import TipoEquipoSection from "./editarEquiposComponents/TipoEquipoSection"
import MarcaModeloSection from "./editarEquiposComponents/MarcaModeloSection"
import CamposBasicosSection from "./editarEquiposComponents/CamposBasicosSection"
import StatusEstadoSection from "./editarEquiposComponents/StatusEstadoSection"
import EspecificacionesSection from "./editarEquiposComponents/EspecificacionesSection"

// Interfaces locales para el formulario
interface EspecificacionesFormData {
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
  especificaciones?: EspecificacionesFormData
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

interface ModalEditarEquipoProps {
  isOpen: boolean
  onClose: () => void
  onEquipoEditado: () => void
  equipo: Equipo | null
}

// Tipos de equipos que requieren especificaciones adicionales
const EQUIPOS_CON_ESPECIFICACIONES = ["Ordenador", "Laptop", "AllInOne"]
const EQUIPOS_CON_CAMPOS_OPCIONALES = ["Mouse"]

export default function ModalEditarEquipo({
  isOpen,
  onClose,
  onEquipoEditado,
  equipo
}: ModalEditarEquipoProps) {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [estados, setEstados] = useState<Estados[]>([])
  const [loading, setLoading] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [errores, setErrores] = useState<string[]>([])
  const [mensajeExito, setMensajeExito] = useState<string>("")

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

  // Efecto para mostrar mensaje de éxito por 5 segundos
  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        setMensajeExito("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [mensajeExito])

  // Cargar datos iniciales y llenar formulario con datos del equipo
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

        if (equipo) {
          const tipoEquipo = tiposResponse.data.tipos?.find((t: TipoEquipo) => t.id === equipo.tipoEquipo.id)

          setFormData({
            bienNacional: equipo.bienNacional || "",
            serial: equipo.serial || "",
            observaciones: equipo.observaciones || "",
            tipoEquipoId: equipo.tipoEquipo.id,
            tipoEquipoNombre: equipo.tipoEquipo.nombre,
            modelo: equipo.modelo.nombre,
            marca: equipo.modelo.marca.nombre,
            statusId: equipo.status?.id || 0,
            estadoId: equipo.estado?.id || 0,
            especificaciones: equipo.especificaciones ? {
              memoriaRam: equipo.especificaciones.memoriaRam || "",
              modulosRam: equipo.especificaciones.modulosRam || "",
              capacidadDisco: equipo.especificaciones.capacidadDisco || "",
              tipoDisco: equipo.especificaciones.tipoDisco || "",
              procesador: equipo.especificaciones.procesador || ""
            } : {
              memoriaRam: "",
              modulosRam: "",
              capacidadDisco: "",
              tipoDisco: "",
              procesador: ""
            }
          })

          setTipoSeleccionado(tipoEquipo || null)
          setMarcaSeleccionada({
            id: equipo.modelo.marca.id,
            nombre: equipo.modelo.marca.nombre
          })
          setEsMarcaNueva(false)
        }

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setCargandoDatos(false)
      }
    }

    if (isOpen && equipo) {
      cargarDatosIniciales()
    }
  }, [isOpen, equipo])

  // Determinar si mostrar especificaciones y campos opcionales
  useEffect(() => {
    const tipoNombre = tipoSeleccionado?.nombre || formData.tipoEquipoNombre
    const requiereEspec = Boolean(tipoNombre && EQUIPOS_CON_ESPECIFICACIONES.includes(tipoNombre))
    const tieneCamposOpcionales = Boolean(tipoNombre && EQUIPOS_CON_CAMPOS_OPCIONALES.includes(tipoNombre))

    setMostrarEspecificaciones(requiereEspec)
    setCamposOpcionales(tieneCamposOpcionales)
  }, [tipoSeleccionado, formData.tipoEquipoNombre])

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
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

  const handleEspecificacionChange = (field: keyof EspecificacionesFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones!,
        [field]: value || ""
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

    if (!equipo) {
      setErrores(["No se encontró el equipo a editar"])
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
        equipoData.especificaciones = {
          memoriaRam: formData.especificaciones.memoriaRam.trim() || undefined,
          modulosRam: formData.especificaciones.modulosRam.trim() || undefined,
          capacidadDisco: formData.especificaciones.capacidadDisco.trim() || undefined,
          tipoDisco: formData.especificaciones.tipoDisco.trim() || undefined,
          procesador: formData.especificaciones.procesador.trim() || undefined
        }

        if (Object.values(equipoData.especificaciones).every(val => val === undefined)) {
          delete equipoData.especificaciones
        }
      }

      const response = await axios.put(`/api/equipos/${equipo.id}`, equipoData)

      if (response.status === 200) {
        setMensajeExito("¡Equipo actualizado con éxito!")
        onEquipoEditado()
      }

    } catch (error: unknown) {
      console.error('Error actualizando equipo:', error)
      if (axios.isAxiosError(error)) {
        setErrores([error.response?.data?.error || 'Error al actualizar el equipo'])
      } else if (error instanceof Error) {
        setErrores([error.message])
      } else {
        setErrores(['Error al actualizar el equipo'])
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !equipo) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5]">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Editar Equipo - {equipo.tipoEquipo.nombre}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {cargandoDatos && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Cargando datos del equipo...</p>
            </div>
          )}

          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">{mensajeExito}</p>
                  <p className="text-green-600 text-sm mt-1">
                    Los cambios se han guardado correctamente.
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

          {!cargandoDatos && (
            <div className="space-y-4">
              {equipo.usuario && (
                <ReasignacionEquipo
                  equipoId={equipo.id}
                  usuarioActual={{
                    id: equipo.usuario.id,
                    nombre: equipo.usuario.nombre,
                    apellido: equipo.usuario.apellido || "",
                    email: equipo.usuario.email || ""
                  }}
                  onReasignacionExitosa={() => {
                    window.location.reload()
                  }}
                  disabled={loading || cargandoDatos || !!mensajeExito}
                />
              )}

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
          )}
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {mensajeExito ? 'Cerrar' : 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || cargandoDatos || !!mensajeExito}
            className="px-4 py-2 bg-[#001F3F] text-white hover:bg-[#003366] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin"></div>
                Actualizando...
              </>
            ) : (
              'Actualizar Equipo'
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