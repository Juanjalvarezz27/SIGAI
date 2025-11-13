//obtener las marcas
import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const marcas = await prismadb.marca.findMany({
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json({ marcas })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}