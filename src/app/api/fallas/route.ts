import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const fallas = await prisma.falla.findMany({
      orderBy: {
        nombre: 'asc'
      }
    })

    return NextResponse.json(fallas)
  } catch (error) {
    console.error('Error fetching fallas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}