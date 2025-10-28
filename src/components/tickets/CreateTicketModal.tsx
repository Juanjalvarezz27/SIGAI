"use client"

import { useState, useEffect, useRef } from "react"
import { X, CheckCircle } from "lucide-react"
import FormularioSoporteRedes from "./FormularioSoporteRedes"
import { TicketFormData } from "../../../types/ticket"

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: () => void
}

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    titulo: '',
    descripcion: '',
    tipoTicketId: '',
    usuarioAfectadoId: undefined,
    equiposSeleccionados: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errores, setErrores] = useState<string[]>([])
  const [mensajeExito, setMensajeExito] = useState<string>("")
  const modalRef = useRef<HTMLDivElement>(null)
  const mensajeExitoRef = useRef<HTMLDivElement>(null)

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

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipoTicketId: '',
      usuarioAfectadoId: undefined,
      equiposSeleccionados: []
    })
    setErrores([])
    setMensajeExito("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manejar cambios en el formulario de Soporte/Redes
  const handleFormSoporteRedesChange = (data: {
    usuarioAfectadoId?: string
    equiposSeleccionados?: number[]
  }) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const validarFormulario = (): string[] => {
    const nuevosErrores: string[] = []

    if (!formData.titulo.trim()) {
      nuevosErrores.push("El título es requerido")
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.push("La descripción es requerida")
    }

    if (!formData.tipoTicketId) {
      nuevosErrores.push("El tipo de ticket es requerido")
    }

    // Validaciones específicas para Soporte y Redes
    if (formData.tipoTicketId === "1" || formData.tipoTicketId === "2") {
      if (!formData.usuarioAfectadoId) {
        nuevosErrores.push("Debe seleccionar un usuario afectado")
      }

      if (!formData.equiposSeleccionados || formData.equiposSeleccionados.length === 0) {
        nuevosErrores.push("Debe seleccionar al menos un equipo")
      }
    }

    return nuevosErrores
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nuevosErrores = validarFormulario()
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setIsSubmitting(true)
    setErrores([])

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMensajeExito("¡Ticket creado con éxito!")
        onTicketCreated()

        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else {
        const errorData = await response.json()
        setErrores([errorData.error || 'Error al crear el ticket'])
      }
    } catch (error) {
      console.error('Error:', error)
      setErrores(['Error al crear el ticket'])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verificar si es un tipo que requiere el formulario especial
  const requiereFormularioEspecial = formData.tipoTicketId === "1" || formData.tipoTicketId === "2"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.5]">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-hidden flex flex-col max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Crear Nuevo Ticket
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            disabled={isSubmitting}
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
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium text-lg">{mensajeExito}</p>
                  <p className="text-green-600 text-sm mt-1">
                    El modal se cerrará automáticamente...
                  </p>
                </div>
              </div>
            </div>
          )}

          {errores.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Por favor complete los siguientes campos:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica del ticket */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:opacity-50"
                  placeholder="Ingrese el título del ticket"
                />
              </div>

              <div>
                <label htmlFor="tipoTicketId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ticket *
                </label>
                <select
                  id="tipoTicketId"
                  name="tipoTicketId"
                  value={formData.tipoTicketId}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="1">Soporte</option>
                  <option value="2">Redes y Servidores</option>
                  <option value="3">Desarrollo</option>
                  <option value="4">Sigesp</option>
                </select>
              </div>
            </div>

            {/* Formulario específico para Soporte y Redes */}
            {requiereFormularioEspecial && (
              <FormularioSoporteRedes
                formData={formData}
                onFormDataChange={handleFormSoporteRedesChange}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Problema *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={6}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent disabled:opacity-50 resize-none"
                placeholder="Describa detalladamente el problema o solicitud..."
              />
            </div>
          </form>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !!mensajeExito}
            className="px-4 py-2 cursor-pointer bg-[#001F3F] text-white hover:bg-[#003366] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando...
              </>
            ) : (
              'Crear Ticket'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}