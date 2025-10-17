import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin o supervisor
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const rolId = searchParams.get('rolId')
    const pisoId = searchParams.get('pisoId')
    const direccionId = searchParams.get('direccionId')

    // Validar parámetros
    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Construir where clause
    const whereClause: Prisma.UsuarioWhereInput = {}

    // Filtro por rol y estado
    if (rolId === 'deshabilitados') {
      // Mostrar todos los usuarios deshabilitados sin importar rol
      whereClause.estado = 'Deshabilitado'
    } else if (rolId === 'todos' || rolId === 'null') {
      // Mostrar todos los usuarios activos (no filtrar por rol)
      whereClause.estado = 'Activo'
    } else if (rolId) {
      // Mostrar usuarios activos del rol específico
      whereClause.rolId = parseInt(rolId)
      whereClause.estado = 'Activo'
    } else {
      // Por defecto mostrar solo activos
      whereClause.estado = 'Activo'
    }

    // Manejar múltiples pisos
    if (searchParams.has('pisoIds')) {
      const pisoIds = searchParams.getAll('pisoIds').map(id => parseInt(id)).filter(id => !isNaN(id))
      if (pisoIds.length > 0) {
        whereClause.direccion = {
          pisoId: {
            in: pisoIds
          }
        }
      }
    } else if (pisoId) {
      // Filtro individual de piso (mantener compatibilidad)
      const pisoIdNum = parseInt(pisoId)
      if (!isNaN(pisoIdNum)) {
        whereClause.direccion = {
          pisoId: pisoIdNum
        }
      }
    }

    // Filtro por dirección individual
    if (direccionId) {
      const direccionIdNum = parseInt(direccionId)
      if (!isNaN(direccionIdNum)) {
        whereClause.direccionId = direccionIdNum
      }
    }

    // Obtener usuarios con paginación
    const [usuarios, totalCount] = await Promise.all([
      prismadb.usuario.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          nombre: true,
          apellido: true,
          cedula: true,
          email: true,
          estado: true,
          rol: {
            select: {
              id: true,
              rol: true
            }
          },
          direccion: {
            select: {
              direccion: true,
              piso: {
                select: {
                  piso: true
                }
              }
            }
          },
          area: {
            select: {
              nombre: true
            }
          },
          equipos: {
            select: {
              id: true,
              bienNacional: true,
              serial: true,
              tipoEquipo: {
                select: {
                  nombre: true
                }
              },
              modelo: {
                select: {
                  nombre: true,
                  marca: {
                    select: {
                      nombre: true
                    }
                  }
                }
              },
              status: {
                select: {
                  estado: true
                }
              },
              estado: {
                select: {
                  nombre: true
                }
              },
              especificaciones: {
                select: {
                  memoriaRam: true,
                  capacidadDisco: true,
                  tipoDisco: true,
                  procesador: true
                }
              }
            }
          }
        },
        orderBy: [
          { nombre: 'asc' },
          { apellido: 'asc' }
        ]
      }),
      prismadb.usuario.count({
        where: whereClause
      })
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