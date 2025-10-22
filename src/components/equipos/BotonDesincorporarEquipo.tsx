"use client"

import { UserX } from "lucide-react"

interface BotonDesincorporarEquipoProps {
  onClick: () => void
  loading?: boolean
}

export default function BotonDesincorporarEquipo({ onClick, loading = false }: BotonDesincorporarEquipoProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      <UserX size={16} />
      Desincorporar Equipo
    </button>
  )
}