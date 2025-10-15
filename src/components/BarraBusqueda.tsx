"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, User } from "lucide-react"
import axios from "axios"
import debounce from 'lodash/debounce'

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

interface BarraBusquedaProps {
  onUsuarioSeleccionado: (usuario: Usuario) => void
  loading?: boolean
  placeholder?: string
  label?: string
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function BarraBusqueda({ 
  onUsuarioSeleccionado, 
  loading = false, 
  placeholder = "Escribe al menos 3 caracteres para buscar...",
  label = "Buscar Usuario"
}: BarraBusquedaProps) {
  const [busqueda, setBusqueda] = useState<string>('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState<boolean>(false)

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
        const response = await axios.get(`/api/admin/buscar-usuarios?q=${encodeURIComponent(query)}`)
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

  return (
    <div>
      <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
          placeholder={placeholder}
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
                <div>
                  <p className="font-medium text-gray-900">
                    {usuario.nombre} {usuario.apellido}
                  </p>
                  <p className="text-sm text-gray-500">
                    {capitalizeFirstLetter(usuario.rol.rol)} • {usuario.direccion.direccion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de no resultados - SOLO se muestra cuando NO está buscando y no hay resultados */}
      {busqueda && busqueda.length >= 3 && !buscando && usuarios.length === 0 && (
        <div className="mt-2 text-center text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </div>
  )
}