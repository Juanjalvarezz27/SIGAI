//Trae el rol de los usaurios
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prismadb.usuario.findUnique({
      where: { email: session.user.email },
      select: {
        rolId: true,
        rol: {
          select: { rol: true }
        },
        supervisorTipoId: true,
        supervisorTipo: {
          select: {
            id: true,
            tipo: true
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      rolId: usuario.rolId,
      rol: usuario.rol.rol,
      supervisorTipoId: usuario.supervisorTipoId,
      supervisorTipo: usuario.supervisorTipo
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}