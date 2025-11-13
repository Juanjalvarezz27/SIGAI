//Actualizar el estado del usuario activo/deshabilitado
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { usuarioId, estado, motivo } = await request.json()

    if (!usuarioId || !estado) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    if (!['Activo', 'Deshabilitado'].includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener el usuario que está realizando la acción
    const usuarioSesion = await prismadb.usuario.findUnique({
      where: { email: session.user.email }
    })

    if (!usuarioSesion) {
      return NextResponse.json({ error: 'Usuario de sesión no encontrado' }, { status: 404 })
    }

    // Verificar que no sea el mismo usuario
    if (usuarioId === usuarioSesion.id && estado === 'Deshabilitado') {
      return NextResponse.json(
        { error: 'No puedes deshabilitarte a ti mismo' },
        { status: 400 }
      )
    }

    // Si se está deshabilitando, validar el motivo
    if (estado === 'Deshabilitado') {
      if (!motivo || motivo.trim().length < 5) {
        return NextResponse.json(
          { error: 'El motivo es obligatorio y debe tener al menos 5 caracteres' },
          { status: 400 }
        )
      }

      // Registrar en el historial
      await prismadb.deshabilitacionHistorial.create({
        data: {
          usuarioId,
          motivo: motivo.trim(),
          deshabilitadoPorId: usuarioSesion.id
        }
      })
    }

    // Actualizar estado del usuario
    const usuarioActualizado = await prismadb.usuario.update({
      where: { id: usuarioId },
      data: { estado },
      include: {
        rol: true,
        direccion: {
          include: {
            piso: true
          }
        },
        area: true,
        equipos: {
          include: {
            tipoEquipo: true,
            modelo: {
              include: {
                marca: true
              }
            },
            status: true,
            estado: true,
            especificaciones: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: `Usuario ${estado === 'Activo' ? 'habilitado' : 'deshabilitado'} correctamente`,
      usuario: usuarioActualizado
    })

  } catch (error: unknown) {
    console.error('Error actualizando estado del usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}