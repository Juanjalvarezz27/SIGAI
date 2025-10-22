import { NextRequest, NextResponse } from 'next/server'
import prismadb from '../../../../../lib/prismadb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipoId = parseInt(params.id)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: 'ID de equipo inválido' }, { status: 400 })
    }

    const body = await request.json()
    const { usuarioId } = body

    if (!usuarioId) {
      return NextResponse.json({ error: 'ID de usuario es requerido' }, { status: 400 })
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

    // Verificar si el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Actualizar el equipo con el nuevo usuario
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        usuarioId: usuarioId
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

    // Manejar errores específicos de prismadb
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismadbError = error as { code: string }
      if (prismadbError.code === 'P2002') {
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