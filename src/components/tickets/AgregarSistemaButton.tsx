"use client"

import { useState, useEffect } from "react"
import { Plus, X, Monitor, Check, Power, PowerOff } from "lucide-react"
import { useUserRol } from '../../app/hooks/useUserRol'

interface Sistema {
  id: number
  nombre: string
  estado: string
}

interface AgregarSistemaButtonProps {
  tipoFiltro: string
}

export default function AgregarSistemaButton({ tipoFiltro }: AgregarSistemaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sistemas, setSistemas] = useState<Sistema[]>([])
  const [nuevoSistema, setNuevoSistema] = useState("")
  const [loading, setLoading] = useState(false)
  const [cargandoSistemas, setCargandoSistemas] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null)

  const { userRol, loading: loadingRol } = useUserRol()

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
        console.log('Sistemas cargados:', data)
      } else {
        console.error('Error en la respuesta:', response.status)
      }
    } catch (error) {
      console.error('Error cargando sistemas:', error)
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
    setMensajeExito("")
  }

  const agregarSistema = async () => {
    if (!nuevoSistema.trim()) {
      alert("Por favor ingresa un nombre para el sistema")
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
          nombre: nuevoSistema.trim()
        }),
      })

      if (response.ok) {
        const sistemaCreado = await response.json()
        setMensajeExito(`Sistema "${sistemaCreado.nombre}" agregado correctamente`)
        setNuevoSistema("")
        await cargarSistemas() // Recargar la lista
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Error al agregar el sistema')
      }
    } catch (error) {
      console.error('Error agregando sistema:', error)
      alert('Error al agregar el sistema')
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoSistema = async (sistemaId: number, estadoActual: string) => {
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
        setMensajeExito(result.message)
        await cargarSistemas() // Recargar la lista
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Error al cambiar el estado del sistema')
      }
    } catch (error) {
      console.error('Error cambiando estado del sistema:', error)
      alert('Error al cambiar el estado del sistema')
    } finally {
      setCambiandoEstado(null)
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
        <Plus className="w-4 h-4" />
        Gestión de Sistemas
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-800">Gestión de Sistemas</h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Mensaje de éxito */}
              {mensajeExito && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">{mensajeExito}</p>
                  </div>
                </div>
              )}

              {/* Formulario para agregar sistema */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Sistema</h4>
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={nuevoSistema}
                    onChange={(e) => setNuevoSistema(e.target.value)}
                    placeholder="Ingresa el nombre del sistema..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !nuevoSistema.trim()}
                    className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  >
                    {loading ? "Agregando..." : "Agregar"}
                  </button>
                </form>
              </div>

              {/* Lista de sistemas existentes */}
              <div className="space-y-8">
                {/* Sistemas Activos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Sistemas Activos ({sistemasActivos.length})
                  </h4>

                  {cargandoSistemas ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sistemasActivos.map((sistema) => (
                        <div
                          key={sistema.id}
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{sistema.nombre}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                <p className="text-sm text-green-600 font-medium">
                                  Activo
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => cambiarEstadoSistema(sistema.id, sistema.estado)}
                            disabled={cambiandoEstado === sistema.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-3"
                          >
                            {cambiandoEstado === sistema.id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <PowerOff className="w-4 h-4" />
                                Desactivar
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {sistemasActivos.length === 0 && !cargandoSistemas && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                      No hay sistemas activos
                    </div>
                  )}
                </div>

                {/* Separador y Sistemas Inactivos */}
                {sistemasInactivos.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 pt-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Sistemas Inactivos ({sistemasInactivos.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sistemasInactivos.map((sistema) => (
                          <div
                            key={sistema.id}
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">{sistema.nombre}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                  <p className="text-sm text-red-600 font-medium">
                                    Inactivo
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => cambiarEstadoSistema(sistema.id, sistema.estado)}
                              disabled={cambiandoEstado === sistema.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-3"
                            >
                              {cambiandoEstado === sistema.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Power className="w-4 h-4" />
                                  Activar
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={cerrarModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
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