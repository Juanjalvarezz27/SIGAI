import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marcaId = searchParams.get('marcaId')

    if (!marcaId) {
      return NextResponse.json({ error: 'marcaId es requerido' }, { status: 400 })
    }

    const modelos = await prismadb.modelo.findMany({
      where: { marcaId: parseInt(marcaId) },
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json({ modelos })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}