import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

interface EstadisticasTickets {
  // Totales generales
  totalTickets: number
  ticketsAbiertos: number
  ticketsCerrados: number
  ticketsEnProgreso: number

  // Distribución por tipo
  ticketsPorTipo: Array<{
    tipo: string
    cantidad: number
    porcentaje: number
  }>

  // Tiempos y eficiencia
  tiempoPromedioCierreHoras: number
  ticketsResueltosEn24Horas: number
  ticketsResueltosEn72Horas: number
  ticketsPendientesMas7Dias: number

  // Por analista
  ticketsPorAnalista: Array<{
    analista: string
    cantidad: number
    tipo: string
  }>

  // Por sistema (solo tickets de sistemas)
  ticketsPorSistema: Array<{
    sistema: string
    cantidad: number
    porcentaje: number
  }>

  // Por falla (solo tickets de sistemas)
  ticketsPorFalla: Array<{
    falla: string
    cantidad: number
    porcentaje: number
  }>

  // Por ubicación
  ticketsPorPiso: Array<{
    piso: string
    cantidad: number
    porcentaje: number
  }>

  // Por área
  ticketsPorArea: Array<{
    area: string
    cantidad: number
    porcentaje: number
  }>

  // Reasignaciones
  totalReasignaciones: number
  ticketsReasignados: number
  ticketsPorCondicionCierre: Array<{
    condicion: string
    cantidad: number
    porcentaje: number
  }>

  // Tendencias mensuales
  ticketsUltimos30Dias: number
  ticketsUltimos7Dias: number
  ticketsHoy: number

  // Equipos más problemáticos
  equiposMasReportados: Array<{
    equipo: string
    tipo: string
    cantidadTickets: number
  }>

  // Usuarios más afectados
  usuariosMasAfectados: Array<{
    usuario: string
    area: string
    cantidadTickets: number
  }>

  // Tiempo promedio por tipo de ticket
  tiempoPromedioPorTipo: Array<{
    tipo: string
    tiempoPromedioHoras: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener todos los tickets con sus relaciones
    const tickets = await prisma.ticket.findMany({
      include: {
        estado: true,
        tipoTicket: true,
        usuarioCreador: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        },
        usuarioAfectado: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        },
        usuarioCerrador: {
          include: {
            tipoAnalista: true
          }
        },
        ticketEquipos: {
          include: {
            equipo: {
              include: {
                tipoEquipo: true,
                modelo: {
                  include: {
                    marca: true
                  }
                }
              }
            }
          }
        },
        ticketCierre: true,
        reasignaciones: true,
        TicketSistema: {
          include: {
            sistema: true,
            falla: true
          }
        }
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    })

    // Cálculos de estadísticas
    const totalTickets = tickets.length
    const ticketsAbiertos = tickets.filter(t => t.estadoId === 1).length
    const ticketsCerrados = tickets.filter(t => t.estadoId === 2).length
    const ticketsEnProgreso = tickets.filter(t => t.estadoId === 3).length

    // Distribución por tipo de ticket
    const tiposTicket = await prisma.tipoTicket.findMany()
    const ticketsPorTipo = tiposTicket.map(tipo => {
      const cantidad = tickets.filter(t => t.tipoTicketId === tipo.id).length
      return {
        tipo: tipo.tipo,
        cantidad,
        porcentaje: totalTickets > 0 ? (cantidad / totalTickets) * 100 : 0
      }
    })

    // Tiempos y eficiencia
    const ticketsConCierre = tickets.filter(t => t.ticketCierre)
    const tiempoPromedioCierreHoras = ticketsConCierre.length > 0
      ? ticketsConCierre.reduce((acc, ticket) => {
          const fechaCreacion = new Date(ticket.fecha_creacion)
          const fechaCierre = new Date(ticket.ticketCierre!.fechaCierre)
          const diferenciaHoras = (fechaCierre.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60)
          return acc + diferenciaHoras
        }, 0) / ticketsConCierre.length
      : 0

