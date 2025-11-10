import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Obtener el usuario que realiza la acción
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el evento existe y obtener su dirección
    const eventoExistente = await prisma.eventoExterno.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        direccionId: true
      }
    });

    if (!eventoExistente) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    // Si el usuario es solicitante (rolId 3), verificar que el evento sea de su dirección
    if (usuario.rolId === 3 && eventoExistente.direccionId !== usuario.direccionId) {
      return NextResponse.json({
        error: 'No tienes permisos para modificar este evento'
      }, { status: 403 });
    }

    // Actualizar el estado del evento a "En proceso"
    const eventoActualizado = await prisma.eventoExterno.update({
      where: { id: parseInt(id) },
      data: { estado: 'En proceso' },
      include: {
        usuarioSolicitante: {
          select: { nombre: true, apellido: true }
        },
        usuarioAsignado: {
          select: { nombre: true, apellido: true }
        },
        direccion: {
          include: {
            piso: true
          }
        },
        equiposEvento: {
          include: {
            tipoEquipo: {
              select: { nombre: true }
            }
          }
        },
        estadoDetalle: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true }
            }
          }
        }
      }
    });

    return NextResponse.json(eventoActualizado);
  } catch (error) {
    console.error('Error reseteando estado del evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}