import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// GET - Obtener todos los sistemas
export async function GET(request: NextRequest) {
  try {
    const sistemas = await prisma.sistema.findMany({
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

// POST - Crear un nuevo sistema
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin O supervisor de sistemas (supervisorTipoId 3)
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      include: { 
        rol: true,
        supervisorTipo: true
      }
    })

    if (!usuario || 
        !(usuario.rolId === 1 || // Admin
          (usuario.rolId === 2 && usuario.supervisorTipoId === 3)) // Supervisor de Sistemas
    ) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 })
    }

    const { nombre } = await request.json()

    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: 'El nombre del sistema es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el sistema ya existe
    const sistemaExistente = await prisma.sistema.findUnique({
      where: { nombre: nombre.trim() }
    })

    if (sistemaExistente) {
      return NextResponse.json(
        { error: 'Ya existe un sistema con ese nombre' },
        { status: 400 }
      )
    }

    // Crear el nuevo sistema
    const nuevoSistema = await prisma.sistema.create({
      data: {
        nombre: nombre.trim(),
        estado: 'Activo'
      }
    })

    return NextResponse.json(nuevoSistema, { status: 201 })
  } catch (error) {
    console.error('Error creating sistema:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}