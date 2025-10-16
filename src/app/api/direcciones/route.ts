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
    const pisoId = searchParams.get('pisoId')

    if (!pisoId) {
      return NextResponse.json({ error: 'pisoId es requerido' }, { status: 400 })
    }

    const direcciones = await prismadb.direcciones.findMany({
      where: {
        pisoId: parseInt(pisoId)
      },
      select: {
        id: true,
        direccion: true,
        pisoId: true
      },
      orderBy: {
        direccion: 'asc'
      }
    })

    return NextResponse.json({ direcciones })
  } catch (error: unknown) {
    console.error('Error obteniendo direcciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}