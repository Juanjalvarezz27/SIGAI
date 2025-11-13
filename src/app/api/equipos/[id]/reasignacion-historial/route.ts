//Obtener historial de reasignaciones
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using them
    const { id } = await params
    const equipoId = parseInt(id)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: 'ID de equipo inválido' }, { status: 400 })
    }

    const historial = await prismadb.reasignacionHistorialEquipos.findMany({
      where: { equipoId },
      include: {
        usuarioAnterior: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            cedula: true
          }
        },
        usuarioNuevo: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            cedula: true
          }
        },
        reasignadoPor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      },
      orderBy: {
        fechaReasignacion: 'desc'
      }
    })

    return NextResponse.json({ historial }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error obteniendo historial de reasignaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}