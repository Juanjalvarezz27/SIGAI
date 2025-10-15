import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Validar parámetros
    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Obtener usuarios con paginación
    const [usuarios, totalCount] = await Promise.all([
      prismadb.usuario.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          nombre: true,
          apellido: true,
          cedula: true,
          email: true,
          rol: {
            select: {
              id: true,
              rol: true
            }
          },
          direccion: {
            select: {
              direccion: true
            }
          },
          area: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: [
          { nombre: 'asc' },
          { apellido: 'asc' }
        ]
      }),
      prismadb.usuario.count()
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      usuarios,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    })

  } catch (error: unknown) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}