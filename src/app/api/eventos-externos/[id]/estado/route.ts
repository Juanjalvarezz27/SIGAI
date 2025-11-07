import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';
import { CambioEstadoData } from '../../../../../../types/eventos';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body: CambioEstadoData = await request.json();
    const { estado, motivo } = body;

    // Validar que el estado sea uno de los permitidos
    const estadosPermitidos = ['Aceptado', 'Rechazado'];
    if (!estadosPermitidos.includes(estado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

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

    // Actualizar el estado del evento y crear el registro de estado
    const resultado = await prisma.$transaction(async (tx) => {
      // Actualizar el estado del evento
      const eventoActualizado = await tx.eventoExterno.update({
        where: { id: parseInt(id) },
        data: { estado },
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

      // Crear o actualizar el registro de estado
      await tx.eventoExternoEstado.upsert({
        where: { eventoId: parseInt(id) },
        update: {
          estado,
          motivo,
          usuarioId: usuario.id,
          fecha: new Date()
        },
        create: {
          eventoId: parseInt(id),
          estado,
          motivo,
          usuarioId: usuario.id
        }
      });

      return eventoActualizado;
    });

    // Obtener el evento completo con el detalle del estado actualizado
    const eventoCompleto = await prisma.eventoExterno.findUnique({
      where: { id: parseInt(id) },
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

    return NextResponse.json(eventoCompleto);
  } catch (error) {
    console.error('Error actualizando estado del evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}