    const ticketsResueltosEn24Horas = ticketsConCierre.filter(ticket => {
      const fechaCreacion = new Date(ticket.fecha_creacion)
      const fechaCierre = new Date(ticket.ticketCierre!.fechaCierre)
      const diferenciaHoras = (fechaCierre.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60)
      return diferenciaHoras <= 24
    }).length

    const ticketsResueltosEn72Horas = ticketsConCierre.filter(ticket => {
      const fechaCreacion = new Date(ticket.fecha_creacion)
      const fechaCierre = new Date(ticket.ticketCierre!.fechaCierre)
      const diferenciaHoras = (fechaCierre.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60)
      return diferenciaHoras <= 72
    }).length

    const ticketsPendientesMas7Dias = tickets.filter(ticket => {
      if (ticket.estadoId !== 1) return false // Solo tickets abiertos
      const fechaCreacion = new Date(ticket.fecha_creacion)
      const ahora = new Date()
      const diferenciaDias = (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
      return diferenciaDias > 7
    }).length

    // Tiempo promedio por tipo de ticket
    const tiempoPromedioPorTipo = tiposTicket.map(tipo => {
      const ticketsDelTipo = ticketsConCierre.filter(t => t.tipoTicketId === tipo.id)
      const tiempoPromedio = ticketsDelTipo.length > 0
        ? ticketsDelTipo.reduce((acc, ticket) => {
            const fechaCreacion = new Date(ticket.fecha_creacion)
            const fechaCierre = new Date(ticket.ticketCierre!.fechaCierre)
            const diferenciaHoras = (fechaCierre.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60)
            return acc + diferenciaHoras
          }, 0) / ticketsDelTipo.length
        : 0

      return {
        tipo: tipo.tipo,
        tiempoPromedioHoras: Math.round(tiempoPromedio * 100) / 100
      }
    })

    // Por analista
    const analistas = await prisma.usuario.findMany({
      where: {
        tipoAnalistaId: { not: null }
      },
      include: {
        tipoAnalista: true
      }
    })

    const ticketsPorAnalista = analistas.map(analista => {
      const cantidad = tickets.filter(t => t.usuarioCerradorId === analista.id).length
      return {
        analista: `${analista.nombre} ${analista.apellido || ''}`,
        cantidad,
        tipo: analista.tipoAnalista?.tipo || 'Sin tipo'
      }
    }).filter(a => a.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad)

    // Por sistema
    const sistemas = await prisma.sistema.findMany()
    const totalTicketsSistemas = tickets.filter(t => t.tipoTicketId === 3).length
    const ticketsPorSistema = sistemas.map(sistema => {
      const cantidad = tickets.filter(t =>
        t.TicketSistema?.some(ts => ts.sistemaId === sistema.id)
      ).length
      return {
        sistema: sistema.nombre,
        cantidad,
        porcentaje: totalTicketsSistemas > 0 ? (cantidad / totalTicketsSistemas) * 100 : 0
      }
    }).filter(s => s.cantidad > 0)

    // Por falla
    const fallas = await prisma.falla.findMany()
    const ticketsPorFalla = fallas.map(falla => {
      const cantidad = tickets.filter(t =>
        t.TicketSistema?.some(ts => ts.fallaId === falla.id)
      ).length
      return {
        falla: falla.nombre,
        cantidad,
        porcentaje: totalTicketsSistemas > 0 ? (cantidad / totalTicketsSistemas) * 100 : 0
      }
    }).filter(f => f.cantidad > 0)

    // Por piso
    const pisos = await prisma.piso.findMany()
    const ticketsPorPiso = pisos.map(piso => {
      const cantidad = tickets.filter(t =>
        t.usuarioAfectado?.direccion?.pisoId === piso.id
      ).length
      return {
        piso: piso.piso,
        cantidad,
        porcentaje: totalTickets > 0 ? (cantidad / totalTickets) * 100 : 0
      }
    }).filter(p => p.cantidad > 0)

    // Por área
    const areas = await prisma.area.findMany()
    const ticketsPorArea = areas.map(area => {
      const cantidad = tickets.filter(t =>
        t.usuarioAfectado?.areaId === area.id
      ).length
      return {
        area: area.nombre,
        cantidad,
        porcentaje: totalTickets > 0 ? (cantidad / totalTickets) * 100 : 0
      }
    }).filter(a => a.cantidad > 0)

    // Reasignaciones
    const totalReasignaciones = tickets.reduce((acc, ticket) =>
      acc + (ticket.reasignaciones?.length || 0), 0
    )
    const ticketsReasignados = tickets.filter(t =>
      (t.reasignaciones?.length || 0) > 0
    ).length

    // Por condición de cierre
    const condiciones = ['Finalizado', 'Rechazado', 'Cancelado']
    const ticketsPorCondicionCierre = condiciones.map(condicion => {
      const cantidad = ticketsConCierre.filter(t =>
        t.ticketCierre?.condicion === condicion
      ).length
      return {
        condicion,
        cantidad,
        porcentaje: ticketsConCierre.length > 0 ? (cantidad / ticketsConCierre.length) * 100 : 0
      }
    })

    // Tendencias
    const ahora = new Date()
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())

