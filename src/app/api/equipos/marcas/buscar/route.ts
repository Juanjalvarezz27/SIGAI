import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    const marcas = await prismadb.marca.findMany({
      where: {
        nombre: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json({ marcas })
  } catch (error) {
    console.error('Error buscando marcas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}