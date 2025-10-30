import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const sistemas = await prisma.sistema.findMany({
      where: {
        estado: 'Activo'
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    return NextResponse.json(sistemas)
  } catch (error) {
    console.error('Error fetching sistemas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}