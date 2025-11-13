//Obtener los roles disponibles en la base de datos
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

    // Obtener todos los roles de la base de datos
    const roles = await prismadb.rol.findMany({
      where: {
        // Excluir el rol de admin (id: 1) ya que solo debe haber un admin
        id: { not: 1 }
      },
      select: {
        id: true,
        rol: true
      },
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json({ roles })

  } catch (error: unknown) {
    console.error('Error obteniendo roles:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}