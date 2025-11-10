import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// PATCH - Cambiar estado del sistema (Activo/Inactivo)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const sistemaId = parseInt(id)

    if (isNaN(sistemaId)) {
      return NextResponse.json(
        { error: 'ID del sistema inválido' },
        { status: 400 }
      )
    }

    // Verificar si el sistema existe
    const sistemaExistente = await prisma.sistema.findUnique({
      where: { id: sistemaId }
    })

    if (!sistemaExistente) {
      return NextResponse.json(
        { error: 'Sistema no encontrado' },
        { status: 404 }
      )
    }

    // Cambiar el estado (toggle)
    const nuevoEstado = sistemaExistente.estado === 'Activo' ? 'Inactivo' : 'Activo'

    const sistemaActualizado = await prisma.sistema.update({
      where: { id: sistemaId },
      data: { estado: nuevoEstado }
    })

    return NextResponse.json({
      message: `Sistema ${nuevoEstado.toLowerCase()} correctamente`,
      sistema: sistemaActualizado
    })
  } catch (error) {
    console.error('Error actualizando estado del sistema:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET - Obtener sistema específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const sistemaId = parseInt(id)

    if (isNaN(sistemaId)) {
      return NextResponse.json(
        { error: 'ID del sistema inválido' },
        { status: 400 }
      )
    }

    const sistema = await prisma.sistema.findUnique({
      where: { id: sistemaId }
    })

    if (!sistema) {
      return NextResponse.json(
        { error: 'Sistema no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(sistema)
  } catch (error) {
    console.error('Error fetching sistema:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}