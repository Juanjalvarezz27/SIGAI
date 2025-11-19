import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// PATCH - Actualizar descripción de un sistema
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos
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

    const { id } = await params
    const sistemaId = parseInt(id)
    
    if (isNaN(sistemaId)) {
      return NextResponse.json(
        { error: 'ID del sistema inválido' },
        { status: 400 }
      )
    }

    const { descripcion } = await request.json()

    // Verificar que el descripción existe en el body
    if (descripcion === undefined) {
      return NextResponse.json(
        { error: 'La descripción es requerida' },
        { status: 400 }
      )
    }

    // Verificar que el sistema existe
    const sistemaExistente = await prisma.sistema.findUnique({
      where: { id: sistemaId }
    })

    if (!sistemaExistente) {
      return NextResponse.json(
        { error: 'Sistema no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar la descripción
    const sistemaActualizado = await prisma.sistema.update({
      where: { id: sistemaId },
      data: {
        descripcion: descripcion.trim()
      }
    })

    return NextResponse.json({ 
      message: 'Descripción actualizada correctamente',
      sistema: sistemaActualizado
    })
  } catch (error) {
    console.error('Error actualizando descripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}