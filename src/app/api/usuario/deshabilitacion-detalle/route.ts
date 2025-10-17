import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    // Obtener el historial de deshabilitación más reciente
    const historialDeshabilitacion = await prismadb.deshabilitacionHistorial.findFirst({
      where: {
        usuarioId: parseInt(usuarioId)
      },
      orderBy: {
        fechaDeshabilitacion: 'desc'
      },
      select: {
        motivo: true,
        fechaDeshabilitacion: true,
        deshabilitadoPor: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    })

    return NextResponse.json({ historialDeshabilitacion })

  } catch (error: unknown) {
    console.error('Error obteniendo detalle de deshabilitación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}