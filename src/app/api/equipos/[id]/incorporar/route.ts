import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar autenticación y permisos
    if (!session?.user?.id || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Await the params before using them
    const { id } = await params
    const equipoId = parseInt(id)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: 'ID de equipo inválido' }, { status: 400 })
    }

    // Verificar si el equipo existe
    const equipoExistente = await prismadb.equipos.findUnique({
      where: { id: equipoId },
      include: {
        status: true,
        estado: true
      }
    })

    if (!equipoExistente) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Verificar si ya está habilitado (no es Desincorporados)
    if (equipoExistente.statusId !== 3) {
      return NextResponse.json({ error: 'El equipo ya está habilitado' }, { status: 400 })
    }

    // Buscar el último historial de deshabilitación para obtener el status y estado anterior
    const ultimoHistorial = await prismadb.desincorporacionHistorialEquipos.findFirst({
      where: { equipoId: equipoId },
      orderBy: { fechaDeshabilitacion: 'desc' },
      select: { 
        statusAnteriorId: true,
        estadoAnteriorId: true 
      }
    })

    // Si no hay historial, usar status por defecto (Operativos - ID 1) y estado por defecto (Sin uso - ID 2)
    const nuevoStatusId = ultimoHistorial?.statusAnteriorId || 1
    const nuevoEstadoId = ultimoHistorial?.estadoAnteriorId || 2

    // Verificar que el status anterior existe
    const statusAnterior = await prismadb.status.findUnique({
      where: { id: nuevoStatusId }
    })

    if (!statusAnterior) {
      return NextResponse.json({ error: 'Status anterior no encontrado' }, { status: 500 })
    }

    // Verificar que el estado anterior existe (si se especificó)
    let estadoAnterior = null
    if (nuevoEstadoId) {
      estadoAnterior = await prismadb.estados.findUnique({
        where: { id: nuevoEstadoId }
      })
      
      if (!estadoAnterior) {
        return NextResponse.json({ error: 'Estado anterior no encontrado' }, { status: 500 })
      }
    }

    // Actualizar el equipo al status y estado anterior
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        statusId: nuevoStatusId,
        estadoId: nuevoEstadoId || 2 // Si no hay estado anterior, usar "Sin uso"
      },
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
        status: true,
        estado: true,
        especificaciones: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        }
      }
    })

    return NextResponse.json({
      equipo: equipoActualizado,
      message: 'Equipo habilitado correctamente'
    }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error habilitando equipo:', error)

    // Manejar errores específicos de Prisma
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string }
      if (prismaError.code === 'P2025') {
        return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}