"use client"

import { Edit } from "lucide-react"

interface BotonEditarEquipoProps {
  onClick: () => void
  loading?: boolean
}

export default function BotonEditarEquipo({ onClick, loading = false }: BotonEditarEquipoProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      <Edit size={16} />
      Editar Equipo
    </button>
  )
}