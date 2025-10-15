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

    const { usuarioId, estado } = await request.json()

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

    // Actualizar estado
    const usuarioActualizado = await prismadb.usuario.update({
      where: { id: usuarioId },
      data: { estado },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        estado: true,
        rol: {
          select: {
            id: true,
            rol: true
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