import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 100
    const tipoEquipoIds = searchParams.getAll('tipoEquipoIds') // Para múltiples tipos
    const statusId = searchParams.get('statusId')
    const marcaId = searchParams.get('marcaId')
    const modeloId = searchParams.get('modeloId')

    const skip = (page - 1) * limit

    // Construir where clause
    const where: {
      tipoEquipoId?: number | { in: number[] }
      statusId?: number
      modelo?: {
        marcaId?: number
      }
      modeloId?: number
    } = {}

    // Manejar múltiples tipos de equipo
    if (tipoEquipoIds.length > 0 && !tipoEquipoIds.includes('todos')) {
      const tipoIds = tipoEquipoIds.map(id => parseInt(id)).filter(id => !isNaN(id))
      if (tipoIds.length > 0) {
        where.tipoEquipoId = { in: tipoIds }
      }
    }

    // Filtro por status
    if (statusId && statusId !== 'todos') {
      where.statusId = parseInt(statusId)
    }

    // Filtro por marca (a través del modelo)
    if (marcaId) {
      where.modelo = {
        marcaId: parseInt(marcaId)
      }
    }

    // Filtro por modelo
    if (modeloId) {
      where.modeloId = parseInt(modeloId)
    }

    // Obtener equipos con relaciones
    const equipos = await prismadb.equipos.findMany({
      where,
      skip,
      take: limit,
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
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
        especificaciones: true
      },
      orderBy: {
        id: 'asc'
      }
    })

    // Obtener conteo total para paginación
    const totalItems = await prismadb.equipos.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      equipos,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        totalCount: totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit
      }
    })

  } catch (error) {
    console.error('Error obteniendo equipos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}