//buscar modelos
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const marcaId = searchParams.get('marcaId')

    if (!marcaId) {
      return NextResponse.json({ error: 'marcaId es requerido' }, { status: 400 })
    }

    // Construir el where clause de forma type-safe
    const whereClause: {
      marcaId: number
      nombre?: {
        contains: string
        mode: 'insensitive'
      }
    } = {
      marcaId: parseInt(marcaId)
    }

    // Solo agregar filtro por nombre si hay query
    if (query.trim()) {
      whereClause.nombre = {
        contains: query,
        mode: 'insensitive'
      }
    }

    // SIEMPRE cargar modelos, incluso si no hay query
    const modelos = await prismadb.modelo.findMany({
      where: whereClause,
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json({ modelos })
  } catch (error) {
    console.error('Error buscando modelos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}