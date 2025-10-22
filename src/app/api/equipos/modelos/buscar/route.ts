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

    // Si no hay query, retornar array vacío
    if (!query.trim()) {
      return NextResponse.json({ modelos: [] })
    }

    const modelos = await prismadb.modelo.findMany({
      where: {
        AND: [
          { marcaId: parseInt(marcaId) },
          {
            nombre: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json({ modelos })
  } catch (error) {
    console.error('Error buscando modelos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}