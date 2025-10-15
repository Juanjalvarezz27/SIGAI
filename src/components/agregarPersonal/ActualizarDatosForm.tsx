"use client"

import { useState, useRef } from "react"
import { User } from "lucide-react"
import axios, { AxiosError } from "axios"
import BarraBusqueda from "../BarraBusqueda"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  cedula: string | null
  email: string | null
  rol: {
    id: number
    rol: string
  }
  direccion: {
    direccion: string
  }
}

interface FormData {
  cedula: string
  email: string
}

interface ApiErrorResponse {
  error?: string
}

interface ActualizarDatosFormProps {
  loading: boolean
  onLoadingChange: (loading: boolean) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onClose: () => void
}

export default function ActualizarDatosForm({
  loading,
  onLoadingChange,
  onSuccess,
  onError,
  onClose
}: ActualizarDatosFormProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    email: ''
  })

  const formRef = useRef<HTMLDivElement>(null)

  // Función para hacer scroll al inicio del formulario
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetForm = () => {
    setUsuarioSeleccionado(null)
    setFormData({
      cedula: '',
      email: ''
    })
  }

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setFormData({
      cedula: '', // Siempre vacío si ya tiene cédula
      email: usuario.email || ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Si el usuario ya tiene cédula, no permitir cambiar el campo cédula
    if (name === 'cedula' && usuarioSeleccionado?.cedula) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usuarioSeleccionado) {
      onError('Debes seleccionar un usuario primero')
      scrollToTop()
      return
    }

    // Si el usuario ya tiene cédula, solo validar el email
    if (usuarioSeleccionado.cedula) {
      // Validar que se ingrese un email
      if (!formData.email) {
        onError('Debes ingresar un email para actualizar')
        scrollToTop()
        return
      }

      // Validar que el email tenga formato válido
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        onError('El formato del email no es válido')
        scrollToTop()
        return
      }
    } else {
      // Si no tiene cédula, validar que al menos un campo tenga datos
      if (!formData.cedula && !formData.email) {
        onError('Debes ingresar al menos la cédula o el email')
        scrollToTop()
        return
      }

      // Validar que si se ingresa email, tenga formato válido
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        onError('El formato del email no es válido')
        scrollToTop()
        return
      }
    }

    onLoadingChange(true)
    onError('')

    try {
      const response = await axios.put('/api/admin/actualizar-datos', {
        usuarioId: usuarioSeleccionado.id,
        cedula: usuarioSeleccionado.cedula ? null : (formData.cedula || null), // Solo enviar cédula si no tenía
        email: formData.email || null
      })

      if (response.status === 200) {
        onSuccess('Datos del usuario actualizados correctamente')
        scrollToTop()
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      onError(axiosError.response?.data?.error || 'Error al actualizar los datos del usuario')
      scrollToTop()
    } finally {
      onLoadingChange(false)
    }
  }

  // Determinar si el formulario es válido
  const isFormValid = usuarioSeleccionado && 
    (usuarioSeleccionado.cedula 
      ? formData.email && /\S+@\S+\.\S+/.test(formData.email) // Si tiene cédula, solo validar email
      : (formData.cedula || formData.email) && (formData.email ? /\S+@\S+\.\S+/.test(formData.email) : true) // Si no tiene cédula, validar como antes
    )

  return (
    <div ref={formRef} className="overflow-y-auto flex-1">
      <form onSubmit={handleSubmit} className="space-y-6 w-11/12 mx-auto">
        {/* Buscador de usuarios */}
        {!usuarioSeleccionado && (
          <BarraBusqueda
            onUsuarioSeleccionado={handleSeleccionarUsuario}
            loading={loading}
            placeholder="Escribe al menos 3 caracteres para buscar..."
            label="Buscar Usuario a Actualizar"
          />
        )}

        {/* Información del usuario seleccionado */}
        {usuarioSeleccionado && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
                </h3>
                <p className="text-sm text-blue-700">
                  Actual: {usuarioSeleccionado.rol.rol} • {usuarioSeleccionado.direccion.direccion}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsuarioSeleccionado(null)
                resetForm()
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              Cambiar usuario
            </button>
          </div>
        )}

        {/* Formulario de actualización de datos */}
        {usuarioSeleccionado && (
          <div className="space-y-4 w-11/12 mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Actualizar Datos del Usuario
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Campo Cédula Actual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula Actual
                  </label>
                  <div className="p-2 bg-gray-100 rounded-md border border-gray-300">
                    <p className="text-gray-700">
                      {usuarioSeleccionado.cedula || 'No tiene cédula registrada'}
                    </p>
                    {usuarioSeleccionado.cedula && (
                      <p className="text-xs text-orange-600 mt-1">
                        La cédula no se puede modificar una vez registrada
                      </p>
                    )}
                  </div>
                </div>

                {/* Campo Email Actual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Actual
                  </label>
                  <div className="p-2 bg-gray-100 rounded-md border border-gray-300">
                    <p className="text-gray-700">
                      {usuarioSeleccionado.email || 'No tiene email registrado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#A0C4FF]/[0.5] border border-[#A0C4FF] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Nuevos Datos
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Campo Nueva Cédula */}
                <div>
                  <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Cédula
                  </label>
                  <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent ${
                      usuarioSeleccionado.cedula 
                        ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed' 
                        : 'border-gray-600'
                    }`}
                    placeholder={
                      usuarioSeleccionado.cedula 
                        ? "La cédula no se puede modificar" 
                        : "Ingresa la nueva cédula"
                    }
                    disabled={loading || !!usuarioSeleccionado.cedula}
                    readOnly={!!usuarioSeleccionado.cedula}
                  />
                  {usuarioSeleccionado.cedula && (
                    <p className="text-xs text-gray-500 mt-1">
                      Solo se puede actualizar el email
                    </p>
                  )}
                </div>

                {/* Campo Nuevo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    placeholder={usuarioSeleccionado.email ? "Dejar vacío para mantener actual" : "Ingresa el nuevo email"}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Nota informativa */}
              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> {usuarioSeleccionado.cedula 
                    ? 'Solo puedes actualizar el email. La cédula no se puede modificar una vez registrada.' 
                    : 'Puedes actualizar solo la cédula, solo el email, o ambos campos. Los campos que dejes vacíos mantendrán su valor actual.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="bg-[#001F3F] cursor-pointer transition-all duration-200 hover:bg-[#003366] text-white px-6 py-2 rounded-md font-medium duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </div>
      </form>
    </div>
  )
}