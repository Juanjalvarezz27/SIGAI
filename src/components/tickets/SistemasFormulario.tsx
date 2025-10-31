"use client"

import { useState, useEffect, useRef } from "react"
import { Monitor, AlertTriangle, User, Check, ChevronDown, X } from "lucide-react"
import BarraBusquedaPersonal from "./BarraBusquedaPersonal"
import SelectModal from "../../components/agregarPersonal/SelectModal"
import { UsuarioBasico } from "../../../types/ticket"
import { Usuario } from "../../../types/index"

interface Sistema {
  id: number
  nombre: string
  estado: string
}

interface Falla {
  id: number
  nombre: string
}

interface SistemasFormularioProps {
  formData: {
    usuarioAfectadoId?: string
    sistemaId?: string
    fallaId?: string
  }
  onFormDataChange: (data: {
    usuarioAfectadoId?: string
    sistemaId?: string
    fallaId?: string
  }) => void
  isSubmitting: boolean
  esSolicitante?: boolean
}

// Modal personalizado para sistemas con 2 columnas
function SistemasModal({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  disabled,
  loading = false
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  options: Array<{ id: number; nombre: string }>
  selectedValue: number
  onSelect: (value: number) => void
  disabled?: boolean
  loading?: boolean
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-[60] p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de opciones en 2 columnas */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelect(option.id)
                    onClose()
                  }}
                  disabled={disabled}
                  className={`w-full text-left p-3 rounded-md transition-colors flex items-center justify-between ${
                    selectedValue === option.id
                      ? 'bg-[#001F3F] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="flex-1 text-sm">{option.nombre}</span>
                  {selectedValue === option.id && (
                    <Check size={16} className="ml-2 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SistemasFormulario({
  formData,
  onFormDataChange,
  isSubmitting,
  esSolicitante = false
}: SistemasFormularioProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioBasico | null>(null)
  const [sistemas, setSistemas] = useState<Sistema[]>([])
  const [fallas, setFallas] = useState<Falla[]>([])
  const [cargandoSistemas, setCargandoSistemas] = useState(false)
  const [cargandoFallas, setCargandoFallas] = useState(false)
  const [sistemaSeleccionado, setSistemaSeleccionado] = useState<Sistema | null>(null)
  const [fallaSeleccionada, setFallaSeleccionada] = useState<Falla | null>(null)
  const [modalAbierto, setModalAbierto] = useState<'sistema' | 'falla' | null>(null)

  // Función para convertir Usuario a UsuarioBasico
  const convertirUsuarioABasico = (usuario: Usuario): UsuarioBasico => {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      email: usuario.email,
      direccion: usuario.direccion ? {
        id: 0, // Valor temporal ya que no está disponible en el tipo Usuario
        direccion: usuario.direccion.direccion,
        piso: {
          id: 0, // Valor temporal
          piso: usuario.direccion.piso.piso
        }
      } : undefined,
      area: usuario.area
    };
  };

  // Cargar sistemas al montar el componente
  useEffect(() => {
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

    cargarSistemas()
  }, [])

  // Cargar fallas
  useEffect(() => {
    const cargarFallas = async () => {
      setCargandoFallas(true)
      try {
        const response = await fetch('/api/fallas')
        if (response.ok) {
          const data = await response.json()
          setFallas(data)
        }
      } catch (error) {
        console.error('Error cargando fallas:', error)
      } finally {
        setCargandoFallas(false)
      }
    }

    cargarFallas()
  }, [])

  // Manejar selección de usuario
  const handleUsuarioSeleccionado = (usuario: Usuario) => {
    const usuarioBasico = convertirUsuarioABasico(usuario);
    setUsuarioSeleccionado(usuarioBasico)
    onFormDataChange({
      ...formData,
      usuarioAfectadoId: usuario.id.toString()
    })
  }

  // Manejar selección de sistema desde el modal
  const handleSelectSistema = (sistemaId: number) => {
    const sistema = sistemas.find(s => s.id === sistemaId) || null
    setSistemaSeleccionado(sistema)
    setFallaSeleccionada(null)

    onFormDataChange({
      ...formData,
      sistemaId: sistemaId.toString(),
      fallaId: undefined // Reset falla cuando cambia el sistema
    })
  }

  // Manejar selección de falla desde el modal
  const handleSelectFalla = (fallaId: number) => {
    const falla = fallas.find(f => f.id === fallaId) || null
    setFallaSeleccionada(falla)
    onFormDataChange({
      ...formData,
      fallaId: fallaId.toString()
    })
  }

  // Obtener nombre del sistema seleccionado
  const getNombreSistema = (): string => {
    if (!formData.sistemaId) return "Seleccionar sistema"
    const sistema = sistemas.find(s => s.id === parseInt(formData.sistemaId!))
    return sistema?.nombre || "Seleccionar sistema"
  }

  // Obtener nombre de la falla seleccionada
  const getNombreFalla = (): string => {
    if (!formData.fallaId) return "Seleccionar tipo de falla"
    const falla = fallas.find(f => f.id === parseInt(formData.fallaId!))
    return falla?.nombre || "Seleccionar tipo de falla"
  }

  return (
    <div className="space-y-6">
      {/* Mensaje informativo para solicitante */}
      {esSolicitante && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Restricción:</strong> Solo puedes seleccionar usuarios de tu misma dirección.
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
                <div>
                  <p className="text-sm text-gray-600">Piso</p>
                  <p className="font-medium">{usuarioSeleccionado.direccion.piso.piso}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium">{usuarioSeleccionado.direccion.direccion}</p>
                </div>
              </>
            )}

            {usuarioSeleccionado.area && (
              <div>
                <p className="text-sm text-gray-600">Área</p>
                <p className="font-medium">{usuarioSeleccionado.area.nombre}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selector de Sistema con Modal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sistema Afectado *
        </label>
        <button
          type="button"
          onClick={() => setModalAbierto('sistema')}
          disabled={isSubmitting || !usuarioSeleccionado || cargandoSistemas}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:opacity-50 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Monitor className="text-gray-400" size={20} />
            <span className={formData.sistemaId ? "text-gray-900" : "text-gray-500"}>
              {getNombreSistema()}
            </span>
          </div>
          <ChevronDown className="text-gray-400" size={16} />
        </button>
        {cargandoSistemas && (
          <p className="mt-1 text-sm text-gray-500">Cargando sistemas...</p>
        )}
      </div>

      {/* Selector de Falla con Modal */}
      {formData.sistemaId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Falla *
          </label>
          <button
            type="button"
            onClick={() => setModalAbierto('falla')}
            disabled={isSubmitting || !formData.sistemaId || cargandoFallas}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:opacity-50 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-gray-400" size={20} />
              <span className={formData.fallaId ? "text-gray-900" : "text-gray-500"}>
                {getNombreFalla()}
              </span>
            </div>
            <ChevronDown className="text-gray-400" size={16} />
          </button>
          {cargandoFallas && (
            <p className="mt-1 text-sm text-gray-500">Cargando fallas...</p>
          )}
        </div>
      )}

      {/* Resumen de selección */}
      {(sistemaSeleccionado || fallaSeleccionada) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Resumen de Selección
          </h4>
          <div className="space-y-2">
            {sistemaSeleccionado && (
              <p className="text-sm text-green-800">
                <strong>Sistema:</strong> {sistemaSeleccionado.nombre}
              </p>
            )}
            {fallaSeleccionada && (
              <p className="text-sm text-green-800">
                <strong>Falla:</strong> {fallaSeleccionada.nombre}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal para Sistemas (2 columnas) */}
      <SistemasModal
        isOpen={modalAbierto === 'sistema'}
        onClose={() => setModalAbierto(null)}
        title="Seleccionar Sistema"
        options={sistemas.map(s => ({ id: s.id, nombre: s.nombre }))}
        selectedValue={formData.sistemaId ? parseInt(formData.sistemaId) : 0}
        onSelect={handleSelectSistema}
        disabled={isSubmitting}
        loading={cargandoSistemas}
      />

      {/* Modal para Fallas (usa el SelectModal original) */}
      <SelectModal
        isOpen={modalAbierto === 'falla'}
        onClose={() => setModalAbierto(null)}
        title="Seleccionar Tipo de Falla"
        options={fallas.map(f => ({ id: f.id, nombre: f.nombre }))}
        selectedValue={formData.fallaId ? parseInt(formData.fallaId) : 0}
        onSelect={handleSelectFalla}
        disabled={isSubmitting}
        loading={cargandoFallas}
      />
    </div>
  )
}