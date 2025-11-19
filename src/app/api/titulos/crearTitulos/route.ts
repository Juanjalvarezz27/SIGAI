import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, tipoTicketId } = body

    console.log('Datos recibidos:', { nombre, tipoTicketId })

    if (!nombre || !tipoTicketId) {
      return NextResponse.json(
        { error: 'Nombre y tipo de ticket son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el título ya existe
    const tituloExistente = await prismadb.titulo.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive'
        }
      }
    })

    if (tituloExistente) {
      return NextResponse.json(
        { error: 'Ya existe un título con ese nombre' },
        { status: 400 }
      )
    }

    const nuevoTitulo = await prismadb.titulo.create({
      data: {
        nombre: nombre.trim(),
        tipoTicketId: parseInt(tipoTicketId)
      },
      include: {
        tipoTicket: {
          select: {
            id: true,
            tipo: true
          }
        }
      }
    })

    return NextResponse.json(nuevoTitulo, { status: 201 })
  } catch (error) {
    console.error('Error creating titulo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Agregar GET para evitar error 405
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  )
}