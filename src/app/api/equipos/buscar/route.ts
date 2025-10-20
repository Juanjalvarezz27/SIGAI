import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ equipos: [] })
    }

    const equipos = await prismadb.equipos.findMany({
      where: {
        OR: [
          { serial: { contains: query, mode: 'insensitive' } },
          { bienNacional: { contains: query, mode: 'insensitive' } },
          { usuario: { 
            OR: [
              { nombre: { contains: query, mode: 'insensitive' } },
              { apellido: { contains: query, mode: 'insensitive' } },
              { cedula: { contains: query, mode: 'insensitive' } }
            ]
          }},
          { modelo: { nombre: { contains: query, mode: 'insensitive' } } },
          { tipoEquipo: { nombre: { contains: query, mode: 'insensitive' } } }
        ]
      },
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