import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    // Obtener equipos que no tienen usuario asignado (usuarioId es null)
    const equiposLibres = await prismadb.equipos.findMany({
      where: {
        usuarioId: null
      },
      include: {
        tipoEquipo: {
          select: { 
            id: true,
            nombre: true 
          }
        },
        modelo: {
          include: {
            marca: {
              select: { 
                id: true,
                nombre: true 
              }
            }
          }
        },
        status: {
          select: { 
            id: true,
            estado: true 
          }
        },
        estado: {
          select: { 
            id: true,
            nombre: true 
          }
        },
        especificaciones: {
          select: {
            id: true,
            memoriaRam: true,
            modulosRam: true,
            capacidadDisco: true,
            tipoDisco: true,
            procesador: true
          }
        }
      },
      orderBy: [
        { tipoEquipoId: 'asc' },
        { id: 'asc' }
      ]
    })

    return NextResponse.json({ 
      equipos: equiposLibres,
      total: equiposLibres.length
    })
    
  } catch (error) {
    console.error('Error obteniendo equipos libres:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}