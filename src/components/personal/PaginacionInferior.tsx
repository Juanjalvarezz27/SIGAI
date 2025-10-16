"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaginationInfo } from "../../../types/personal"

interface PaginacionInferiorProps {
  pagination: PaginationInfo | null
  currentPage: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export default function PaginacionInferior({
  pagination,
  currentPage,
  onPageChange,
  loading = false
}: PaginacionInferiorProps) {
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage || loading}
          className="flex cursor-pointer items-center gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">
            Página {currentPage} de {pagination.totalPages}
          </span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage || loading}
          className="flex items-center cursor-pointer gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}