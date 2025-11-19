import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const tituloId = parseInt(id)

    // Verificar si el título existe
    const titulo = await prismadb.titulo.findUnique({
      where: { id: tituloId }
    })

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si hay tickets usando este título
    const ticketsConEsteTitulo = await prismadb.ticket.findFirst({
      where: {
        titulo: titulo.nombre
      }
    })

    if (ticketsConEsteTitulo) {
      return NextResponse.json(
        { error: 'No se puede eliminar el título porque está siendo usado en tickets existentes' },
        { status: 400 }
      )
    }

    await prismadb.titulo.delete({
      where: { id: tituloId }
    })

    return NextResponse.json({ message: 'Título eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting titulo:', error)
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