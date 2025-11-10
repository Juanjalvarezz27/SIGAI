"use client"

import { User, Mail, IdCard, MapPin, Briefcase, Building, Monitor, Cpu, HardDrive, Edit, X, Calendar, UserX, FileText } from "lucide-react"
import { Usuario, Equipo } from "../../../types/personal"
import { useState, useEffect } from "react"
import UsuarioActivoForm from "@/components/agregarPersonal/UsuarioActivoForm"
import axios from "axios"

interface VistaDetalleUsuarioSupervisorProps {
  usuario: Usuario
  onVolver: () => void
  loading?: boolean
}

interface HistorialDeshabilitacion {
  motivo: string
  fechaDeshabilitacion: string
  deshabilitadoPor: {
    nombre: string
    apellido: string | null
  }
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Función helper para los equipos duplicados
const eliminarEquiposDuplicados = (equipos: Equipo[]): Equipo[] => {
  const crearClaveUnica = (equipo: Equipo) => {
    return `${equipo.modelo.nombre}-${equipo.modelo.marca.nombre}-${equipo.bienNacional || 'sin-bien'}-${equipo.serial || 'sin-serial'}`
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

export default function VistaDetalleUsuarioSupervisor({
  usuario,
  onVolver,
  loading = false
}: VistaDetalleUsuarioSupervisorProps) {
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")
  const [mensajeError, setMensajeError] = useState("")
  const [loadingEditar, setLoadingEditar] = useState(false)
  const [historialDeshabilitacion, setHistorialDeshabilitacion] = useState<HistorialDeshabilitacion | null>(null)
  const [cargandoHistorial, setCargandoHistorial] = useState(false)

  // Cargar información de deshabilitación cuando el usuario esté deshabilitado
  useEffect(() => {
    const cargarHistorialDeshabilitacion = async () => {
      if (usuario.estado === 'Deshabilitado') {
        try {
          setCargandoHistorial(true)
          const response = await axios.get(`/api/usuario/deshabilitacion-detalle?usuarioId=${usuario.id}`)
          if (response.status === 200 && response.data.historialDeshabilitacion) {
            setHistorialDeshabilitacion(response.data.historialDeshabilitacion)
          }
        } catch (error) {
          console.error('Error cargando historial de deshabilitación:', error)
        } finally {
          setCargandoHistorial(false)
        }
      } else {
        // Limpiar historial si el usuario está activo
        setHistorialDeshabilitacion(null)
      }
    }

    cargarHistorialDeshabilitacion()
  }, [usuario.id, usuario.estado])

  const abrirModalEditar = () => {
    setModalEditarAbierto(true)
    setMensajeExito("")
    setMensajeError("")
    document.body.style.overflow = "hidden"
  }

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false)
    setMensajeExito("")
    setMensajeError("")
    document.body.style.overflow = "auto"
  }

  const manejarExito = (mensaje: string) => {
    setMensajeExito(mensaje)
    setMensajeError("")
  }

  const manejarError = (mensaje: string) => {
    setMensajeError(mensaje)
    setMensajeExito("")
  }

  // Función para formatear fecha
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {usuario.nombre} {usuario.apellido}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">{capitalizeFirstLetter(usuario.rol.rol)}</p>
              {usuario.estado === 'Deshabilitado' && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  Deshabilitado
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Botón de editar */}
            <button
              onClick={abrirModalEditar}
              disabled={loading}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#001F3F]/[0.9] hover:bg-[#001F3F] text-white rounded-md transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit size={16} />
              Editar
            </button>

            <button
              onClick={onVolver}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transform transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Volver a la lista
            </button>
          </div>
        </div>
        
        {/* Información Personal y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Información Personal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Personal</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IdCard size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Cédula</p>
                  <p className="font-medium">{usuario.cedula || 'No registrada'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{usuario.email || 'No registrado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className={`font-medium ${
                    usuario.estado === 'Activo' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {usuario.estado}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-[#A0C4FF]/[0.3] border border-[#A0C4FF]/[0.9] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#001f3f] mb-4">Ubicación</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building size={20} className="text-[#001f3f]" />
                <div>
                  <p className="font-medium">{usuario.direccion.piso.piso}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#001f3f]" />
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium">{usuario.direccion.direccion}</p>
                </div>
              </div>
              {usuario.area && (
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-[#001f3f]" />
                  <div>
                    <p className="text-sm text-gray-600">Área</p>
                    <p className="font-medium">{usuario.area.nombre}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Información de Deshabilitación - Solo mostrar si el usuario está deshabilitado */}
        {usuario.estado === 'Deshabilitado' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <UserX size={20} />
              Información de Deshabilitación
            </h3>
            
            {cargandoHistorial ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : historialDeshabilitacion ? (
              <div className="space-y-4">
                {/* Motivo de deshabilitación */}
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Motivo</p>
                    <p className="text-gray-900 bg-white border border-gray-300 rounded-md p-3">
                      {historialDeshabilitacion.motivo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de deshabilitación */}
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de Deshabilitación</p>
                      <p className="text-gray-900">
                        {formatearFecha(historialDeshabilitacion.fechaDeshabilitacion)}
                      </p>
                    </div>
                  </div>

                  {/* Deshabilitado por */}
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Deshabilitado por</p>
                      <p className="text-gray-900">
                        {historialDeshabilitacion.deshabilitadoPor.nombre}
                        {historialDeshabilitacion.deshabilitadoPor.apellido ? ` ${historialDeshabilitacion.deshabilitadoPor.apellido}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">No se encontró información de deshabilitación</p>
              </div>
            )}
          </div>
        )}

        {/* Equipos asignados */}
        <div className="bg-[#F29F6D]/[0.4] border border-[#F29F6D] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Equipos Asignados</h3>
          {usuario.equipos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {eliminarEquiposDuplicados(usuario.equipos).map((equipo) => (
                <div key={equipo.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Monitor size={24} className="text-[#F29F6D]" />
                    <div>
                      <h4 className="font-semibold">{equipo.tipoEquipo.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {equipo.modelo.marca.nombre} {equipo.modelo.nombre}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {equipo.bienNacional && (
                      <p><span className="font-medium">Bien Nacional:</span> {equipo.bienNacional}</p>
                    )}
                    {equipo.serial && (
                      <p><span className="font-medium">Serial:</span> {equipo.serial}</p>
                    )}
                    {equipo.status && (
                      <p><span className="font-medium">Status:</span> {equipo.status.estado}</p>
                    )}
                    {equipo.estado && (
                      <p><span className="font-medium">Estado:</span> {equipo.estado.nombre}</p>
                    )}

                    {equipo.especificaciones && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="font-medium mb-1">Especificaciones:</p>
                        <div className="space-y-1">
                          {equipo.especificaciones.procesador && (
                            <div className="flex items-center gap-2">
                              <Cpu size={14} className="text-gray-400" />
                              <span>{equipo.especificaciones.procesador}</span>
                            </div>
                          )}
                          {equipo.especificaciones.memoriaRam && (
                            <div className="flex items-center gap-2">
                              <Monitor size={14} className="text-gray-400" />
                              <span>RAM: {equipo.especificaciones.memoriaRam}</span>
                            </div>
                          )}
                          {equipo.especificaciones.capacidadDisco && (
                            <div className="flex items-center gap-2">
                              <HardDrive size={14} className="text-gray-400" />
                              <span>Disco: {equipo.especificaciones.capacidadDisco} ({equipo.especificaciones.tipoDisco})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tiene equipos asignados</p>
          )}
        </div>
      </div>

      {/* Modal para editar usuario */}
      {modalEditarAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/[0.5] transition-opacity"
            onClick={cerrarModalEditar}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-8/12 mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Usuario - {usuario.nombre} {usuario.apellido}
              </h3>
              <button
                onClick={cerrarModalEditar}
                className="text-gray-400 hover:text-red-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mensajes de estado */}
            {(mensajeExito || mensajeError) && (
              <div className="px-6 pt-4 flex-shrink-0">
                {mensajeExito && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                    {mensajeExito}
                  </div>
                )}
                {mensajeError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    {mensajeError}
                  </div>
                )}
              </div>
            )}

            {/* Contenido del formulario con scroll interno */}
            <div className="flex-1 overflow-y-auto">
              <UsuarioActivoForm
                loading={loadingEditar}
                onLoadingChange={setLoadingEditar}
                onSuccess={manejarExito}
                onError={manejarError}
                onClose={cerrarModalEditar}
                usuarioPrecargado={usuario}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}