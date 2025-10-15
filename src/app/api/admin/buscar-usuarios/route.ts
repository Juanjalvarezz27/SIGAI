import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim() || query.length < 3) {
      return NextResponse.json({ usuarios: [] })
    }

    // Normalizar y dividir la consulta en palabras
    const palabras = query.trim().toLowerCase().split(/\s+/).filter(palabra => palabra.length > 0)
    const palabrasNormalizadas = palabras.map(palabra =>
      palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )

    // Si solo hay una palabra, buscar en nombre o apellido
    if (palabras.length === 1) {
      const palabra = palabras[0]
      const palabraNormalizada = palabrasNormalizadas[0]

      const usuarios = await prismadb.usuario.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  nombre: {
                    startsWith: palabra,
                    mode: 'insensitive'
                  }
                },
                {
                  apellido: {
                    startsWith: palabra,
                    mode: 'insensitive'
                  }
                },
                {
                  nombre: {
                    startsWith: palabraNormalizada,
                    mode: 'insensitive'
                  }
                },
                {
                  apellido: {
                    startsWith: palabraNormalizada,
                    mode: 'insensitive'
                  }
                }
              ]
            },
            { rolId: { not: 1 } }
          ]
        },
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
        take: 25
      })

      return NextResponse.json({ usuarios })
    }

    // Crear condiciones tipadas para múltiples palabras
    const condicionesCombinadas: Prisma.UsuarioWhereInput[] = []

    // Combinación 1: primera palabra en nombre, segunda en apellido
    condicionesCombinadas.push({
      AND: [
        {
          OR: [
            { nombre: { startsWith: palabras[0], mode: 'insensitive' } },
            { nombre: { startsWith: palabrasNormalizadas[0], mode: 'insensitive' } }
          ]
        },
        {
          OR: [
            { apellido: { startsWith: palabras[1], mode: 'insensitive' } },
            { apellido: { startsWith: palabrasNormalizadas[1], mode: 'insensitive' } }
          ]
        }
      ]
    })

    // Combinación 2: primera palabra en apellido, segunda en nombre
    condicionesCombinadas.push({
      AND: [
        {
          OR: [
            { apellido: { startsWith: palabras[0], mode: 'insensitive' } },
            { apellido: { startsWith: palabrasNormalizadas[0], mode: 'insensitive' } }
          ]
        },
        {
          OR: [
            { nombre: { startsWith: palabras[1], mode: 'insensitive' } },
            { nombre: { startsWith: palabrasNormalizadas[1], mode: 'insensitive' } }
          ]
        }
      ]
    })

    // Para 3 o más palabras, buscar cada palabra individualmente
    if (palabras.length >= 3) {
      const condicionesMultiplesPalabras: Prisma.UsuarioWhereInput[] = []

      // Agregar condiciones para cada palabra
      palabras.forEach((palabra, index) => {
        const palabraNormalizada = palabrasNormalizadas[index]
        condicionesMultiplesPalabras.push({
          OR: [
            { nombre: { startsWith: palabra, mode: 'insensitive' } },
            { apellido: { startsWith: palabra, mode: 'insensitive' } },
            { nombre: { startsWith: palabraNormalizada, mode: 'insensitive' } },
            { apellido: { startsWith: palabraNormalizada, mode: 'insensitive' } }
          ]
        })
      })

      condicionesCombinadas.push({
        AND: condicionesMultiplesPalabras
      })
    }

    const usuarios = await prismadb.usuario.findMany({
      where: {
        AND: [
          {
            OR: condicionesCombinadas
          },
          { rolId: { not: 1 } }
        ]
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        email: true,
        estado: true, // Este ya estaba incluido
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
      take: 25,
      orderBy: [
        { nombre: 'asc' },
        { apellido: 'asc' }
      ]
    })

    return NextResponse.json({ usuarios })

  } catch (error: unknown) {
    console.error('Error buscando usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}