import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { titulo, descripcion, tipoTicketId, usuarioAfectadoId, equiposSeleccionados } = await request.json();

    // Validar campos requeridos
    if (!titulo || !descripcion || !tipoTicketId) {
      return NextResponse.json({ 
        error: 'Título, descripción y tipo de ticket son requeridos' 
      }, { status: 400 });
    }

    // Buscar el usuario actual (quien crea el ticket)
    const usuarioActual = await prisma.usuario.findUnique({
      where: { 
        email: session.user.email 
      }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Validar que el usuario afectado existe si se proporcionó
    let usuarioAfectado = null;
    if (usuarioAfectadoId) {
      usuarioAfectado = await prisma.usuario.findUnique({
        where: { 
          id: parseInt(usuarioAfectadoId) 
        },
        include: {
          direccion: {
            include: {
              piso: true
            }
          },
          area: true
        }
      });
      
      if (!usuarioAfectado) {
        return NextResponse.json({ error: 'Usuario afectado no encontrado' }, { status: 400 });
      }
    }

    // Obtener analistas del tipo de ticket solicitado
    const analistas = await prisma.usuario.findMany({
      where: {
        tipoAnalistaId: parseInt(tipoTicketId),
        estado: 'Activo'
      },
      include: {
        ticketCerrado: {
          where: {
            estadoId: { in: [1, 2] } // Solo tickets abiertos o en progreso
          }
        },
        tipoAnalista: true
      }
    });

    if (analistas.length === 0) {
      return NextResponse.json({ 
        error: 'No hay analistas disponibles para este tipo de ticket' 
      }, { status: 400 });
    }

    // Encontrar el analista con menos tickets asignados
    let analistaAsignado = analistas[0];
    let minTickets = analistas[0].ticketCerrado.length;

    for (const analista of analistas) {
      const totalTickets = analista.ticketCerrado.length;
      
      if (totalTickets < minTickets) {
        minTickets = totalTickets;
        analistaAsignado = analista;
      }
    }

    // Si hay empate, elegir aleatoriamente entre los que tienen menos tickets
    const analistasConMenosTickets = analistas.filter(
      analista => analista.ticketCerrado.length === minTickets
    );

    if (analistasConMenosTickets.length > 1) {
      analistaAsignado = analistasConMenosTickets[
        Math.floor(Math.random() * analistasConMenosTickets.length)
      ];
    }

    // Crear el ticket y las relaciones con equipos en una transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Crear el ticket
      const ticket = await tx.ticket.create({
        data: {
          titulo,
          descripcion,
          usuarioCreadorId: usuarioActual.id,
          usuarioCerradorId: analistaAsignado.id,
          usuarioAfectadoId: usuarioAfectado ? usuarioAfectado.id : null,
          estadoId: 1, // Estado "Abierto"
          tipoTicketId: parseInt(tipoTicketId)
        }
      });

      // 2. Crear relaciones con los equipos seleccionados (si existen)
      if (equiposSeleccionados && Array.isArray(equiposSeleccionados) && equiposSeleccionados.length > 0) {
        const ticketEquiposData = equiposSeleccionados.map((equipoId: number) => ({
          ticketId: ticket.id,
          equipoId: equipoId,
          analistaId: analistaAsignado.id
        }));

        await tx.ticketEquipo.createMany({
          data: ticketEquiposData
        });
      }

      return ticket;
    });

    // Obtener el ticket completo con todas las relaciones
    const ticketCompleto = await prisma.ticket.findUnique({
      where: { id: resultado.id },
      include: {
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
        tipoTicket: { 
          select: {
            id: true, 
            tipo: true
          }
        },
        estado: true,
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

    return NextResponse.json(ticketCompleto, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el usuario actual con su dirección y supervisorTipo
    const usuarioActual = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      include: {
        direccion: true,
        rol: true,
        supervisorTipo: true
      }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Usar el tipo correcto de Prisma
    let whereClause: Prisma.TicketWhereInput = {};

    // Filtrar tickets según el rol
    switch (usuarioActual.rolId) {
      case 1: // Admin - ve todos los tickets
        // No aplicar filtros
        break;
      
      case 2: // Supervisor - solo tickets de su dirección Y de su tipo de supervisor
        if (usuarioActual.supervisorTipoId && usuarioActual.direccionId) {
          whereClause = {
            AND: [
              {
                OR: [
                  // Tickets donde el usuario afectado está en la misma dirección
                  {
                    usuarioAfectado: {
                      direccionId: usuarioActual.direccionId
                    }
                  },
                  // O tickets creados por usuarios de la misma dirección
                  {
                    usuarioCreador: {
                      direccionId: usuarioActual.direccionId
                    }
                  }
                ]
              },
              // Solo tickets del tipo que supervisa
              {
                tipoTicketId: usuarioActual.supervisorTipoId
              }
            ]
          };
        } else {
          // Si no tiene supervisorTipoId o dirección, no mostrar tickets
          whereClause = {
            id: -1
          };
        }
        break;
      
      case 3: // Solicitante - solo tickets creados por él O tickets donde el usuario afectado está en su misma dirección
        if (usuarioActual.direccionId) {
          whereClause = {
            OR: [
              // Tickets creados por él
              {
                usuarioCreadorId: usuarioActual.id
              },
              // O tickets donde el usuario afectado está en su misma dirección
              {
                usuarioAfectado: {
                  direccionId: usuarioActual.direccionId
                }
              }
            ]
          };
        } else {
          // Si no tiene dirección, solo mostrar tickets creados por él
          whereClause = {
            usuarioCreadorId: usuarioActual.id
          };
        }
        break;
      
      case 4: // Analista - solo tickets asignados a él
        whereClause = {
          usuarioCerradorId: usuarioActual.id
        };
        break;
      
      default:
        // Por defecto, solo sus tickets creados
        whereClause = {
          usuarioCreadorId: usuarioActual.id
        };
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        estado: true,
        tipoTicket: {
          select: {
            id: true,
            tipo: true
          }
        },
        usuarioCreador: {
          select: {
            nombre: true,
            apellido: true,
            direccion: {
              select: {
                id: true,
                direccion: true,
                piso: {
                  select: {
                    id: true,
                    piso: true
                  }
                }
              }
            }
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
                id: true,
                direccion: true,
                piso: {
                  select: {
                    id: true,
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
        },
        reasignaciones: {
          include: {
            analistaAnterior: {
              select: {
                nombre: true,
                apellido: true
              }
            },
            analistaNuevo: {
              select: {
                nombre: true,
                apellido: true
              }
            },
            supervisor: {
              select: {
                nombre: true,
                apellido: true
              }
            }
          },
          orderBy: {
            fechaReasignacion: 'desc'
          }
        }
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });

    // Procesar los tickets para incluir el tiempo de ejecución formateado
    const ticketsConTiempo = tickets.map(ticket => {
      let tiempoEjecucion = '';

      if (ticket.ticketCierre && ticket.ticketCierre.tiempoEjecucionMinutos) {
        const minutos = ticket.ticketCierre.tiempoEjecucionMinutos;
        const dias = Math.floor(minutos / (60 * 24));
        const horas = Math.floor((minutos % (60 * 24)) / 60);
        const mins = minutos % 60;

        if (dias > 0) {
          tiempoEjecucion = `${dias}d ${horas}h ${mins}m`;
        } else if (horas > 0) {
          tiempoEjecucion = `${horas}h ${mins}m`;
        } else {
          tiempoEjecucion = `${mins}m`;
        }
      }

      return {
        ...ticket,
        tiempoEjecucion,
        ticketReasignaciones: ticket.reasignaciones
      };
    });

    return NextResponse.json(ticketsConTiempo);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}