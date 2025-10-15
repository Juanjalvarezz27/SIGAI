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

    const pisos = await prismadb.piso.findMany({
      select: {
        id: true,
        piso: true
      },
      orderBy: {
        piso: 'asc'
      }
    })

    return NextResponse.json({ pisos })
  } catch (error: unknown) {
    console.error('Error obteniendo pisos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}