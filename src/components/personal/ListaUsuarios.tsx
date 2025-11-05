"use client"

import { User } from "lucide-react"
import TarjetaUsuario from "./TarjetaUsuario"
import { Usuario } from "../../../types/personal"

interface ListaUsuariosProps {
  usuarios: Usuario[]
  onUsuarioSeleccionado: (usuario: Usuario) => void
  loading?: boolean
  error?: string
  rolFiltro: string
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

export default function ListaUsuarios({
  usuarios,
  onUsuarioSeleccionado,
  loading = false,
  error = '',
  rolFiltro
}: ListaUsuariosProps) {
  // Si hay error, no mostrar nada 
  if (error) return null

  // Si está cargando, mostrar loader
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Si no hay usuarios, mostrar mensaje
  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
        <p className="text-gray-500">
          {rolFiltro === 'deshabilitados'
            ? 'No se encontraron usuarios deshabilitados en el sistema.'
            : `No se encontraron usuarios ${rolFiltro !== 'todos' ? `con rol ${getNombreFiltro(rolFiltro).toLowerCase()}` : ''} en el sistema.`
          }
        </p>
      </div>
    )
  }

  // Mostrar lista de usuarios
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {usuarios.map((usuario, index) => (
        <div
          key={usuario.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TarjetaUsuario
            usuario={usuario}
            onSeleccionar={onUsuarioSeleccionado}
          />
        </div>
      ))}
    </div>
  )
}