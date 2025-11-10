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

    const { ticketId, condicion, memoFinalizacion, observaciones } = await request.json();

    // Validar campos requeridos
    if (!ticketId || !condicion || !memoFinalizacion) {
      return NextResponse.json({
        error: 'Ticket ID, condición y memo de finalización son requeridos'
      }, { status: 400 });
    }

    // Verificar que el ticket existe y está abierto
    const ticket = await prismadb.ticket.findUnique({
      where: { id: parseInt(ticketId) },
      include: {
        estado: true,
        usuarioCerrador: true,
        usuarioCreador: true
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    if (ticket.estadoId === 2) { // Estado "Cerrado"
      return NextResponse.json({ error: 'El ticket ya está cerrado' }, { status: 400 });
    }

    if (!ticket.usuarioCerradorId) {
      return NextResponse.json({ error: 'No hay analista asignado al ticket' }, { status: 400 });
    }

    // Obtener el usuario actual (quien cierra el ticket)
    const usuarioActual = await prismadb.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Calcular tiempo de ejecución en minutos
    const fechaCreacion = new Date(ticket.fecha_creacion);
    const fechaCierre = new Date();
    const tiempoEjecucionMs = fechaCierre.getTime() - fechaCreacion.getTime();
    const tiempoEjecucionMinutos = Math.floor(tiempoEjecucionMs / (1000 * 60));

    // Realizar el cierre en una transacción
    const resultado = await prismadb.$transaction(async (tx) => {
      // 1. Crear registro en TicketCierre
      const ticketCierre = await tx.ticketCierre.create({
        data: {
          ticketId: parseInt(ticketId),
          usuarioCerradorId: ticket.usuarioCerradorId!,
          condicion,
          memoFinalizacion,
          observaciones: observaciones || null,
          tiempoEjecucionMinutos // Guardar el tiempo en la base de datos
        }
      });

      // 🔔 NUEVO: Obtener todos los usuarios admin (rolId: 1)
      const usuariosAdmin = await tx.usuario.findMany({
        where: {
          rolId: 1, // Rol admin
          estado: 'Activo'
        },
        select: {
          id: true
        }
      });

      // 🔔 NUEVO: Crear notificaciones para todos los administradores
      if (usuariosAdmin.length > 0) {
        const notificacionesAdmin = usuariosAdmin.map(admin => ({
          userId: admin.id,
          type: 'TICKET_CLOSED',
          title: 'Ticket cerrado',
          message: `El analista ${usuarioActual.nombre} ${usuarioActual.apellido} ha cerrado el ticket: "${ticket.titulo}"`,
          relatedId: parseInt(ticketId),
          read: false
        }));

        await tx.notification.createMany({
          data: notificacionesAdmin
        });
      }

      // 2. Actualizar el ticket a estado "Cerrado" (id: 2)
      const ticketActualizado = await tx.ticket.update({
        where: { id: parseInt(ticketId) },
        data: {
          estadoId: 2, // Estado "Cerrado"
          fecha_cierre: fechaCierre
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
          },
          ticketCierre: {
            include: {
              usuarioCerrador: {
                select: {
                  nombre: true,
                  apellido: true
                }
              }
            }
          }
        }
      });

      return { ticketCierre, ticketActualizado };
    });

    return NextResponse.json(resultado.ticketActualizado, { status: 200 });

  } catch (error) {
    console.error('Error closing ticket:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}