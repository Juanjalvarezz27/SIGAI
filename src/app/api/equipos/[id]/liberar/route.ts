// Liberar equipos
import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipoId = parseInt(params.id);

    // Verificar que el equipo existe
    const equipoExistente = await prismadb.equipos.findUnique({
      where: { id: equipoId },
      include: {
        usuario: true
      }
    });

    if (!equipoExistente) {
      return NextResponse.json(
        { error: 'Equipo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el equipo tenga un usuario asignado
    if (!equipoExistente.usuarioId) {
      return NextResponse.json(
        { error: 'Este equipo no tiene usuario asignado' },
        { status: 400 }
      );
    }

    // Obtener el usuario actual (aquí necesitas implementar tu lógica de autenticación)
    // Por ahora usaremos un valor temporal - debes reemplazar esto con tu lógica real
    const usuarioActualId = 1; // TEMPORAL - reemplazar con ID del usuario autenticado

    // Actualizar el equipo: establecer usuarioId como null
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        usuarioId: null
      },
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
        estado: true,
        status: true,
        especificaciones: true,
        usuario: true
      }
    });

    // Registrar en el historial de reasignaciones
    await prismadb.reasignacionHistorialEquipos.create({
      data: {
        equipoId: equipoId,
        usuarioAnteriorId: equipoExistente.usuarioId,
        usuarioNuevoId: null,
        motivo: 'Liberación de equipo - Usuario removido',
        reasignadoPorId: usuarioActualId,
        fechaReasignacion: new Date()
      }
    });

    return NextResponse.json({
      message: 'Equipo liberado exitosamente',
      equipo: equipoActualizado
    });

  } catch (error) {
    console.error('Error liberando equipo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}