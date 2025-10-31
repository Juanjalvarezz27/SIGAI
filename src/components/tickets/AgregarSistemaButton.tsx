"use client"

import { useState } from "react"
import { Plus, X, Monitor, Check } from "lucide-react"
import { useUserRol } from '../.././app/hooks/useUserRol'

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

  const { userRol, loading: loadingRol } = useUserRol()

  // Determinar si el usuario tiene permisos para agregar sistemas
  const puedeAgregarSistemas = userRol ? 
    (userRol.rolId === 1 || // Admin
    (userRol.rolId === 2 && userRol.supervisorTipoId === 3)) : false // Supervisor de Sistemas

  // Ocultar el botón si no estamos en el filtro de sistemas o no tiene permisos
  if (tipoFiltro !== "sistemas" || !puedeAgregarSistemas) {
    return null
  }

  const cargarSistemas = async () => {
    setCargandoSistemas(true)
    try {
      const response = await fetch('/api/sistemas')
      if (response.ok) {
        const data = await response.json()
        setSistemas(data)
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
        setMensajeExito(`Sistema "${nuevoSistema}" agregado correctamente`)
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
        Agregar Sistema
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
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
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Sistemas Existentes ({sistemas.length})
                </h4>
                
                {cargandoSistemas ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sistemas.map((sistema) => (
                      <div
                        key={sistema.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{sistema.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {sistema.estado === 'Activo' ? 'Activo' : 'Inactivo'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sistemas.length === 0 && !cargandoSistemas && (
                  <div className="text-center py-8 text-gray-500">
                    No hay sistemas registrados
                  </div>
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