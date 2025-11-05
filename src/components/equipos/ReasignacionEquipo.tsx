"use client"

import { useState, useEffect } from "react"
import { User, Building, MapPin, Briefcase, CheckCircle, FileText } from "lucide-react"
import axios from "axios"
import BarraBusquedaPersonalizado from "../personal/BarraBusquedaPersonalizado"
import { Usuario } from "../../../types/personal"

interface ReasignacionEquipoProps {
  equipoId: number
  usuarioActual?: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
  onReasignacionExitosa: () => void
  disabled?: boolean
}

export default function ReasignacionEquipo({
  equipoId,
  usuarioActual,
  onReasignacionExitosa,
  disabled = false
}: ReasignacionEquipoProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [motivo, setMotivo] = useState("")
  const [loading, setLoading] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [error, setError] = useState("")

  const handleUsuarioSeleccionado = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setError("")
  }

  const handleReasignar = async () => {
    if (!usuarioSeleccionado) {
      setError("Debe seleccionar un usuario")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await axios.put(`/api/equipos/${equipoId}/reasignar`, {
        usuarioId: usuarioSeleccionado.id,
        motivo: motivo.trim() || null
      })

      if (response.status === 200) {
        setMensajeExito(`Equipo reasignado exitosamente a ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}`)
        setMotivo("")
        
        // Notificar al componente padre después de 3 segundos
        setTimeout(() => {
          onReasignacionExitosa()
        }, 3000)
      }
    } catch (error: unknown) {
      console.error("Error reasignando equipo:", error)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Error al reasignar el equipo")
      } else {
        setError("Error al reasignar el equipo")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLimpiarSeleccion = () => {
    setUsuarioSeleccionado(null)
    setMotivo("")
    setError("")
  }

  // Efecto para limpiar mensaje de éxito
  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        setMensajeExito("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensajeExito])

  return (
    <div className="bg-[#A0C4FF]/[0.3] border border-[#A0C4FF] rounded-lg p-4">
      <h4 className="font-semibold text-[#001F3F] mb-3 flex items-center gap-2">
        <User size={18} />
        Reasignación de Equipo
      </h4>

      {/* Usuario Actual */}
      {usuarioActual && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-medium text-blue-800 mb-1">Usuario Actual:</p>
          <p className="text-blue-700">
            {usuarioActual.nombre} {usuarioActual.apellido}
          </p>
          <p className="text-xs text-blue-600">{usuarioActual.email}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm font-medium">{mensajeExito}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Selección de Usuario */}
      {!usuarioSeleccionado ? (
        <div className="space-y-3">
          <BarraBusquedaPersonalizado
            onUsuarioSeleccionado={handleUsuarioSeleccionado}
            loading={disabled || loading}
            placeholder="Buscar usuario por nombre o cédula..."
            label="Buscar Usuario para Reasignar"
            rolFiltro="todos"
          />
        </div>
      ) : (
        /* Usuario Seleccionado y Formulario de Reasignación */
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-green-800 mb-1">
                  Usuario seleccionado:
                </p>
                <p className="text-green-700">
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                </p>
                <p className="text-sm text-green-600">{usuarioSeleccionado.email}</p>
                <p className="text-xs text-green-500">Cédula: {usuarioSeleccionado.cedula}</p>
                <p className="text-xs text-green-500 capitalize">
                  Rol: {usuarioSeleccionado.rol.rol.toLowerCase()}
                </p>

                {/* Información de ubicación */}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1 text-green-600">
                    <MapPin size={12} />
                    <span>{usuarioSeleccionado.direccion.direccion}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Building size={12} />
                    <span>Piso {usuarioSeleccionado.direccion.piso.piso}</span>
                  </div>
                  {usuarioSeleccionado.area && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Briefcase size={12} />
                      <span>{usuarioSeleccionado.area.nombre}</span>
                    </div>
                  )}
                </div>

                {/* Estado del usuario */}
                {usuarioSeleccionado.estado === 'Deshabilitado' && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      Usuario Deshabilitado
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleLimpiarSeleccion}
                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                disabled={disabled || loading}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Campo de motivo */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText size={16} />
              Motivo de reasignación (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo de la reasignación..."
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={disabled || loading}
            />
          </div>

          {/* Botón de reasignación */}
          <button
            type="button"
            onClick={handleReasignar}
            disabled={disabled || loading || usuarioSeleccionado.estado === 'Deshabilitado'}
            className="w-full px-4 py-2 cursor-pointer bg-[#001F3F] text-white hover:bg-[#003366] rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Reasignando...
              </>
            ) : usuarioSeleccionado.estado === 'Deshabilitado' ? (
              'Usuario Deshabilitado - No se puede reasignar'
            ) : (
              'Confirmar Reasignación'
            )}
          </button>

          {/* Advertencia para usuarios deshabilitados */}
          {usuarioSeleccionado.estado === 'Deshabilitado' && (
            <p className="text-xs text-red-600 text-center">
              No se puede reasignar equipos a usuarios deshabilitados
            </p>
          )}
        </div>
      )}

      {!usuarioSeleccionado && (
        <p className="text-xs text-gray-500 mt-2">
          Busque y seleccione un usuario para reasignar el equipo
        </p>
      )}
    </div>
  )
}