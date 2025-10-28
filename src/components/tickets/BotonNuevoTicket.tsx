"use client"

import { Plus } from "lucide-react"

interface BotonNuevoTicketProps {
  onClick: () => void
  loading?: boolean
}

export default function BotonNuevoTicket({ onClick, loading = false }: BotonNuevoTicketProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#001F3F] hover:bg-[#003366] text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      <Plus size={16} />
      Nuevo Ticket
    </button>
  )
}