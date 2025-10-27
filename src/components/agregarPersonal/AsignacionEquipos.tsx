"use client"

import { useState, useEffect } from "react"
import { Plus, Monitor } from "lucide-react"
import axios from "axios"
import EquiposList from "./asignacion-equipos/EquiposList"
import EquipoModal from "./asignacion-equipos/EquipoModal"

// Interfaces
interface TipoEquipo {
  id: number
  nombre: string
}

interface Status {
  id: number
  estado: string
}

interface Estado {
  id: number
  nombre: string
}

interface EquipoBase {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string
  marca: string
  statusId: number
  estadoId: number
}

interface EspecificacionesOrdenador {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoConEspecificaciones extends EquipoBase {
  especificaciones?: EspecificacionesOrdenador
  id?: number
}

interface AsignacionEquiposProps {
  onEquiposChange: (equipos: EquipoConEspecificaciones[]) => void
  disabled?: boolean
}

// Hook personalizado para datos
const useEquiposData = () => {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargandoDatos(true)

        const [tiposResponse, statusResponse, estadosResponse] = await Promise.all([
          axios.get('/api/equipos/tipos'),
          axios.get('/api/equipos/status'),
          axios.get('/api/equipos/estados')
        ])

        setTiposEquipo(tiposResponse.data.tipos || [])
        setStatus(statusResponse.data.status || [])
        setEstados(estadosResponse.data.estados || [])

      } catch (error) {
        console.error('Error cargando datos de equipos:', error)
      } finally {
        setCargandoDatos(false)
      }
    }

    cargarDatosIniciales()
  }, [])

  return {
    tiposEquipo,
    status,
    estados,
    cargandoDatos
  }
}

// Componente de Loading
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default function AsignacionEquipos({ onEquiposChange, disabled = false }: AsignacionEquiposProps) {
  const { tiposEquipo, status, estados, cargandoDatos } = useEquiposData()
  const [equipos, setEquipos] = useState<EquipoConEspecificaciones[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [equipoEditando, setEquipoEditando] = useState<number | null>(null)

  // Notificar cambios al componente padre
  useEffect(() => {
    onEquiposChange(equipos)
  }, [equipos, onEquiposChange])

  const agregarEquipo = () => {
    setEquipoEditando(null)
    setModalAbierto(true)
  }

  const editarEquipo = (index: number) => {
    setEquipoEditando(index)
    setModalAbierto(true)
  }

  const eliminarEquipo = (index: number) => {
    setEquipos(prev => prev.filter((_, i) => i !== index))
  }

  const handleGuardarEquipo = (equipoData: EquipoConEspecificaciones) => {
    if (equipoEditando !== null) {
      // Editar equipo existente
      setEquipos(prev => {
        const nuevosEquipos = [...prev]
        nuevosEquipos[equipoEditando] = {
          ...equipoData,
          id: nuevosEquipos[equipoEditando].id
        }
        return nuevosEquipos
      })
    } else {
      // Agregar nuevo equipo
      const nuevoEquipo: EquipoConEspecificaciones = {
        ...equipoData,
        id: Date.now()
      }
      setEquipos(prev => [...prev, nuevoEquipo])
    }
    
    setModalAbierto(false)
    setEquipoEditando(null)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setEquipoEditando(null)
  }

  if (cargandoDatos) {
    return <LoadingSpinner />
  }

  return (
    <div className="bg-[#F0F8FF] border border-[#B0D4FF] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#001F3F] flex items-center gap-2">
          <Monitor className="w-5 h-5 text-[#001F3F]" />
          Asignación de Equipos
        </h3>
        <button
          type="button"
          onClick={agregarEquipo}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-2 bg-[#001F3F] hover:bg-[#003366] text-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Agregar Equipo
        </button>
      </div>

      <EquiposList
        equipos={equipos}
        tiposEquipo={tiposEquipo}
        estados={estados}
        status={status}
        onEditarEquipo={editarEquipo}
        onEliminarEquipo={eliminarEquipo}
        disabled={disabled}
      />

      {modalAbierto && (
        <EquipoModal
          isOpen={modalAbierto}
          onClose={handleCerrarModal}
          onGuardar={handleGuardarEquipo}
          equipoEditando={equipoEditando !== null ? equipos[equipoEditando] : null}
          tiposEquipo={tiposEquipo}
          status={status}
          estados={estados}
          disabled={disabled}
        />
      )}
    </div>
  )
}