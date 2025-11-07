import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface WhereClause {
  fechaCreacion?: {
    gte: Date
    lte: Date
  }
}

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de filtro de la URL
    const { searchParams } = new URL(request.url)
    const fechaInicioParam = searchParams.get('fechaInicio')
    const fechaFinParam = searchParams.get('fechaFin')

    // Convertir parámetros a fechas si existen
    const fechaInicio = fechaInicioParam ? new Date(fechaInicioParam) : null
    const fechaFin = fechaFinParam ? new Date(fechaFinParam) : null

    // Construir el filtro WHERE para Prisma
    const whereClause: WhereClause = {}

    if (fechaInicio && fechaFin) {
      // Filtrar por fecha de creación del evento (fechaCreacion)
      whereClause.fechaCreacion = {
        gte: fechaInicio,
        lte: fechaFin
      }
    }

    // Obtener eventos con filtros aplicados
    const eventos = await prisma.eventoExterno.findMany({
      where: whereClause,
      include: {
        piso: true,
        direccion: true,
        usuarioSolicitante: true,
        equiposEvento: {
          include: {
            tipoEquipo: true
          }
        }
      }
    })

    // Calcular estadísticas desde los datos obtenidos
    const totalEventos = eventos.length
    
    // Eventos por estado
    const eventosPorEstado = eventos.reduce((acc, evento) => {
      acc[evento.estado] = (acc[evento.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Eventos por piso
    const eventosPorPiso = eventos.reduce((acc, evento) => {
      const pisoNombre = evento.piso.piso
      acc[pisoNombre] = (acc[pisoNombre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top solicitantes
    const topSolicitantes = eventos.reduce((acc, evento) => {
      const nombreUsuario = `${evento.usuarioSolicitante.nombre} ${evento.usuarioSolicitante.apellido || ''}`.trim()
      acc[nombreUsuario] = (acc[nombreUsuario] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Equipos más solicitados
    const equiposMasSolicitados = eventos.reduce((acc, evento) => {
      evento.equiposEvento.forEach(equipoEvento => {
        const equipoNombre = equipoEvento.tipoEquipo.nombre
        acc[equipoNombre] = (acc[equipoNombre] || 0) + equipoEvento.cantidad
      })
      return acc
    }, {} as Record<string, number>)

    // Duración promedio (solo para eventos con ambas fechas)
    const eventosConFechas = eventos.filter(evento => 
      evento.fechaInicial && evento.fechaFinal
    )
    
    const duracionPromedio = eventosConFechas.length > 0
      ? eventosConFechas.reduce((sum, evento) => {
          const inicio = new Date(evento.fechaInicial)
          const fin = new Date(evento.fechaFinal)
          const duracionDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
          return sum + duracionDias
        }, 0) / eventosConFechas.length
      : 0

    // Eventos del mes actual (solo si no hay filtro aplicado)
    let eventosEsteMes = 0
    if (!fechaInicio && !fechaFin) {
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)
      
      eventosEsteMes = eventos.filter(evento => 
        new Date(evento.fechaCreacion) >= inicioMes
      ).length
    }

    const estadisticas = {
      totalEventos,
      eventosPorEstado: Object.entries(eventosPorEstado).map(([estado, cantidad]) => ({
        estado,
        cantidad
      })),
      eventosPorPiso: Object.entries(eventosPorPiso).map(([piso, cantidad]) => ({
        piso,
        cantidad
      })),
      eventosPorDireccion: [], // Opcional: puedes agregar similar a eventosPorPiso
      topSolicitantes: Object.entries(topSolicitantes)
        .map(([usuario, cantidad]) => ({ usuario, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5),
      equiposMasSolicitados: Object.entries(equiposMasSolicitados)
        .map(([equipo, cantidad]) => ({ equipo, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad),
      duracionPromedioDias: Math.round(duracionPromedio * 10) / 10,
      eventosEsteMes,
      eventosActivos: eventosPorEstado['En proceso'] || 0,
      eventosCompletados: eventosPorEstado['Aceptado'] || 0,
      eventosRechazados: eventosPorEstado['Rechazado'] || 0
    }

    return NextResponse.json(estadisticas)
  } catch (error) {
    console.error('Error fetching estadísticas de eventos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}