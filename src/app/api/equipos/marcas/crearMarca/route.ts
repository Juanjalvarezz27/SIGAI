import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre } = body

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'El nombre de la marca es requerido' }, { status: 400 })
    }

    // Verificar si ya existe una marca con el mismo nombre
    const marcaExistente = await prismadb.marca.findFirst({
      where: {
        nombre: {
          equals: nombre.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (marcaExistente) {
      return NextResponse.json({ marca: marcaExistente }, { status: 200 })
    }

    // Crear nueva marca
    const nuevaMarca = await prismadb.marca.create({
      data: {
        nombre: nombre.trim()
      }
    })

    return NextResponse.json({ marca: nuevaMarca }, { status: 201 })

  } catch (error) {
    console.error('Error creando marca:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}