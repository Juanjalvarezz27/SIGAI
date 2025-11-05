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
  Trash2,
  HardDriveIcon,
  Database,
  CircuitBoard,
  Layers,
  Server,
  Microchip,
  LucideIcon,
  Crown,
  Medal,
  Target,
  ClipboardCheck
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
  especificaciones: {
    totalEquiposConEspecificaciones: number
    totalEquiposSinEspecificaciones: number
    porcentajeConEspecificaciones: number
    equiposConEspecificacionesCompletas: number
    equiposConEspecificacionesParciales: number
    porcentajeCompletitud: number
    memoriaRam: Array<{ valor: string; cantidad: number }>
    modulosRam: Array<{ valor: string; cantidad: number }>
    capacidadDisco: Array<{ valor: string; cantidad: number }>
    tipoDisco: Array<{ valor: string; cantidad: number }>
    procesadores: Array<{ valor: string; cantidad: number }>
    gamasProcesadores: {
      Alta: number
      Media: number
      Baja: number
      'No identificada': number
      'Sin procesador': number
    }
    procesadoresPorUbicacion: Array<{
      piso: string
      direccion: string
      procesador: string
      cantidad: number
    }>
    gamasPorUbicacion: Array<{
      piso: string
      direccion: string
      gama: string
      cantidad: number
    }>
  }
}

interface DistribucionEspecificacionesProps {
  titulo: string
  datos: Array<{ valor: string; cantidad: number }>
  icon: LucideIcon
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo'
}

