import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { ticketId, analistaNuevoId, motivo } = await request.json();

    // Validar campos requeridos
    if (!ticketId || !analistaNuevoId) {
      return NextResponse.json({
        error: 'Ticket ID y analista nuevo son requeridos'
      }, { status: 400 });
    }

    // Obtener el usuario actual (quien reasigna)
    const usuarioActual = await prismadb.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el ticket existe
    const ticket = await prismadb.ticket.findUnique({
      where: { id: parseInt(ticketId) },
      include: {
        usuarioCerrador: true,
        tipoTicket: true
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    // Parsear el ID del nuevo analista (puede ser analista-{id} o supervisor-{id})
    const [tipoUsuario, idUsuario] = analistaNuevoId.split('-');
    const nuevoAnalistaId = parseInt(idUsuario);

    if (!nuevoAnalistaId) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }

    // Verificar que el nuevo usuario existe
    const nuevoUsuario = await prismadb.usuario.findUnique({
      where: { id: nuevoAnalistaId }
    });

    if (!nuevoUsuario) {
      return NextResponse.json({ error: 'Usuario destino no encontrado' }, { status: 404 });
    }

    // Realizar la reasignación en una transacción
    const resultado = await prismadb.$transaction(async (tx) => {
      // 1. Crear registro en TicketReasignacion
      const reasignacion = await tx.ticketReasignacion.create({
        data: {
          ticketId: parseInt(ticketId),
          analistaAnteriorId: ticket.usuarioCerradorId!,
          analistaNuevoId: nuevoAnalistaId,
          supervisorId: usuarioActual.id,
          motivo: motivo || null
        }
      });

      // NUEVO: Eliminar notificación del usuario anterior
      await tx.notification.deleteMany({
        where: {
          userId: ticket.usuarioCerradorId!, // Usuario anterior
          relatedId: parseInt(ticketId),
          type: 'TICKET_ASSIGNED'
        }
      });

      // NUEVO: Crear notificación para el usuario nuevo
      await tx.notification.create({
        data: {
          userId: nuevoAnalistaId, // Usuario nuevo
          type: 'TICKET_REASSIGNED',
          title: 'Ticket reasignado',
          message: `Se te ha reasignado el ticket: "${ticket.titulo}"`,
          relatedId: parseInt(ticketId),
          read: false
        }
      });

      // 2. Actualizar el ticket con el nuevo analista
      const ticketActualizado = await tx.ticket.update({
        where: { id: parseInt(ticketId) },
        data: {
          usuarioCerradorId: nuevoAnalistaId
        },
        include: {
          estado: true,
          tipoTicket: true,
          usuarioCreador: {
            select: {
              nombre: true,
              apellido: true
            }
          },
          usuarioCerrador: {
            select: {
              nombre: true,
              apellido: true,
              tipoAnalista: {
                select: {
                  tipo: true
                }
              }
            }
          },
          usuarioAfectado: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              cedula: true,
              email: true,
              direccion: {
                select: {
                  direccion: true,
                  piso: {
                    select: {
                      piso: true
                    }
                  }
                }
              },
              area: {
                select: {
                  nombre: true
                }
              }
            }
          },
          ticketEquipos: {
            include: {
              equipo: {
                include: {
                  tipoEquipo: { select: { nombre: true } },
                  modelo: {
                    include: {
                      marca: { select: { nombre: true } }
                    }
                  },
                  status: { select: { estado: true } },
                  especificaciones: {
                    select: {
                      memoriaRam: true,
                      capacidadDisco: true,
                      tipoDisco: true,
                      procesador: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      return { reasignacion, ticketActualizado };
    });

    return NextResponse.json(resultado.ticketActualizado, { status: 200 });

  } catch (error) {
    console.error('Error reasignando ticket:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}