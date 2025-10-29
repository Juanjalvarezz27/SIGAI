"use client"

import { useState, useEffect } from "react"
import { User, MapPin, Building, Monitor, Check, Briefcase } from "lucide-react"
import BarraBusquedaPersonal from "./BarraBusquedaPersonal"
import { UsuarioBasico, Equipo } from "../../../types/ticket"
import axios from 'axios'

interface FormularioSoporteRedesProps {
  formData: {
    usuarioAfectadoId?: string
    equiposSeleccionados?: number[]
  }
  onFormDataChange: (data: {
    usuarioAfectadoId?: string
    equiposSeleccionados?: number[]
  }) => void
  isSubmitting: boolean
  esSolicitante?: boolean
}

// Función helper para los equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    const tipo = equipo.tipoEquipo?.nombre || 'sin-tipo'
    const marca = equipo.modelo?.marca?.nombre || 'sin-marca'
    const modelo = equipo.modelo?.nombre || 'sin-modelo'
    const bien = equipo.bienNacional || 'sin-bien'
    const serial = equipo.serial || 'sin-serial'

    return `${tipo}-${marca}-${modelo}-${bien}-${serial}`
  }

  const equiposUnicos = new Map()

  equipos.forEach(equipo => {
    const clave = crearClaveUnica(equipo)
    if (!equiposUnicos.has(clave)) {
      equiposUnicos.set(clave, equipo)
    }
  })

  return Array.from(equiposUnicos.values())
}

