import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, marcaId } = body

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'El nombre del modelo es requerido' }, { status: 400 })
    }

    if (!marcaId) {
      return NextResponse.json({ error: 'El ID de la marca es requerido' }, { status: 400 })
    }

    // Verificar si ya existe un modelo con el mismo nombre para esta marca
    const modeloExistente = await prismadb.modelo.findFirst({
      where: {
        AND: [
          {
            nombre: {
              equals: nombre.trim(),
              mode: 'insensitive'
            }
          },
          {
            marcaId: parseInt(marcaId)
          }
        ]
      }
    })

    if (modeloExistente) {
      return NextResponse.json({ modelo: modeloExistente }, { status: 200 })
    }

    // Crear nuevo modelo
    const nuevoModelo = await prismadb.modelo.create({
      data: {
        nombre: nombre.trim(),
        marcaId: parseInt(marcaId)
      }
    })

    return NextResponse.json({ modelo: nuevoModelo }, { status: 201 })

  } catch (error) {
    console.error('Error creando modelo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}