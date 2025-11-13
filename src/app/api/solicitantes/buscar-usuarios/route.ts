//Barra de busqueda en solicitantes
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener el usuario actual (solicitante) con su dirección
    const usuarioActual = await prismadb.usuario.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        direccionId: true,
        rolId: true
      }
    })

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que sea solicitante
    if (usuarioActual.rolId !== 3) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que tenga dirección asignada
    if (!usuarioActual.direccionId) {
      return NextResponse.json({ usuarios: [] })
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

    // Construir condiciones de búsqueda
    let condicionesBusqueda: Prisma.UsuarioWhereInput[] = []

    // Si solo hay una palabra, buscar en nombre o apellido
    if (palabras.length === 1) {
      const palabra = palabras[0]
      const palabraNormalizada = palabrasNormalizadas[0]

      condicionesBusqueda = [
        {
          OR: [
            {
              nombre: {
                contains: palabra,
                mode: 'insensitive'
              }
            },
            {
              apellido: {
                contains: palabra,
                mode: 'insensitive'
              }
            },
            {
              nombre: {
                contains: palabraNormalizada,
                mode: 'insensitive'
              }
            },
            {
              apellido: {
                contains: palabraNormalizada,
                mode: 'insensitive'
              }
            },
            {
              cedula: {
                contains: palabra,
                mode: 'insensitive'
              }
            }
          ]
        }
      ]
    } else {
      // Para múltiples palabras, buscar combinaciones
      condicionesBusqueda = []

      // Combinación 1: buscar cada palabra individualmente en nombre o apellido
      const condicionesIndividuales: Prisma.UsuarioWhereInput[] = palabras.map(palabra => ({
        OR: [
          { nombre: { contains: palabra, mode: 'insensitive' } },
          { apellido: { contains: palabra, mode: 'insensitive' } },
          { cedula: { contains: palabra, mode: 'insensitive' } }
        ]
      }))

      condicionesBusqueda.push({
        AND: condicionesIndividuales
      })

      // También buscar la primera palabra en nombre y la segunda en apellido
      if (palabras.length >= 2) {
        condicionesBusqueda.push({
          AND: [
            {
              OR: [
                { nombre: { contains: palabras[0], mode: 'insensitive' } },
                { nombre: { contains: palabrasNormalizadas[0], mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { apellido: { contains: palabras[1], mode: 'insensitive' } },
                { apellido: { contains: palabrasNormalizadas[1], mode: 'insensitive' } }
              ]
            }
          ]
        })

        // Y viceversa
        condicionesBusqueda.push({
          AND: [
            {
              OR: [
                { nombre: { contains: palabras[1], mode: 'insensitive' } },
                { nombre: { contains: palabrasNormalizadas[1], mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { apellido: { contains: palabras[0], mode: 'insensitive' } },
                { apellido: { contains: palabrasNormalizadas[0], mode: 'insensitive' } }
              ]
            }
          ]
        })
      }
    }

    const usuarios = await prismadb.usuario.findMany({
      where: {
        AND: [
          {
            OR: condicionesBusqueda
          },
          // FILTRAR SOLO USUARIOS DE LA MISMA DIRECCIÓN
          {
            direccionId: usuarioActual.direccionId
          },
          // Excluir al usuario actual
          {
            id: {
              not: usuarioActual.id
            }
          }
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
            id: true,
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
    console.error('Error buscando usuarios para solicitante:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}