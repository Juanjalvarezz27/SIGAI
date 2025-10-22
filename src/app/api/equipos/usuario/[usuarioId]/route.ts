import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(await params.usuarioId)

    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 })
    }

    const equipos = await prismadb.equipos.findMany({
      where: {
        usuarioId: usuarioId
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
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json({ equipos })
  } catch (error) {
    console.error('Error obteniendo equipos del usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}