    const ticketsUltimos30Dias = tickets.filter(t =>
      new Date(t.fecha_creacion) >= hace30Dias
    ).length

    const ticketsUltimos7Dias = tickets.filter(t =>
      new Date(t.fecha_creacion) >= hace7Dias
    ).length

    const ticketsHoy = tickets.filter(t =>
      new Date(t.fecha_creacion) >= inicioHoy
    ).length

    // Equipos más problemáticos
    const equiposMap = new Map()
    tickets.forEach(ticket => {
      ticket.ticketEquipos?.forEach(te => {
        const key = `${te.equipo.tipoEquipo.nombre} - ${te.equipo.modelo.marca.nombre} ${te.equipo.modelo.nombre}`
        equiposMap.set(key, (equiposMap.get(key) || 0) + 1)
      })
    })

    const equiposMasReportados = Array.from(equiposMap.entries())
      .map(([equipo, cantidadTickets]) => {
        const [tipo, ...rest] = equipo.split(' - ')
        return {
          equipo: rest.join(' - '),
          tipo,
          cantidadTickets
        }
      })
      .sort((a, b) => b.cantidadTickets - a.cantidadTickets)
      .slice(0, 10)

    // Usuarios más afectados
    const usuariosMap = new Map()
    tickets.forEach(ticket => {
      if (ticket.usuarioAfectado) {
        const key = `${ticket.usuarioAfectado.nombre} ${ticket.usuarioAfectado.apellido || ''}`
        usuariosMap.set(key, {
          cantidad: (usuariosMap.get(key)?.cantidad || 0) + 1,
          area: ticket.usuarioAfectado.area?.nombre || 'Sin área'
        })
      }
    })

    const usuariosMasAfectados = Array.from(usuariosMap.entries())
      .map(([usuario, data]) => ({
        usuario,
        area: data.area,
        cantidadTickets: data.cantidad
      }))
      .sort((a, b) => b.cantidadTickets - a.cantidadTickets)
      .slice(0, 10)

    const estadisticas: EstadisticasTickets = {
      totalTickets,
      ticketsAbiertos,
      ticketsCerrados,
      ticketsEnProgreso,
      ticketsPorTipo,
      tiempoPromedioCierreHoras: Math.round(tiempoPromedioCierreHoras * 100) / 100,
      ticketsResueltosEn24Horas,
      ticketsResueltosEn72Horas,
      ticketsPendientesMas7Dias,
      ticketsPorAnalista,
      ticketsPorSistema,
      ticketsPorFalla,
      ticketsPorPiso,
      ticketsPorArea,
      totalReasignaciones,
      ticketsReasignados,
      ticketsPorCondicionCierre,
      ticketsUltimos30Dias,
      ticketsUltimos7Dias,
      ticketsHoy,
      equiposMasReportados,
      usuariosMasAfectados,
      tiempoPromedioPorTipo
    }

    return NextResponse.json(estadisticas)
  } catch (error) {
    console.error('Error generando estadísticas de tickets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}