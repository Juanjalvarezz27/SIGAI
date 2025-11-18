"use client"

import { useState, useCallback } from "react"
import { Plus, X, Monitor, Check, Power, PowerOff, Edit, Save, AlertCircle } from "lucide-react"
import { useUserRol } from '../../app/hooks/useUserRol'

interface Sistema {
  id: number
  nombre: string
  descripcion: string
  estado: string
}

interface AgregarSistemaButtonProps {
  tipoFiltro: string
}

// Componente separado para evitar re-renderizados innecesarios
const SistemaCard = ({ 
  sistema, 
  esActivo, 
  editandoDescripcion,
  descripcionesEditadas,
  guardandoDescripcion,
  cambiandoEstado,
  onIniciarEdicion,
  onCancelarEdicion,
  onActualizarDescripcion,
  onGuardarDescripcion,
  onCambiarEstado
}: { 
  sistema: Sistema
  esActivo: boolean
  editandoDescripcion: number | null
  descripcionesEditadas: {[key: number]: string}
  guardandoDescripcion: number | null
  cambiandoEstado: number | null
  onIniciarEdicion: (sistema: Sistema) => void
  onCancelarEdicion: () => void
  onActualizarDescripcion: (sistemaId: number, valor: string) => void
  onGuardarDescripcion: (sistemaId: number) => void
  onCambiarEstado: (sistemaId: number) => void
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 transition-colors">
      {/* Header con nombre y estado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-base">{sistema.nombre}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${esActivo ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${esActivo ? 'text-green-600' : 'text-red-600'}`}>
            {esActivo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-5">
        {editandoDescripcion === sistema.id ? (
          <div className="space-y-3">
            <textarea
              value={descripcionesEditadas[sistema.id] || ""}
              onChange={(e) => onActualizarDescripcion(sistema.id, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent resize-none text-base"
              placeholder="Agrega una descripción para este sistema..."
              autoFocus // Para que el foco se mantenga en el textarea
            />
            <div className="flex gap-2">
              <button
                onClick={() => onGuardarDescripcion(sistema.id)}
                disabled={guardandoDescripcion === sistema.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardandoDescripcion === sistema.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar
              </button>
              <button
                onClick={onCancelarEdicion}
                disabled={guardandoDescripcion === sistema.id}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 text-base mb-3 leading-relaxed">
              {sistema.descripcion || "Sin descripción"}
            </p>
            <button
              onClick={() => onIniciarEdicion(sistema)}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar descripción
            </button>
          </div>
        )}
      </div>

      {/* Botón de estado */}
      <div className="flex justify-end">
        <button
          onClick={() => onCambiarEstado(sistema.id)}
          disabled={cambiandoEstado === sistema.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            esActivo 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {cambiandoEstado === sistema.id ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : esActivo ? (
            <>
              <PowerOff className="w-4 h-4" />
              Desactivar
            </>
          ) : (
            <>
              <Power className="w-4 h-4" />
              Activar
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function AgregarSistemaButton({ tipoFiltro }: AgregarSistemaButtonProps) {
  // Todos los hooks deben ir al inicio, antes de cualquier condicional
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sistemas, setSistemas] = useState<Sistema[]>([])
  const [nuevoSistema, setNuevoSistema] = useState("")
  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [loading, setLoading] = useState(false)
  const [cargandoSistemas, setCargandoSistemas] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [mensajeError, setMensajeError] = useState("")
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null)
  const [editandoDescripcion, setEditandoDescripcion] = useState<number | null>(null)
  const [descripcionesEditadas, setDescripcionesEditadas] = useState<{[key: number]: string}>({})
  const [guardandoDescripcion, setGuardandoDescripcion] = useState<number | null>(null)

  const { userRol, loading: loadingRol } = useUserRol()

  // Mover las funciones que usan useCallback antes de cualquier condicional
  const mostrarError = useCallback((mensaje: string) => {
    setMensajeError(mensaje)
    setTimeout(() => setMensajeError(""), 5000)
  }, [])

  const mostrarExito = useCallback((mensaje: string) => {
    setMensajeExito(mensaje)
    setTimeout(() => setMensajeExito(""), 5000)
  }, [])

  const iniciarEdicionDescripcion = useCallback((sistema: Sistema) => {
    setEditandoDescripcion(sistema.id)
    setDescripcionesEditadas(prev => ({
      ...prev,
      [sistema.id]: sistema.descripcion || ""
    }))
  }, [])

  const cancelarEdicionDescripcion = useCallback(() => {
    setEditandoDescripcion(null)
  }, [])

  const actualizarDescripcionEditada = useCallback((sistemaId: number, valor: string) => {
    setDescripcionesEditadas(prev => ({
      ...prev,
      [sistemaId]: valor
    }))
  }, [])

  // Determinar si el usuario tiene permisos para agregar sistemas
  const puedeAgregarSistemas = userRol ?
    (userRol.rolId === 1 || // Admin
      (userRol.rolId === 2 && userRol.supervisorTipoId === 3)) : false // Supervisor de Sistemas

  // Ocultar el botón si no estamos en el filtro de sistemas o no tiene permisos
  if (tipoFiltro !== "sistemas" || !puedeAgregarSistemas) {
    return null
  }

  // Separar sistemas activos e inactivos
  const sistemasActivos = sistemas.filter(sistema => sistema.estado === 'Activo')
  const sistemasInactivos = sistemas.filter(sistema => sistema.estado === 'Inactivo')

  const cargarSistemas = async () => {
    setCargandoSistemas(true)
    try {
      const response = await fetch('/api/sistemas/crearSistema')
      if (response.ok) {
        const data = await response.json()
        setSistemas(data)
      } else {
        mostrarError('Error cargando los sistemas')
      }
    } catch (error) {
      mostrarError('Error cargando los sistemas')
    } finally {
      setCargandoSistemas(false)
    }
  }

  const abrirModal = async () => {
    setIsModalOpen(true)
    await cargarSistemas()
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setNuevoSistema("")
    setNuevaDescripcion("")
    setMensajeExito("")
    setMensajeError("")
    setEditandoDescripcion(null)
    setDescripcionesEditadas({})
    // Resetear todos los estados de carga
    setLoading(false)
    setCargandoSistemas(false)
    setCambiandoEstado(null)
    setGuardandoDescripcion(null)
  }

  const agregarSistema = async () => {
    if (!nuevoSistema.trim()) {
      mostrarError("Por favor ingresa un nombre para el sistema")
      return
    }

    if (!nuevaDescripcion.trim()) {
      mostrarError("Por favor ingresa una descripción para el sistema")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/sistemas/crearSistema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoSistema.trim(),
          descripcion: nuevaDescripcion.trim()
        }),
      })

      if (response.ok) {
        const sistemaCreado = await response.json()
        mostrarExito(`Sistema "${sistemaCreado.nombre}" agregado correctamente`)
        setNuevoSistema("")
        setNuevaDescripcion("")
        await cargarSistemas()
      } else {
        const errorData = await response.json()
        mostrarError(errorData.error || 'Error al agregar el sistema')
      }
    } catch (error) {
      mostrarError('Error al agregar el sistema')
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoSistema = async (sistemaId: number) => {
    setCambiandoEstado(sistemaId)
    try {
      const response = await fetch(`/api/sistemas/${sistemaId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        mostrarExito(result.message)
        await cargarSistemas()
      } else {
        const errorData = await response.json()
        mostrarError(errorData.error || 'Error al cambiar el estado del sistema')
      }
    } catch (error) {
      mostrarError('Error al cambiar el estado del sistema')
    } finally {
      setCambiandoEstado(null)
    }
  }

  const guardarDescripcion = async (sistemaId: number) => {
    const descripcion = descripcionesEditadas[sistemaId]?.trim()
    if (!descripcion) {
      mostrarError("La descripción no puede estar vacía")
      return
    }

    setGuardandoDescripcion(sistemaId)
    try {
      const response = await fetch(`/api/sistemas/${sistemaId}/descripcion`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: descripcion
        }),
      })

      if (response.ok) {
        const result = await response.json()
        mostrarExito(result.message || "Descripción actualizada correctamente")
        await cargarSistemas()
        setEditandoDescripcion(null)
      } else {
        const errorData = await response.json()
        mostrarError(errorData.error || 'Error al actualizar la descripción')
      }
    } catch (error) {
      mostrarError('Error al actualizar la descripción')
    } finally {
      setGuardandoDescripcion(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    agregarSistema()
  }

  // Mostrar loading mientras se verifica el rol
  if (loadingRol) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        Cargando...
      </div>
    )
  }

  return (
    <>
      {/* Botón + Agregar Sistema */}
      <button
        onClick={abrirModal}
        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
      >
        <Plus className="w-5 h-5" />
        Gestión de Sistemas
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Gestión de Sistemas</h3>
                <p className="text-base text-gray-600 mt-1">Administra los sistemas disponibles</p>
              </div>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                disabled={loading}
              >
                <X size={28} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Mensajes de éxito y error */}
              {mensajeExito && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium text-base">{mensajeExito}</p>
                  </div>
                </div>
              )}

              {mensajeError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <p className="text-red-800 font-medium text-base">{mensajeError}</p>
                  </div>
                </div>
              )}

              {/* Formulario para agregar sistema */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Agregar Nuevo Sistema</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Nombre del sistema *
                      </label>
                      <input
                        type="text"
                        value={nuevoSistema}
                        onChange={(e) => setNuevoSistema(e.target.value)}
                        placeholder="Ingresa el nombre del sistema..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent text-base"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Descripción *
                      </label>
                      <input
                        type="text"
                        value={nuevaDescripcion}
                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                        placeholder="Descripción del sistema..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent text-base"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading || !nuevoSistema.trim() || !nuevaDescripcion.trim()}
                      className="px-8 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium text-base"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Agregando...
                        </div>
                      ) : (
                        "Agregar Sistema"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Lista de sistemas existentes */}
              <div className="space-y-8">
                {/* Sistemas Activos */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">
                      Sistemas Activos
                    </h4>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">
                      {sistemasActivos.length} sistemas
                    </span>
                  </div>

                  {cargandoSistemas ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : sistemasActivos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sistemasActivos.map((sistema) => (
                        <SistemaCard 
                          key={sistema.id} 
                          sistema={sistema} 
                          esActivo={true}
                          editandoDescripcion={editandoDescripcion}
                          descripcionesEditadas={descripcionesEditadas}
                          guardandoDescripcion={guardandoDescripcion}
                          cambiandoEstado={cambiandoEstado}
                          onIniciarEdicion={iniciarEdicionDescripcion}
                          onCancelarEdicion={cancelarEdicionDescripcion}
                          onActualizarDescripcion={actualizarDescripcionEditada}
                          onGuardarDescripcion={guardarDescripcion}
                          onCambiarEstado={cambiarEstadoSistema}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg text-base">
                      No hay sistemas activos
                    </div>
                  )}
                </div>

                {/* Sistemas Inactivos */}
                {sistemasInactivos.length > 0 && (
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-semibold text-gray-900">
                        Sistemas Inactivos
                      </h4>
                      <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-base font-medium">
                        {sistemasInactivos.length} sistemas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sistemasInactivos.map((sistema) => (
                        <SistemaCard 
                          key={sistema.id} 
                          sistema={sistema} 
                          esActivo={false}
                          editandoDescripcion={editandoDescripcion}
                          descripcionesEditadas={descripcionesEditadas}
                          guardandoDescripcion={guardandoDescripcion}
                          cambiandoEstado={cambiandoEstado}
                          onIniciarEdicion={iniciarEdicionDescripcion}
                          onCancelarEdicion={cancelarEdicionDescripcion}
                          onActualizarDescripcion={actualizarDescripcionEditada}
                          onGuardarDescripcion={guardarDescripcion}
                          onCambiarEstado={cambiarEstadoSistema}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={cerrarModal}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium text-base"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}