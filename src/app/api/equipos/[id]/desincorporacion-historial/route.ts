//obtener historial de desincorporaciones
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const equipoId = parseInt(id)

    if (isNaN(equipoId)) {
      return NextResponse.json(
        { error: 'ID de equipo inválido' },
        { status: 400 }
      )
    }

    const historial = await prismadb.desincorporacionHistorialEquipos.findMany({
      where: { equipoId },
      include: {
        deshabilitadoPor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        },
        statusAnterior: {
          select: {
            id: true,
            estado: true
          }
        },
        statusNuevo: {
          select: {
            id: true,
            estado: true
          }
        },
        estadoAnterior: {
          select: {
            id: true,
            nombre: true
          }
        },
        estadoNuevo: {
          select: {
            id: true,
            nombre: true
          }
        },
        equipo: {
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
            }
          }
        }
      },
      orderBy: {
        fechaDeshabilitacion: 'desc'
      }
    })

    return NextResponse.json({ historial }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error obteniendo historial de desincorporación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}