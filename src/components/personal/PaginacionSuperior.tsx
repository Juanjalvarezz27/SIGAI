"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaginationInfo } from "../../../types/personal"

interface PaginacionSuperiorProps {
  pagination: PaginationInfo | null
  currentPage: number
  onPageChange: (page: number) => void
  loading?: boolean
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

// Función para generar números de página a mostrar
const generarNumerosPagina = (pagination: PaginationInfo | null) => {
  if (!pagination) return []

  const totalPages = pagination.totalPages
  const current = pagination.currentPage
  const delta = 2
  const range = []

  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < totalPages - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }

  return range
}

export default function PaginacionSuperior({
  pagination,
  currentPage,
  onPageChange,
  loading = false,
  rolFiltro
}: PaginacionSuperiorProps) {
  if (!pagination) return null

  const numerosPagina = generarNumerosPagina(pagination)

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, pagination.totalCount)}</span> de <span className="font-semibold">{pagination.totalCount}</span> {getNombreFiltro(rolFiltro).toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {numerosPagina.map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum as number)}
                  disabled={loading}
                  className={`px-3 py-1 text-sm rounded-md transform transition-all duration-200 hover:scale-105 ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white cursor-pointer'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-100 cursor-pointer'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}