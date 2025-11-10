import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prismadb';
import { authOptions } from '@/lib/auth';
import { CreateEventoData, EquipoSeleccionado } from '../../../../types/eventos';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const estado = searchParams.get('estado');
    const pisoId = searchParams.get('pisoId');
    const direccionId = searchParams.get('direccionId');
    const pisoIds = searchParams.getAll('pisoIds');

    const skip = (page - 1) * limit;

    // Obtener información del usuario en sesión
    const usuarioSesion = await prisma.usuario.findFirst({
      where: { email: session.user.email },
      select: {
        id: true,
        rolId: true,
        direccionId: true
      }
    });

    if (!usuarioSesion) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Construir el where clause
    const where: {
      estado?: string;
      pisoId?: number | { in: number[] };
      direccionId?: number;
    } = {};

    // Si el usuario es solicitante (rolId 3), filtrar por su dirección
    if (usuarioSesion.rolId === 3) {
      where.direccionId = usuarioSesion.direccionId;
    }

    // Aplicar filtros adicionales
    if (estado && estado !== 'todos') {
      where.estado = estado;
    }

    // Filtro por piso individual
    if (pisoId) {
      where.pisoId = parseInt(pisoId);
    }

    // Filtro por dirección (solo aplicable para usuarios que no son solicitantes)
    if (direccionId && usuarioSesion.rolId !== 3) {
      where.direccionId = parseInt(direccionId);
    }

    // Filtro por múltiples pisos
    if (pisoIds.length > 0) {
      const pisoIdsNumeros = pisoIds.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (pisoIdsNumeros.length > 0) {
        where.pisoId = { in: pisoIdsNumeros };
      }
    }

    const [eventos, totalCount] = await Promise.all([
      prisma.eventoExterno.findMany({
        where,
        include: {
          usuarioSolicitante: {
            select: {
              nombre: true,
              apellido: true,
              direccion: {
                select: {
                  direccion: true
                }
              }
            }
          },
          usuarioAsignado: {
            select: {
              nombre: true,
              apellido: true
            }
          },
          direccion: {
            include: {
              piso: true
            }
          },
          piso: true,
          equiposEvento: {
            include: {
              tipoEquipo: {
                select: {
                  nombre: true
                }
              }
            }
          },
          estadoDetalle: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  apellido: true
                }
              }
            }
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.eventoExterno.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      eventos,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      userRole: usuarioSesion.rolId
    });
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: CreateEventoData = await request.json();
    const { nombre, descripcion, fechaInicial, fechaFinal, equipos } = body;

    // Validaciones de fecha
    const fechaInicialDate = new Date(fechaInicial);
    const fechaFinalDate = new Date(fechaFinal);
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    if (fechaInicialDate < ahora) {
      return NextResponse.json({ error: 'La fecha inicial no puede ser anterior a la fecha actual' }, { status: 400 });
    }

    if (fechaFinalDate < ahora) {
      return NextResponse.json({ error: 'La fecha final no puede ser anterior a la fecha actual' }, { status: 400 });
    }

    if (fechaInicialDate > fechaFinalDate) {
      return NextResponse.json({ error: 'La fecha final debe ser posterior o igual a la fecha inicial' }, { status: 400 });
    }

    // Obtener el usuario en sesión con todos los datos
    const usuarioSesion = await prisma.usuario.findFirst({
      where: { email: session.user.email },
      include: {
        direccion: {
          include: {
            piso: true
          }
        }
      }
    });

    if (!usuarioSesion) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Buscar el usuario asignado (rolId 2 y supervisorTipoId 1)
    const usuarioAsignado = await prisma.usuario.findFirst({
      where: {
        rolId: 2,
        supervisorTipoId: 1
      }
    });

    if (!usuarioAsignado) {
      return NextResponse.json({ error: 'No se encontró un usuario asignado válido' }, { status: 404 });
    }

    // Validar que haya al menos un equipo seleccionado
    if (!equipos || equipos.length === 0) {
      return NextResponse.json({ error: 'Debe seleccionar al menos un equipo' }, { status: 400 });
    }

    // Crear el evento externo en una transacción
    const evento = await prisma.$transaction(async (tx) => {
      // 1. Crear el evento externo
      const nuevoEvento = await tx.eventoExterno.create({
        data: {
          nombre,
          descripcion,
          fechaInicial: fechaInicialDate,
          fechaFinal: fechaFinalDate,
          usuarioSolicitanteId: usuarioSesion.id,
          usuarioAsignadoId: usuarioAsignado.id,
          direccionId: usuarioSesion.direccionId,
          pisoId: usuarioSesion.direccion.pisoId,
          equiposEvento: {
            create: equipos.map((equipo: EquipoSeleccionado) => ({
              tipoEquipoId: equipo.tipoEquipoId,
              cantidad: equipo.cantidad
            }))
          }
        },
        include: {
          usuarioSolicitante: {
            select: {
              nombre: true,
              apellido: true
            }
          },
          usuarioAsignado: {
            select: {
              nombre: true,
              apellido: true
            }
          },
          direccion: {
            include: {
              piso: true
            }
          },
          piso: true,
          equiposEvento: {
            include: {
              tipoEquipo: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      });

      // 🔔 NUEVO: Crear notificación para el usuario asignado
      await tx.notification.create({
        data: {
          userId: usuarioAsignado.id,
          type: 'EVENTO_SOLICITADO',
          title: 'Nuevo evento externo solicitado',
          message: `Se ha solicitado un nuevo evento: "${nombre}" por ${usuarioSesion.nombre} ${usuarioSesion.apellido}`,
          relatedId: nuevoEvento.id,
          read: false
        }
      });

      return nuevoEvento;
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error creando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}