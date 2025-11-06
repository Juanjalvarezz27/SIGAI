'use client'

import { Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface FiltroEventosExternosProps {
  filtroSeleccionado: string
  onFiltroChange: (filtro: string) => void
  loading?: boolean
}

export default function FiltroEventosExternos({
  filtroSeleccionado,
  onFiltroChange,
  loading = false
}: FiltroEventosExternosProps) {
  const filtros = [
    {
      id: 'todos',
      nombre: 'Todos',
      valor: 'todos',
      icono: RotateCcw,
      color: 'text-gray-600 hover:text-gray-800',
    },
    {
      id: 'en-proceso',
      nombre: 'En Proceso',
      valor: 'En proceso',
      icono: Clock,
      color: 'text-gray-600 hover:text-gray-800',
    },
    {
      id: 'aceptados',
      nombre: 'Aceptados',
      valor: 'Aceptado',
      icono: CheckCircle,
      color: 'text-gray-600 hover:text-gray-800',
    },
    {
      id: 'rechazados',
      nombre: 'Rechazados',
      valor: 'Rechazado',
      icono: XCircle,
      color: 'text-gray-600 hover:text-gray-800',
    }
  ]

  return (
    <div className="flex flex-col items-center mb-8 -mt-2">
      <div className="bg-gray-100 rounded-lg p-2 flex flex-wrap justify-center gap-1 shadow-sm">
        {filtros.map((filtro) => {
          const Icono = filtro.icono
          const isActive = filtroSeleccionado === filtro.valor
          
          return (
            <button
              key={filtro.id}
              type="button"
              onClick={() => onFiltroChange(filtro.valor)}
              disabled={loading}
              className={`
                px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer 
                flex items-center gap-2 min-w-[120px] justify-center
                ${isActive 
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                } 
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Icono 
                size={18} 
                className={
                  isActive ? filtro.color : filtro.color
                } 
              />
              <span className={isActive ? 'font-semibold' : 'font-medium'}>
                {filtro.nombre}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}