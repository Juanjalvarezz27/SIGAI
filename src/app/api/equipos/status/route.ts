import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const status = await prismadb.status.findMany({
      orderBy: { estado: 'asc' }
    })

    return NextResponse.json({ status })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}