"use client"

import { useState, useEffect, useMemo } from "react"
import { User, Search, UserPlus } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'
import { Usuario } from "../../../types/personal"
import { useUserRol } from "../../app/hooks/useUserRol"

interface BarraBusquedaPersonalizadoProps {
  onUsuarioSeleccionado: (usuario: Usuario) => void
  onAgregarUsuario?: () => void // Para abrir el modal desde el padre
  loading?: boolean
  placeholder?: string
  label?: string
  rolFiltro?: string
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Función para obtener el nombre del filtro actual
function getNombreFiltro(filtro: string) {
  switch (filtro) {
    case 'todos': return 'Todos'
    case '5': return 'Personal'
    case '2': return 'Supervisor'
    case '3': return 'Solicitante'
    case '4': return 'Analista'
    case 'deshabilitados': return 'Deshabilitados'
    default: return 'Usuarios'
  }
}

export default function BarraBusquedaPersonalizado({
  onUsuarioSeleccionado,
  onAgregarUsuario, // RECIBIR LA PROP
  loading = false,
  placeholder = "Escribe al menos 3 caracteres para buscar por nombre o cédula...",
  label = "Buscar Usuario",
  rolFiltro = 'todos'
}: BarraBusquedaPersonalizadoProps) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)
  
  // Usar el hook para obtener el rol del usuario
  const { userRol, loading: loadingRol } = useUserRol()

  // Función debounced para buscar usuarios
  const buscarUsuarios = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setUsuarios([])
        setBuscando(false)
        return
      }

      try {
        setBuscando(true)
        const response = await axios.get(`/api/admin/buscar-usuarios?q=${encodeURIComponent(query)}&buscarPorCedula=true`)
        setUsuarios(response.data.usuarios || [])
      } catch (error: unknown) {
        console.error('Error buscando usuarios:', error)
        setUsuarios([])
      } finally {
        setBuscando(false)
      }
    }, 500),
    []
  )

  // Efecto para buscar cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda && busqueda.length >= 3) {
      buscarUsuarios(busqueda)
    } else {
      setUsuarios([])
    }
  }, [busqueda, buscarUsuarios])

  const handleSeleccionarUsuario = (usuario: Usuario) => {
    onUsuarioSeleccionado(usuario)
    setBusqueda('')
    setUsuarios([])
  }

  const handleAgregarUsuario = () => {
    if (onAgregarUsuario) {
      onAgregarUsuario() // LLAMAR A LA FUNCIÓN DEL PADRE
    }
  }

  // Determinar si el usuario actual es admin
  const esAdmin = userRol?.rolId === 1

  // Determinar placeholder y label basado en el rol filtro
  const placeholderFinal = placeholder.includes('${getNombreFiltro(rolFiltro).toLowerCase()}')
    ? placeholder
    : `Buscar ${getNombreFiltro(rolFiltro).toLowerCase()} por nombre o cédula...`

  const labelFinal = label.includes('${getNombreFiltro(rolFiltro)}')
    ? label
    : `Buscar ${getNombreFiltro(rolFiltro)}`

  return (
    <div>
      <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
        {labelFinal}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
          placeholder={placeholderFinal}
          disabled={loading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Mensaje de mínimo caracteres */}
      {busqueda && busqueda.length < 3 && (
        <p className="mt-2 text-sm text-gray-500">
          Escribe al menos 3 caracteres para buscar
        </p>
      )}

      {/* Loader de búsqueda - SOLO se muestra cuando está buscando */}
      {buscando && (
        <div className="mt-4 flex justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Lista de resultados - SOLO se muestra cuando NO está buscando y hay resultados */}
      {!buscando && usuarios.length > 0 && (
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
                      </p>
                      {usuario.cedula && (
                        <p className="text-xs text-gray-400">
                          Cédula: {usuario.cedula}
                        </p>
                      )}
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

      {/* Mensaje de no resultados - MOSTRAR DIFERENTES VERSIONES SEGÚN EL ROL */}
      {busqueda && busqueda.length >= 3 && !buscando && usuarios.length === 0 && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">Usuario no encontrado</p>
          <p className="text-gray-500 text-sm mb-4">
            No se encontraron usuarios que coincidan con {busqueda}
          </p>
          
          {/* Mostrar botón solo si es admin */}
          {esAdmin ? (
            <button
              onClick={handleAgregarUsuario} // USAR LA NUEVA FUNCIÓN
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer mx-auto"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Nuevo Usuario
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Contacte al administrador para agregar un nuevo usuario
            </p>
          )}
        </div>
      )}
    </div>
  )
}