import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { getServerSession } from 'next-auth'

export async function PUT(
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

    const body = await request.json()
    const { usuarioId, motivo } = body

    // Obtener el usuario que está haciendo la reasignación
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuarioReasignador = await prismadb.usuario.findUnique({
      where: { email: session.user.email }
    })

    if (!usuarioReasignador) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar si el equipo existe
    const equipoExistente = await prismadb.equipos.findUnique({
      where: { id: equipoId },
      include: {
        usuario: true
      }
    })

    if (!equipoExistente) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Verificar si el nuevo usuario existe
    let usuarioNuevo = null
    if (usuarioId) {
      usuarioNuevo = await prismadb.usuario.findUnique({
        where: { id: usuarioId }
      })

      if (!usuarioNuevo) {
        return NextResponse.json({ error: 'Usuario destino no encontrado' }, { status: 404 })
      }

      if (usuarioNuevo.estado === 'Deshabilitado') {
        return NextResponse.json({ error: 'No se puede reasignar a un usuario deshabilitado' }, { status: 400 })
      }
    }

    // Crear registro en el historial de reasignaciones
    await prismadb.reasignacionHistorialEquipos.create({
      data: {
        equipoId,
        usuarioAnteriorId: equipoExistente.usuarioId || null,
        usuarioNuevoId: usuarioId || null,
        motivo: motivo?.trim() || null,
        reasignadoPorId: usuarioReasignador.id
      }
    })

    // Actualizar el equipo con el nuevo usuario
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        usuarioId: usuarioId || null
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
      mensaje: 'Equipo reasignado exitosamente'
    }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error reasignando equipo:', error)

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un registro con los mismos datos' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}