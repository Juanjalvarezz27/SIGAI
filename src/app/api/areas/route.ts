import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const direccionId = searchParams.get('direccionId')

    if (!direccionId) {
      return NextResponse.json({ error: 'direccionId es requerido' }, { status: 400 })
    }

    const areas = await prismadb.area.findMany({
      where: {
        direccionId: parseInt(direccionId)
      },
      select: {
        id: true,
        nombre: true,
        direccionId: true
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    return NextResponse.json({ areas })
  } catch (error: unknown) {
    console.error('Error obteniendo áreas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}