export default function FormularioSoporteRedes({
  formData,
  onFormDataChange,
  isSubmitting,
  esSolicitante = false
}: FormularioSoporteRedesProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioBasico | null>(null)
  const [equiposUsuario, setEquiposUsuario] = useState<Equipo[]>([])
  const [cargandoEquipos, setCargandoEquipos] = useState(false)
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<Equipo[]>([])
  const [direccionUsuarioActual, setDireccionUsuarioActual] = useState<number | null>(null)
  const [cargandoDireccion, setCargandoDireccion] = useState(false)

  // Obtener la dirección del usuario actual si es solicitante
  useEffect(() => {
    const obtenerDireccionUsuarioActual = async () => {
      if (esSolicitante) {
        try {
          setCargandoDireccion(true)
          const response = await axios.get('/api/auth/usuario-direccion')
          setDireccionUsuarioActual(response.data.direccionId)
        } catch (error) {
          console.error('Error obteniendo dirección del usuario:', error)
        } finally {
          setCargandoDireccion(false)
        }
      }
    }

    obtenerDireccionUsuarioActual()
  }, [esSolicitante])

  // Manejar selección de usuario desde BarraBusquedaPersonal
  const handleUsuarioSeleccionado = async (usuario: UsuarioBasico) => {
    // Para solicitantes, ya no necesitamos validar aquí porque el endpoint lo hace
    // Pero mantenemos la validación por seguridad
    if (esSolicitante && direccionUsuarioActual) {
      if (usuario.direccion?.id !== direccionUsuarioActual) {
        alert('Solo puedes seleccionar usuarios de tu misma dirección')
        return
      }
    }

    setUsuarioSeleccionado(usuario)
    onFormDataChange({
      ...formData,
      usuarioAfectadoId: usuario.id.toString()
    })

    // Resetear equipos anteriores
    setEquiposSeleccionados([])
    onFormDataChange({
      ...formData,
      usuarioAfectadoId: usuario.id.toString(),
      equiposSeleccionados: []
    })

    // Cargar equipos del usuario seleccionado
    setCargandoEquipos(true)
    try {
      const response = await axios.get(`/api/usuario/${usuario.id}/equipos`)
      const equipos = response.data
      const equiposUnicos = eliminarEquiposDuplicados(equipos)
      setEquiposUsuario(equiposUnicos)
    } catch (error) {
      console.error('Error cargando equipos:', error)
      setEquiposUsuario([])
    } finally {
      setCargandoEquipos(false)
    }
  }

  // Manejar selección/deselección de equipos
  const toggleEquipoSeleccionado = (equipo: Equipo) => {
    const nuevosSeleccionados = equiposSeleccionados.find(e => e.id === equipo.id)
      ? equiposSeleccionados.filter(e => e.id !== equipo.id)
      : [...equiposSeleccionados, equipo]

    setEquiposSeleccionados(nuevosSeleccionados)

    onFormDataChange({
      ...formData,
      equiposSeleccionados: nuevosSeleccionados.map(e => e.id)
    })
  }

  // Verificar si un equipo está seleccionado
  const isEquipoSeleccionado = (equipoId: number) => {
    return equiposSeleccionados.some(e => e.id === equipoId)
  }

  // Función para obtener el nombre del equipo de forma segura
  const getNombreEquipo = (equipo: Equipo): string => {
    const tipo = equipo.tipoEquipo?.nombre || 'Equipo'
    const marca = equipo.modelo?.marca?.nombre || ''
    const modelo = equipo.modelo?.nombre || ''

    return `${tipo} ${marca} ${modelo}`.trim()
  }

  // Función para obtener información del equipo de forma segura
  const getInfoEquipo = (equipo: Equipo) => {
    return {
      bienNacional: equipo.bienNacional || 'No asignado',
      serial: equipo.serial || 'No asignado',
      status: equipo.status?.estado || 'No especificado',
      marca: equipo.modelo?.marca?.nombre || 'No especificada',
      modelo: equipo.modelo?.nombre || 'No especificado'
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensaje informativo para solicitante */}
      {esSolicitante && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Restricción:</strong> Solo puedes seleccionar usuarios de tu misma dirección.
            {cargandoDireccion && " (Cargando información de dirección...)"}
          </p>
        </div>
      )}

      {/* Búsqueda de usuario afectado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuario Afectado *
        </label>
        <BarraBusquedaPersonal
          onUsuarioSeleccionado={handleUsuarioSeleccionado}
          placeholder="Buscar usuario por nombre, cédula o email..."
          loading={isSubmitting}
          esSolicitante={esSolicitante}
        />
      </div>

      {/* Información del usuario seleccionado */}
      {usuarioSeleccionado && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Usuario Afectado
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-medium">
                {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido || ''}
              </p>
            </div>

            {usuarioSeleccionado.cedula && (
              <div>
                <p className="text-sm text-gray-600">Cédula</p>
                <p className="font-medium">{usuarioSeleccionado.cedula}</p>
              </div>
            )}

            {usuarioSeleccionado.direccion && (
              <>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Piso</p>
                    <p className="font-medium">{usuarioSeleccionado.direccion.piso.piso}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{usuarioSeleccionado.direccion.direccion}</p>
                  </div>
                </div>
              </>
            )}

            {usuarioSeleccionado.area && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-medium">{usuarioSeleccionado.area.nombre}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Equipos del usuario seleccionado */}
      {usuarioSeleccionado && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Equipos Asignados al Usuario *
            </h4>
            <span className="text-sm text-gray-500">
              {equiposSeleccionados.length} de {equiposUsuario.length} seleccionados
            </span>
          </div>

          {cargandoEquipos ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : equiposUsuario.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {equiposUsuario.map((equipo) => {
                const infoEquipo = getInfoEquipo(equipo)
                const nombreEquipo = getNombreEquipo(equipo)
                const seleccionado = isEquipoSeleccionado(equipo.id)

                return (
                  <div
                    key={equipo.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      seleccionado
                        ? 'border-[#001F3F] bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => !isSubmitting && toggleEquipoSeleccionado(equipo)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 border rounded mt-0.5 flex items-center justify-center ${
                        seleccionado
                          ? 'bg-[#001F3F] border-[#001F3F]'
                          : 'border-gray-300'
                      }`}>
                        {seleccionado && <Check size={14} className="text-white" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {nombreEquipo}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <p>{infoEquipo.marca} {infoEquipo.modelo}</p>
                          <p>Bien: {infoEquipo.bienNacional}</p>
                          <p>Serial: {infoEquipo.serial}</p>
                          <p>Status: {infoEquipo.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
              <Monitor className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">El usuario no tiene equipos asignados</p>
            </div>
          )}
        </div>
      )}

      {/* Equipos seleccionados (resumen) */}
      {equiposSeleccionados.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Equipos Seleccionados ({equiposSeleccionados.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {equiposSeleccionados.map((equipo) => (
              <span
                key={equipo.id}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
              >
                <Monitor size={12} />
                {getNombreEquipo(equipo)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}