import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

interface ActualizarDatosRequest {
  usuarioId: number
  cedula?: string | null
  email?: string | null
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: ActualizarDatosRequest = await request.json()
    const { usuarioId, cedula, email } = body

    // Validaciones
    if (!usuarioId) {
      return NextResponse.json({ error: 'ID de usuario es requerido' }, { status: 400 })
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, email: true, cedula: true }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Preparar datos para actualizar
    const datosActualizar: {
      cedula?: string | null
      email?: string | null
    } = {}

    // Solo actualizar cédula si se proporciona
    if (cedula !== undefined) {
      datosActualizar.cedula = cedula
    }

    // Solo actualizar email si se proporciona y validar que no esté en uso
    if (email !== undefined) {
      if (email && email !== usuarioExistente.email) {
        const emailExistente = await prismadb.usuario.findUnique({
          where: { email }
        })

        if (emailExistente && emailExistente.id !== usuarioId) {
          return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
        }
      }
      datosActualizar.email = email
    }

    // Si no hay nada que actualizar
    if (Object.keys(datosActualizar).length === 0) {
      return NextResponse.json({ error: 'No hay datos para actualizar' }, { status: 400 })
    }

    // Actualizar usuario
    await prismadb.usuario.update({
      where: { id: usuarioId },
      data: datosActualizar
    })

    return NextResponse.json({ message: 'Datos actualizados correctamente' })

  } catch (error: unknown) {
    console.error('Error actualizando datos del usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}