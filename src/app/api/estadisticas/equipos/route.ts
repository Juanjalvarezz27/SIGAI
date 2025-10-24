// app/api/estadisticas/equipos/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Obtener todos los equipos con sus relaciones
    const equipos = await prisma.equipos.findMany({
      include: {
        tipoEquipo: true,
        status: true,
        estado: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        },
        modelo: {
          include: {
            marca: true
          }
        },
        especificaciones: true
      }
    })

    // Estadísticas básicas
    const totalEquipos = equipos.length

    // Equipos por status (Activo, Inactivo, Desincorporado, etc.)
    const equiposPorStatus = await prisma.status.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por estado (Operativo, En reparación, etc.)
    const equiposPorEstado = await prisma.estados.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por tipo
    const equiposPorTipo = await prisma.tipoEquipo.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por marca
    const equiposPorMarca = await prisma.marca.findMany({
      include: {
        modelos: {
          include: {
            equipos: true
          }
        }
      }
    })

    // Procesar datos para estadísticas
    const equiposAsignados = equipos.filter(equipo => equipo.usuarioId !== null).length
    const equiposNoAsignados = totalEquipos - equiposAsignados

    // Equipos con Estado: "En uso" y Status: "Operativo" (id 1 ambos)
    const equiposEnUsoOperativos = equipos.filter(equipo => 
      equipo.estado?.id === 1 && equipo.status?.id === 1
    ).length

    // Equipos con Status: "Desincorporados" (id 3)
    const equiposDesincorporados = equipos.filter(equipo => 
      equipo.status?.id === 3
    ).length

    const equiposSinEspecificaciones = equipos.filter(equipo => !equipo.especificacionesId).length
    const equiposConObservaciones = equipos.filter(equipo => equipo.observaciones && equipo.observaciones.length > 0).length

    // Procesar equipos por piso
    const equiposConUsuarios = equipos.filter(equipo => equipo.usuario !== null)
    const equiposPorPisoMap = new Map()
    
    equiposConUsuarios.forEach(equipo => {
      const piso = equipo.usuario?.direccion.piso.piso
      if (piso) {
        equiposPorPisoMap.set(piso, (equiposPorPisoMap.get(piso) || 0) + 1)
      }
    })

    const equiposPorPiso = Array.from(equiposPorPisoMap, ([piso, cantidad]) => ({
      piso,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por dirección
    const equiposPorDireccionMap = new Map()
    
    equiposConUsuarios.forEach(equipo => {
      const direccion = equipo.usuario?.direccion.direccion
      const piso = equipo.usuario?.direccion.piso.piso
      if (direccion) {
        equiposPorDireccionMap.set(direccion, (equiposPorDireccionMap.get(direccion) || 0) + 1)
      }
    })

    const equiposPorDireccion = Array.from(equiposPorDireccionMap, ([direccion, cantidad]) => ({
      direccion,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por área
    const equiposPorAreaMap = new Map()
    
    equiposConUsuarios.forEach(equipo => {
      const area = equipo.usuario?.area?.nombre
      if (area) {
        equiposPorAreaMap.set(area, (equiposPorAreaMap.get(area) || 0) + 1)
      }
    })

    const equiposPorArea = Array.from(equiposPorAreaMap, ([area, cantidad]) => ({
      area,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por marca (todos)
    const equiposPorMarcaProcesado = equiposPorMarca.map(marca => ({
      marca: marca.nombre,
      cantidad: marca.modelos.reduce((acc, modelo) => acc + modelo.equipos.length, 0)
    })).filter(item => item.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por tipo (todos)
    const equiposPorTipoProcesado = equiposPorTipo.map(tipo => ({
      tipo: tipo.nombre,
      cantidad: tipo.equipos.length
    })).filter(item => item.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)

    const estadisticas = {
      totalEquipos,
      equiposAsignados,
      equiposNoAsignados,
      porcentajeAsignados: totalEquipos > 0 ? (equiposAsignados / totalEquipos) * 100 : 0,
      equiposEnUsoOperativos,
      equiposDesincorporados,
      porcentajeEnUsoOperativos: totalEquipos > 0 ? (equiposEnUsoOperativos / totalEquipos) * 100 : 0,
      porcentajeDesincorporados: totalEquipos > 0 ? (equiposDesincorporados / totalEquipos) * 100 : 0,
      
      equiposPorStatus: equiposPorStatus.map(status => ({
        status: status.estado,
        cantidad: status.equipos.length
      })).filter(item => item.cantidad > 0),

      equiposPorEstado: equiposPorEstado.map(estado => ({
        estado: estado.nombre,
        cantidad: estado.equipos.length
      })).filter(item => item.cantidad > 0),

      equiposPorTipo: equiposPorTipoProcesado,
      equiposPorPiso,
      equiposPorDireccion,
      equiposPorArea,
      equiposPorMarca: equiposPorMarcaProcesado,
      equiposSinEspecificaciones,
      equiposConObservaciones
    }

    return NextResponse.json(estadisticas)
  } catch (error) {
    console.error('Error al cargar estadísticas de equipos:', error)
    return NextResponse.json(
      { error: 'Error al cargar estadísticas de equipos' },
      { status: 500 }
    )
  }
}