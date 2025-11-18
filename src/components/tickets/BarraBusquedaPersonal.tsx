"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, User, UserPlus, X } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'
import { useRouter } from 'next/navigation'
import { Usuario, BarraBusquedaProps } from '../../../types/index'
import { useUserRol } from '../../app/hooks/useUserRol'

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function BarraBusquedaPersonal({
  onUsuarioSeleccionado,
  loading = false,
  placeholder = "Escribe al menos 3 caracteres para buscar...",
  label = "Buscar Usuario",
  esSolicitante = false
}: BarraBusquedaProps & { esSolicitante?: boolean }) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState('')
  const busquedaRef = useRef<string>('')
  
  // Agregar useRouter para redirección
  const router = useRouter()

  // Usar el hook para obtener el rol del usuario
  const { userRol, loading: loadingRol } = useUserRol()

  // Función debounced para buscar usuarios
  const buscarUsuarios = useMemo(
    () => debounce(async (query: string) => {
      // Guardar la consulta actual
      busquedaRef.current = query

      if (!query.trim() || query.length < 3) {
        setUsuarios([])
        setBuscando(false)
        return
      }

      try {
        setBuscando(true)

        // Usar endpoint diferente para solicitantes
        const endpoint = esSolicitante
          ? `/api/solicitantes/buscar-usuarios?q=${encodeURIComponent(query)}`
          : `/api/admin/buscar-usuarios?q=${encodeURIComponent(query)}`

        const response = await axios.get(endpoint)

        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setUsuarios(response.data.usuarios || [])
        }
      } catch (error: unknown) {
        console.error('Error buscando usuarios:', error)
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setUsuarios([])
        }
      } finally {
        // Solo actualizar si la consulta sigue siendo la misma
        if (busquedaRef.current === query) {
          setBuscando(false)
        }
      }
    }, 500),
    [esSolicitante]
  )

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda && busqueda.length >= 3) {
      buscarUsuarios(busqueda)
    } else {
      // Limpiar inmediatamente cuando la búsqueda es muy corta o está vacía
      setUsuarios([])
      setBuscando(false)
      busquedaRef.current = '' // Resetear la referencia
    }
  }, [busqueda, buscarUsuarios])

  // Cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      buscarUsuarios.cancel()
    }
  }, [buscarUsuarios])

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    onUsuarioSeleccionado(usuario)
    setBusqueda('')
    setUsuarios([])
    setBuscando(false)
    busquedaRef.current = '' // Resetear la referencia
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)

    // Si el usuario borra todo, limpiar inmediatamente
    if (value === '') {
      setUsuarios([])
      setBuscando(false)
      buscarUsuarios.cancel() // Cancelar cualquier búsqueda pendiente
      busquedaRef.current = '' // Resetear la referencia
    }
  }

  // NUEVA FUNCIÓN: Redirigir a /home/personal con parámetro para abrir modal
  const redirigirAAgregarUsuario = () => {
    router.push('/home/personal?agregarUsuario=true')
  }

  const handleUsuarioCreado = (message: string) => {
    setSuccessMessage(message)
    setBusqueda('') // Limpiar búsqueda actual
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  // Determinar si el usuario actual es admin
  const esAdmin = userRol?.rolId === 1

  // Determinar qué mostrar
  const mostrarResultados = busqueda && busqueda.length >= 3 && !buscando && usuarios.length > 0
  const mostrarNoResultados = busqueda && busqueda.length >= 3 && !buscando && usuarios.length === 0
  const mostrarMensajeMinimo = busqueda && busqueda.length < 3

  // Mensaje especial para solicitantes
  const mensajeSolicitante = esSolicitante && (
    <p className="text-xs text-blue-600 mt-1">
      Solo se mostrarán usuarios de tu misma dirección
    </p>
  )

  return (
    <div>
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={handleInputChange}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
          placeholder={placeholder}
          disabled={loading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {mensajeSolicitante}

      {/* Mensaje de mínimo caracteres - SOLO cuando hay texto pero menos de 3 caracteres */}
      {mostrarMensajeMinimo && (
        <p className="mt-2 text-sm text-gray-500">
          Escribe al menos 3 caracteres para buscar
        </p>
      )}

      {/* Loader de búsqueda - SOLO se muestra cuando está buscando activamente */}
      {buscando && (
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Lista de resultados - SOLO se muestra cuando hay resultados y no está buscando */}
      {mostrarResultados && (
        <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
          {usuarios.map(usuario => (
            <div
              key={usuario.id}
              onClick={() => handleSeleccionarUsuario(usuario)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#A0C4FF] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#001F3F]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {capitalizeFirstLetter(usuario.rol.rol)} • {usuario.direccion.direccion}
                        {usuario.area && ` • ${usuario.area.nombre}`}
                      </p>
                    </div>
                    {usuario.estado === 'Deshabilitado' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        Deshabilitado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de no resultados - SOLO se muestra cuando hay búsqueda válida pero no hay resultados */}
      {mostrarNoResultados && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">
            {esSolicitante
              ? "No se encontraron usuarios en tu dirección"
              : "Usuario no encontrado"
            }
          </p>
          <p className="text-gray-500 text-sm mb-4">
            No se encontraron usuarios que coincidan con {busqueda}
          </p>

          {/* Mostrar botón solo si es admin y NO es solicitante */}
          {esAdmin && !esSolicitante ? (
            <button
              onClick={redirigirAAgregarUsuario} // CAMBIADO: Ahora redirige
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer mx-auto"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Nuevo Usuario
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              {esSolicitante
                ? "Contacte al administrador para agregar usuarios a su dirección"
                : "Contacte al administrador para agregar un nuevo usuario"
              }
            </p>
          )}
        </div>
      )}
    </div>
  )
}