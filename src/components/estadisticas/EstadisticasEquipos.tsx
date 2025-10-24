"use client"

import { useState, useEffect } from "react"
import { 
  Laptop, 
  Package, 
  Cpu, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Building,
  MapPin,
  Users,
  HardDrive,
  FileText,
  Trash2
} from "lucide-react"

interface EstadisticasEquipos {
  totalEquipos: number
  equiposAsignados: number
  equiposNoAsignados: number
  porcentajeAsignados: number
  equiposEnUsoOperativos: number
  equiposDesincorporados: number
  porcentajeEnUsoOperativos: number
  porcentajeDesincorporados: number
  equiposPorStatus: Array<{
    status: string
    cantidad: number
  }>
  equiposPorEstado: Array<{
    estado: string
    cantidad: number
  }>
  equiposPorTipo: Array<{
    tipo: string
    cantidad: number
  }>
  equiposPorPiso: Array<{
    piso: string
    cantidad: number
  }>
  equiposPorDireccion: Array<{
    direccion: string
    cantidad: number
  }>
  equiposPorArea: Array<{
    area: string
    cantidad: number
  }>
  equiposPorMarca: Array<{
    marca: string
    cantidad: number
  }>
  equiposSinEspecificaciones: number
  equiposConObservaciones: number
}

export default function EstadisticasEquipos() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasEquipos | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/estadisticas/equipos')
        
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas de equipos')
        }
        
        const data = await response.json()
        setEstadisticas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    cargarEstadisticas()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !estadisticas) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-800 font-medium">Error al cargar estadísticas de equipos</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    )
  }

  const {
    totalEquipos,
    equiposAsignados,
    equiposNoAsignados,
    porcentajeAsignados,
    equiposEnUsoOperativos,
    equiposDesincorporados,
    porcentajeEnUsoOperativos,
    porcentajeDesincorporados,
    equiposPorStatus,
    equiposPorEstado,
    equiposPorTipo,
    equiposPorPiso,
    equiposPorDireccion,
    equiposPorMarca,
    equiposConObservaciones
  } = estadisticas

  // Calcular máximos para escalas relativas
  const maxTipo = Math.max(...equiposPorTipo.map(item => item.cantidad))
  const maxMarca = Math.max(...equiposPorMarca.map(item => item.cantidad))
  const maxDireccion = Math.max(...equiposPorDireccion.map(item => item.cantidad))

  return (
    <div className="space-y-6">
      {/* Grid Principal de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de Equipos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <Laptop className="w-6 h-6  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Equipos</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalEquipos}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Equipos registrados en el sistema</p>
          </div>
        </div>

        {/* Equipos Asignados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#6FA1F2] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#6FA1F2] transition-all duration-300">
                <Users className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <CheckCircle className="w-5 h-5 text-[#6FA1F2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipos Asignados</h3>
            <p className="text-3xl font-bold text-[#003366]">{equiposAsignados}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeAsignados.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Equipos No Asignados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Package className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <XCircle className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipos No Asignados</h3>
            <p className="text-3xl font-bold text-[#003366]">{equiposNoAsignados}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{(100 - porcentajeAsignados).toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Equipos En Uso y Operativos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <CheckCircle className="w-6 h-6  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">En Uso y Operativos</h3>
            <p className="text-3xl font-bold text-[#003366]">{equiposEnUsoOperativos}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeEnUsoOperativos.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Equipos Desincorporados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#6FA1F2] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#6FA1F2] transition-all duration-300">
                <Trash2 className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <AlertTriangle className="w-5 h-5 text-[#6FA1F2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Equipos Desincorporados</h3>
            <p className="text-3xl font-bold text-[#003366]">{equiposDesincorporados}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeDesincorporados.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Equipos con Observaciones */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <FileText className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Con Observaciones</h3>
            <p className="text-3xl font-bold text-[#003366]">{equiposConObservaciones}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">
              {totalEquipos > 0 ? ((equiposConObservaciones / totalEquipos) * 100).toFixed(1) : 0}% del total
            </p>
          </div>
        </div>
      </div>

      {/* Grid Secundario - Distribuciones Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Status */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Package className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Status
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorStatus.map((status, index) => {
                const porcentaje = totalEquipos > 0 ? (status.cantidad / totalEquipos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {status.status.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {status.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Estado */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <HardDrive className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Estado
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorEstado.map((estado, index) => {
                const porcentaje = totalEquipos > 0 ? (estado.cantidad / totalEquipos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {estado.estado.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {estado.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Tipo */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Cpu className="w-5 h-5  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              Distribución por Tipo
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorTipo.map((tipo, index) => {
                // Usar escala relativa al máximo en lugar del porcentaje del total
                const porcentajeRelativo = maxTipo > 0 ? (tipo.cantidad / maxTipo) * 100 : 0
                const porcentajeMinimo = Math.max(porcentajeRelativo, 10) // Mínimo 10% para que sea visible
                
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {tipo.tipo.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentajeMinimo}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {tipo.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Marca */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Cpu className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Marca
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorMarca.map((marca, index) => {
                // Usar escala relativa al máximo en lugar del porcentaje del total
                const porcentajeRelativo = maxMarca > 0 ? (marca.cantidad / maxMarca) * 100 : 0
                const porcentajeMinimo = Math.max(porcentajeRelativo, 10) // Mínimo 10% para que sea visible
                
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {marca.marca.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentajeMinimo}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {marca.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Dirección */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <MapPin className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Dirección
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorDireccion.map((direccion, index) => {
                // Usar escala relativa al máximo en lugar del porcentaje del total
                const porcentajeRelativo = maxDireccion > 0 ? (direccion.cantidad / maxDireccion) * 100 : 0
                const porcentajeMinimo = Math.max(porcentajeRelativo, 10) // Mínimo 10% para que sea visible
                
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {direccion.direccion.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentajeMinimo}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {direccion.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por Piso */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Building className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Piso
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {equiposPorPiso.map((piso, index) => {
                const porcentaje = totalEquipos > 0 ? (piso.cantidad / totalEquipos) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 min-w-16">
                        {piso.piso}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {piso.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}