interface ItemResumen {
  label: string
  value: number
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
        {[...Array(12)].map((_, i) => (
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
    equiposConObservaciones,
    especificaciones
  } = estadisticas

  // Calcular máximos para escalas relativas
  const maxTipo = Math.max(...equiposPorTipo.map(item => item.cantidad))
  const maxMarca = Math.max(...equiposPorMarca.map(item => item.cantidad))
  const maxDireccion = Math.max(...equiposPorDireccion.map(item => item.cantidad))

  // Componente reutilizable para mostrar distribuciones
  const DistribucionEspecificaciones = ({ 
    titulo, 
    datos, 
    icon: Icon,
    color = 'blue'
  }: DistribucionEspecificacionesProps) => {
    const maxCantidad = datos.length > 0 ? Math.max(...datos.map(item => item.cantidad)) : 0
    
    const getColorClasses = (colorType: string) => {
      switch (colorType) {
        case 'blue': return 'bg-blue-100 text-blue-600'
        case 'green': return 'bg-green-100 text-green-600'
        case 'orange': return 'bg-orange-100 text-orange-600'
        case 'purple': return 'bg-purple-100 text-purple-600'
        case 'red': return 'bg-red-100 text-red-600'
        case 'indigo': return 'bg-indigo-100 text-indigo-600'
        default: return 'bg-blue-100 text-blue-600'
      }
    }

    return (
      <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClasses(color)} group-hover:bg-[#003366] group-hover:text-white transition-all duration-300`}>
              <Icon className="w-5 h-5" />
            </div>
            {titulo}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {datos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay datos disponibles
              </div>
            ) : (
              datos.map((item, index) => {
                const porcentaje = maxCantidad > 0 ? (item.cantidad / maxCantidad) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 truncate flex-1">
                        {item.valor}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 min-w-20 max-w-32">
                        <div
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {item.cantidad}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  // Datos para el resumen de especificaciones
  const itemsResumen: ItemResumen[] = [
    { label: 'Total con especificaciones', value: especificaciones.totalEquiposConEspecificaciones },
    { label: 'Especificaciones completas', value: especificaciones.equiposConEspecificacionesCompletas },
    { label: 'Especificaciones parciales', value: especificaciones.equiposConEspecificacionesParciales },
  ]

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: ESTADÍSTICAS GENERALES */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-16">
          Estadísticas Generales de Equipos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total de Equipos */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                  <Laptop className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
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
              <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeAsignados.toFixed(1)}% del total</p>
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
              <p className="text-sm text-gray-500 mt-2 font-medium">{(100 - porcentajeAsignados).toFixed(1)}% del total</p>
            </div>
          </div>

          {/* Equipos En Uso y Operativos */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                  <CheckCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <TrendingUp className="w-5 h-5 text-[#3C7299]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">En Uso y Operativos</h3>
              <p className="text-3xl font-bold text-[#003366]">{equiposEnUsoOperativos}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeEnUsoOperativos.toFixed(1)}% del total</p>
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
              <p className="text-sm text-gray-500 mt-2 font-medium">{porcentajeDesincorporados.toFixed(1)}% del total</p>
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
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {totalEquipos > 0 ? ((equiposConObservaciones / totalEquipos) * 100).toFixed(1) : 0}% del total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: ESTADÍSTICAS DE ESPECIFICACIONES TÉCNICAS */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-16">
          Especificaciones Técnicas Detalladas
        </h2>
        
        {/* Tarjetas de Resumen de Especificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Equipos Con Especificaciones */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                  <CircuitBoard className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <CheckCircle className="w-5 h-5 text-[#3C7299]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Con Especificaciones</h3>
              <p className="text-3xl font-bold text-[#003366]">{especificaciones.totalEquiposConEspecificaciones}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {especificaciones.porcentajeConEspecificaciones.toFixed(1)}% del total
              </p>
            </div>
          </div>

          {/* Especificaciones Completas */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#6FA1F2] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#6FA1F2] transition-all duration-300">
                  <ClipboardCheck className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
                </div>
                <TrendingUp className="w-5 h-5 text-[#6FA1F2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Especificaciones Completas</h3>
              <p className="text-3xl font-bold text-[#003366]">{especificaciones.equiposConEspecificacionesCompletas}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {especificaciones.porcentajeCompletitud.toFixed(1)}% completas
              </p>
            </div>
          </div>

          {/* Resumen de Especificaciones */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-[#003366] transition-all duration-300">
                  <Server className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                Resumen de Especificaciones
              </h3>
              <div className="space-y-3">
                {itemsResumen.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="font-semibold text-[#003366]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Distribuciones de Especificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <DistribucionEspecificaciones
            titulo="Memoria RAM"
            datos={especificaciones.memoriaRam}
            icon={Database}
            color="blue"
          />
          
          <DistribucionEspecificaciones
            titulo="Módulos RAM"
            datos={especificaciones.modulosRam}
            icon={Layers}
            color="green"
          />
          
          <DistribucionEspecificaciones
            titulo="Capacidad de Disco"
            datos={especificaciones.capacidadDisco}
            icon={HardDriveIcon}
            color="orange"
          />
          
          <DistribucionEspecificaciones
            titulo="Tipo de Disco"
            datos={especificaciones.tipoDisco}
            icon={Database}
            color="purple"
          />
          
          <DistribucionEspecificaciones
            titulo="Procesadores"
            datos={especificaciones.procesadores}
            icon={Microchip}
            color="red"
          />

          {/* Gamas de Procesadores - CORREGIDO */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 group-hover:bg-[#003366] transition-all duration-300">
                  <Crown className="w-5 h-5 text-yellow-600 group-hover:text-white transition-colors" />
                </div>
                Gamas de Procesadores
                <span className="text-sm font-normal text-gray-500">
                  ({Object.values(especificaciones.gamasProcesadores).reduce((a, b) => a + b, 0)} equipos)
                </span>
              </h3>
              <div className="space-y-4">
                {[
                  { gama: 'Alta', cantidad: especificaciones.gamasProcesadores.Alta, icon: Crown, color: 'text-green-600 bg-green-100' },
                  { gama: 'Media', cantidad: especificaciones.gamasProcesadores.Media, icon: Medal, color: 'text-blue-600 bg-blue-100' },
                  { gama: 'Baja', cantidad: especificaciones.gamasProcesadores.Baja, icon: Target, color: 'text-orange-600 bg-orange-100' },
                  { gama: 'No identificada', cantidad: especificaciones.gamasProcesadores['No identificada'], icon: Cpu, color: 'text-gray-600 bg-gray-100' },
                  { gama: 'Sin procesador', cantidad: especificaciones.gamasProcesadores['Sin procesador'], icon: XCircle, color: 'text-red-600 bg-red-100' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{item.gama}</span>
                    </div>
                    <span className="text-lg font-bold text-[#003366]">{item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Procesadores por Ubicación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-[#003366] transition-all duration-300">
                  <MapPin className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                Procesadores por Ubicación
              </h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Piso</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Dirección</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Procesador</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {especificaciones.procesadoresPorUbicacion.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{item.piso}</td>
                        <td className="p-3 text-sm text-gray-700">{item.direccion}</td>
                        <td className="p-3 text-sm text-gray-700 font-medium">{item.procesador}</td>
                        <td className="p-3 text-sm text-right font-bold text-[#003366]">{item.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Gamas por Ubicación - NUEVO */}
          <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#003366] transition-all duration-300">
                  <Building className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                Gamas por Ubicación
              </h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Piso</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Dirección</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Gama</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {especificaciones.gamasPorUbicacion.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{item.piso}</td>
                        <td className="p-3 text-sm text-gray-700">{item.direccion}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.gama === 'Alta' ? 'bg-green-100 text-green-800' :
                            item.gama === 'Media' ? 'bg-blue-100 text-blue-800' :
                            item.gama === 'Baja' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.gama}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-right font-bold text-[#003366]">{item.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: DISTRIBUCIONES GENERALES */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-16">
          Distribuciones Generales
        </h2>
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
                  <Cpu className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                Distribución por Tipo
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {equiposPorTipo.map((tipo, index) => {
                  const porcentajeRelativo = maxTipo > 0 ? (tipo.cantidad / maxTipo) * 100 : 0
                  const porcentajeMinimo = Math.max(porcentajeRelativo, 10)

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
                  const porcentajeRelativo = maxMarca > 0 ? (marca.cantidad / maxMarca) * 100 : 0
                  const porcentajeMinimo = Math.max(porcentajeRelativo, 10)

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
        </div>
      </div>
    </div>
  )
}