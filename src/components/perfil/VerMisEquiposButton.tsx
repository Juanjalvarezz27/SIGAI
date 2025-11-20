"use client"

import { useState } from "react"
import { Monitor, X, Package } from "lucide-react"

interface Equipo {
  id: number
  bienNacional?: string
  serial?: string
  observaciones?: string
  tipoEquipo: {
    nombre: string
  }
  modelo: {
    nombre: string
    marca: {
      nombre: string
    }
  }
  status?: {
    estado: string
  }
  estado?: {
    nombre: string
  }
  especificaciones?: {
    memoriaRam?: string
    capacidadDisco?: string
    tipoDisco?: string
    procesador?: string
  }
}

interface VerMisEquiposButtonProps {
  userId?: number
}

// Función para eliminar equipos duplicados basada en datos clave
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const equiposUnicos: Equipo[] = []
  const clavesVistas = new Set<string>()

  equipos.forEach(equipo => {
    // Crear una clave única basada en los datos del equipo
    const clave = crearClaveUnica(equipo)
    
    if (!clavesVistas.has(clave)) {
      clavesVistas.add(clave)
      equiposUnicos.push(equipo)
    }
  })

  return equiposUnicos
}

// Función para crear una clave única basada en los datos del equipo
const crearClaveUnica = (equipo: Equipo): string => {
  // Usamos los campos que identifican un equipo único
  const partes: string[] = []

  // Serial es el identificador más importante
  if (equipo.serial) {
    partes.push(`serial:${equipo.serial.trim().toLowerCase()}`)
  }

  // Bien nacional como segundo identificador
  if (equipo.bienNacional) {
    partes.push(`bien:${equipo.bienNacional.trim().toLowerCase()}`)
  }

  // Si no hay serial ni bien nacional, usamos tipo + modelo + especificaciones
  if (partes.length === 0) {
    partes.push(`tipo:${equipo.tipoEquipo.nombre.trim().toLowerCase()}`)
    partes.push(`modelo:${equipo.modelo.nombre.trim().toLowerCase()}`)
    partes.push(`marca:${equipo.modelo.marca.nombre.trim().toLowerCase()}`)
    
    // Incluir especificaciones si están disponibles
    if (equipo.especificaciones) {
      if (equipo.especificaciones.procesador) {
        partes.push(`cpu:${equipo.especificaciones.procesador.trim().toLowerCase()}`)
      }
      if (equipo.especificaciones.memoriaRam) {
        partes.push(`ram:${equipo.especificaciones.memoriaRam.trim().toLowerCase()}`)
      }
    }
  }

  return partes.join('|')
}

export default function VerMisEquiposButton({ userId }: VerMisEquiposButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const abrirModal = async () => {
    if (!userId) {
      setError("No se pudo identificar al usuario")
      return
    }

    setIsModalOpen(true)
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/equipos/usuario/${userId}`)
      if (response.ok) {
        const data = await response.json()
        const equiposSinDuplicados = eliminarEquiposDuplicados(data.equipos || [])
        
        // Log para debugging (puedes removerlo después)
        console.log('Equipos originales:', data.equipos?.length)
        console.log('Equipos sin duplicados:', equiposSinDuplicados.length)
        
        setEquipos(equiposSinDuplicados)
      } else {
        setError("Error al cargar los equipos")
      }
    } catch (error) {
      console.error("Error cargando equipos:", error)
      setError("Error al cargar los equipos")
    } finally {
      setLoading(false)
    }
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEquipos([])
    setError("")
  }

  return (
    <>
      {/* Botón Ver Mis Equipos */}
      <button
        onClick={abrirModal}
        className="flex flex-col items-center justify-center gap-1 px-6 py-6 bg-[#A0C4FF] text-[#001F3F] rounded-2xl transform transition-all duration-200 hover:scale-105 cursor-pointer font-medium w-full"
      >
        <h1 className="text-xl font-bold">Mis Equipos</h1>
        <Monitor className="w-14 h-14 mt-3" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#001F3F]" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Mis Equipos Asignados</h2>
                  <p className="text-gray-600 text-sm">
                    {equipos.length} equipo(s) asignado(s)
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  {error}
                </div>
              ) : equipos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No tienes equipos asignados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipos.map((equipo) => (
                    <div
                      key={equipo.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor className="w-5 h-5 text-[#001F3F]" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {equipo.tipoEquipo.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                          </p>
                        </div>
                      </div>

                      {/* Información básica */}
                      <div className="space-y-2 text-sm">
                        {equipo.bienNacional && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bien Nacional:</span>
                            <span className="font-medium">{equipo.bienNacional}</span>
                          </div>
                        )}
                        {equipo.serial && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Serial:</span>
                            <span className="font-medium">{equipo.serial}</span>
                          </div>
                        )}
                        {equipo.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-medium">{equipo.status.estado}</span>
                          </div>
                        )}
                      </div>

                      {/* Especificaciones */}
                      {equipo.especificaciones && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Especificaciones:</h4>
                          <div className="space-y-1 text-sm">
                            {equipo.especificaciones.procesador && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Procesador:</span>
                                <span className="font-medium">{equipo.especificaciones.procesador}</span>
                              </div>
                            )}
                            {equipo.especificaciones.memoriaRam && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">RAM:</span>
                                <span className="font-medium">{equipo.especificaciones.memoriaRam}</span>
                              </div>
                            )}
                            {equipo.especificaciones.capacidadDisco && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Disco:</span>
                                <span className="font-medium">{equipo.especificaciones.capacidadDisco}</span>
                              </div>
                            )}
                            {equipo.especificaciones.tipoDisco && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tipo Disco:</span>
                                <span className="font-medium">{equipo.especificaciones.tipoDisco}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Observaciones */}
                      {equipo.observaciones && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Observaciones:</h4>
                          <p className="text-sm text-gray-600">{equipo.observaciones}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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