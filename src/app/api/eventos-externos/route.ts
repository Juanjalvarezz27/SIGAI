import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prismadb';
import { authOptions } from '@/lib/auth';
import { CreateEventoData, EquipoSeleccionado } from '../../../../types/eventos';

export async function GET() {
  try {
    const eventos = await prisma.eventoExterno.findMany({
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
        piso: true,
        equiposEvento: {
          include: {
            tipoEquipo: {
              select: { nombre: true }
            }
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
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
    ahora.setHours(0, 0, 0, 0); // Solo comparar fecha, no hora

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

    // Crear el evento externo
    const evento = await prisma.eventoExterno.create({
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
        equiposEvento: true
      }
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error creando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}