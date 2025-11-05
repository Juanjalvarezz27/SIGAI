import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

interface DeshabilitarEquipoRequest {
  motivo: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar autenticación y permisos
    if (!session?.user?.id || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Await the params before using them
    const { id } = await params
    const equipoId = parseInt(id)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: 'ID de equipo inválido' }, { status: 400 })
    }

    const body: DeshabilitarEquipoRequest = await request.json()
    const { motivo } = body

    if (!motivo || motivo.trim().length < 5) {
      return NextResponse.json(
        { error: 'El motivo es obligatorio y debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el equipo existe
    const equipoExistente = await prismadb.equipos.findUnique({
      where: { id: equipoId },
      include: {
        status: true,
        estado: true
      }
    })

    if (!equipoExistente) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Verificar si ya está deshabilitado (Status Desincorporados - ID 3)
    if (equipoExistente.statusId === 3) {
      return NextResponse.json({ error: 'El equipo ya está deshabilitado' }, { status: 400 })
    }

    // Buscar el status "Desincorporados" (ID 3)
    const statusDesincorporados = await prismadb.status.findUnique({
      where: { id: 3 }
    })

    if (!statusDesincorporados) {
      return NextResponse.json({ error: 'Status de desincorporación no encontrado' }, { status: 500 })
    }

    // Buscar el estado "Sin uso" (ID 2)
    const estadoSinUso = await prismadb.estados.findUnique({
      where: { id: 2 }
    })

    if (!estadoSinUso) {
      return NextResponse.json({ error: 'Estado "Sin uso" no encontrado' }, { status: 500 })
    }

    // Actualizar el equipo a status "Desincorporados" y estado "Sin uso"
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        statusId: 3, // Desincorporados
        estadoId: 2  // Sin uso
      },
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
        status: true,
        estado: true,
        especificaciones: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        }
      }
    })

    // Asegurar que statusAnteriorId no sea null
    const statusAnteriorId = equipoExistente.statusId
    if (!statusAnteriorId) {
      return NextResponse.json(
        { error: 'No se puede determinar el status anterior del equipo' },
        { status: 400 }
      )
    }

    // Crear registro en el historial de deshabilitación de equipos
    await prismadb.desincorporacionHistorialEquipos.create({
      data: {
        equipoId: equipoId,
        motivo: motivo.trim(),
        deshabilitadoPorId: parseInt(session.user.id),
        statusAnteriorId: statusAnteriorId,
        statusNuevoId: 3,
        estadoAnteriorId: equipoExistente.estadoId || null, // Guardar estado anterior
        estadoNuevoId: 2 // Siempre será "Sin uso" (ID 2)
      }
    })

    return NextResponse.json({
      equipo: equipoActualizado,
      message: 'Equipo deshabilitado correctamente'
    }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error deshabilitando equipo:', error)

    // Manejar errores específicos de Prisma
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string }
      if (prismaError.code === 'P2025') {
        return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}