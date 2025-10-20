import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const estados = await prismadb.estados.findMany({
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json({ estados })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}