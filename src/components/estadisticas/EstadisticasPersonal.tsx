"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building, 
  Laptop, 
  AlertTriangle,
  TrendingUp,
  PieChart,
  Cpu,
  MapPin,
  Package
} from "lucide-react"

interface EstadisticasPersonal {
  totalUsuarios: number
  usuariosPorRol: Array<{
    rol: string
    cantidad: number
  }>
  usuariosDeshabilitados: number
  usuariosActivos: number
  usuariosPorPiso: Array<{
    piso: string
    cantidad: number
  }>
  usuariosEquiposSinUso: number
  usuariosEquiposInoperativos: number
  usuariosEquiposDesincorporados: number
  usuariosConEquipos: number
  usuariosSinEquipos: number
  totalEquiposAsignados: number
}

export default function EstadisticasPersonal() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasPersonal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/estadisticas/personal')
        
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas')
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
        <p className="text-red-800 font-medium">Error al cargar estadísticas</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    )
  }

  const {
    totalUsuarios,
    usuariosPorRol,
    usuariosDeshabilitados,
    usuariosActivos,
    usuariosPorPiso,
    usuariosConEquipos,
    usuariosSinEquipos,
    totalEquiposAsignados
  } = estadisticas

  const porcentajeDeshabilitados = totalUsuarios > 0 
    ? ((usuariosDeshabilitados / totalUsuarios) * 100).toFixed(1)
    : "0"

  const porcentajeConEquipos = totalUsuarios > 0
    ? ((usuariosConEquipos / totalUsuarios) * 100).toFixed(1)
    : "0"

  const promedioEquiposPorUsuario = usuariosConEquipos > 0
    ? (totalEquiposAsignados / usuariosConEquipos).toFixed(1)
    : "0"

  // Calcular distribución porcentual
  const porcentajeActivos = totalUsuarios > 0 ? (usuariosActivos / totalUsuarios) * 100 : 0
  const porcentajeSinEquipos = totalUsuarios > 0 ? (usuariosSinEquipos / totalUsuarios) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Grid Principal de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de Usuarios */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <Users className="w-6 h-6  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Usuarios</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalUsuarios}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">Usuarios registrados en el sistema</p>
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#6FA1F2] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#6FA1F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#6FA1F2] transition-all duration-300">
                <UserCheck className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#6FA1F2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuarios Activos</h3>
            <p className="text-3xl font-bold text-[#003366]">{usuariosActivos}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeActivos.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Usuarios Deshabilitados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <UserX className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <AlertTriangle className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuarios Deshabilitados</h3>
            <p className="text-3xl font-bold text-[#003366]">{usuariosDeshabilitados}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeDeshabilitados}% del total</p>
          </div>
        </div>

        {/* Usuarios con Equipos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#5D8AA8] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#5D8AA8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#5D8AA8] transition-all duration-300">
                <Laptop className="w-6 h-6  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <Cpu className="w-5 h-5  text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuarios con Equipos</h3>
            <p className="text-3xl font-bold text-[#003366]">{usuariosConEquipos}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeConEquipos}% del total</p>
          </div>
        </div>

        {/* Usuarios sin Equipos */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#3C7299] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#6FA1F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#3C7299] transition-all duration-300">
                <Laptop className="w-6 h-6 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              <AlertTriangle className="w-5 h-5 text-[#3C7299]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usuarios sin Equipos</h3>
            <p className="text-3xl font-bold text-[#003366]">{usuariosSinEquipos}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{porcentajeSinEquipos.toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Total Equipos Asignados */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-[#E89A6B] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-[#E89A6B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#F0F8FF] group-hover:bg-[#E89A6B] transition-all duration-300">
                <Package className="w-6 h-6 text-[#E89A6B] group-hover:text-white transition-colors" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#E89A6B]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Equipos</h3>
            <p className="text-3xl font-bold text-[#003366]">{totalEquiposAsignados}</p>
            <p className="text-sm  text-gray-500 mt-2 font-medium">{promedioEquiposPorUsuario} por usuario</p>
          </div>
        </div>
      </div>

      {/* Grid Secundario - Distribución Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Roles */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <PieChart className="w-5 h-5  text-gray-500 group-hover:text-white transition-colors" />
              </div>
              Distribución por Roles
            </h3>
            <div className="space-y-4">
              {usuariosPorRol.map((rol, index) => {
                const porcentaje = totalUsuarios > 0 ? (rol.cantidad / totalUsuarios) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between group/item hover:bg-gray-50 rounded-lg p-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-20">
                        {rol.rol.toLowerCase()}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[#003366] to-[#5D8AA8] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003366] min-w-12 text-right">
                      {rol.cantidad}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Usuarios por Piso (Todos los pisos) */}
        <div className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden hover:border-[#5D8AA8]">
          <div className="absolute inset-0 bg-[#5D8AA8]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F0F8FF] group-hover:bg-[#003366] transition-all duration-300">
                <Building className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
              </div>
              Distribución por Pisos
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {usuariosPorPiso.map((piso, index) => {
                const porcentaje = totalUsuarios > 0 ? (piso.cantidad / totalUsuarios) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between py-1 group/item hover:bg-gray-50 rounded-lg px-2 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <MapPin className="w-4 h-4  text-gray-500" />
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