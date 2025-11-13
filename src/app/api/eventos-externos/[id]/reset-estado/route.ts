//Regresar a en progreso los tickets
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

    // Actualizar el estado del evento a "En proceso" y eliminar el estado detalle
    const eventoActualizado = await prisma.$transaction(async (tx) => {
      // Actualizar el estado del evento
      const evento = await tx.eventoExterno.update({
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
          }
        }
      });

      // Eliminar el registro de estado detallado si existe
      await tx.eventoExternoEstado.deleteMany({
        where: { eventoId: parseInt(id) }
      });

      return evento;
    });

    return NextResponse.json(eventoActualizado);
  } catch (error) {
    console.error('Error resetando estado del evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}