import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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
        tipoTicket: true,
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


export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
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
        }
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}