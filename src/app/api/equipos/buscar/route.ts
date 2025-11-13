//barra de busqueda de equipos
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const tipo = searchParams.get('tipo') || 'usuario'

    if (!query) {
      return NextResponse.json({ equipos: [] })
    }

    // Validar longitud mínima en el servidor también
    if (query.trim().length < 3) {
      return NextResponse.json({ 
        equipos: [],
        error: 'La búsqueda debe tener al menos 3 caracteres'
      })
    }

    let whereClause = {}

    switch (tipo) {
      case 'usuario':
        // Separar nombre y apellido si hay espacio
        const partes = query.trim().split(' ')
        const nombre = partes[0] || ''
        const apellido = partes[1] || ''

        if (apellido) {
          // Si hay apellido, buscar nombre que empiece con el nombre Y apellido que empiece con el apellido
          whereClause = {
            usuario: {
              AND: [
                { nombre: { startsWith: nombre, mode: 'insensitive' } },
                { apellido: { startsWith: apellido, mode: 'insensitive' } }
              ]
            }
          }
        } else {
          // Si solo hay nombre, buscar nombre que empiece con el texto
          whereClause = {
            usuario: {
              OR: [
                { nombre: { startsWith: nombre, mode: 'insensitive' } },
                { apellido: { startsWith: nombre, mode: 'insensitive' } }
              ]
            }
          }
        }
        break

      case 'bienNacional':
        whereClause = {
          bienNacional: { startsWith: query, mode: 'insensitive' }
        }
        break

      case 'serial':
        whereClause = {
          serial: { startsWith: query, mode: 'insensitive' }
        }
        break

      default:
        whereClause = {
          OR: [
            { serial: { startsWith: query, mode: 'insensitive' } },
            { bienNacional: { startsWith: query, mode: 'insensitive' } },
            { 
              usuario: {
                OR: [
                  { nombre: { startsWith: query, mode: 'insensitive' } },
                  { apellido: { startsWith: query, mode: 'insensitive' } }
                ]
              }
            }
          ]
        }
    }

    const equipos = await prismadb.equipos.findMany({
      where: whereClause,
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
        status: true,
        estado: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        },
        especificaciones: true
      },
      take: 10
    })

    return NextResponse.json({ equipos })
  } catch (error) {
    console.error('Error buscando equipos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}