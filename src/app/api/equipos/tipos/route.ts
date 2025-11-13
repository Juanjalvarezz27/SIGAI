//Obtener y crear tipos de equipos
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const tipos = await prismadb.tipoEquipo.findMany({
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json({ tipos })
  } catch (error) {
    console.error('Error obteniendo tipos de equipo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre } = body

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre del tipo es requerido' }, { status: 400 })
    }

    // Verificar si ya existe
    const tipoExistente = await prismadb.tipoEquipo.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive'
        }
      }
    })

    if (tipoExistente) {
      return NextResponse.json({ error: 'Este tipo de equipo ya existe' }, { status: 400 })
    }

    const nuevoTipo = await prismadb.tipoEquipo.create({
      data: { nombre: nombre.trim() }
    })

    return NextResponse.json({ tipo: nuevoTipo }, { status: 201 })
  } catch (error) {
    console.error('Error creando tipo de equipo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}