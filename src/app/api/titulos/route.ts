import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const titulos = await prismadb.titulo.findMany({
      where: {
        nombre: {
          contains: search,
          mode: 'insensitive'
        }
      },
      include: {
        tipoTicket: {
          select: {
            id: true,
            tipo: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    return NextResponse.json(titulos)
  } catch (error) {
    console.error('Error fetching titulos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Agregar esto para evitar el error 405
export async function POST() {
  return NextResponse.json(
    { error: 'Método no permitido. Use /api/titulos/crearTitulos' },
    { status: 405 }
  )
}