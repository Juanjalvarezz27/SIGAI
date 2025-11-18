// Obtener analista o supervisor pero no el usuario actual
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    // Obtener el usuario actual para verificar si es supervisor
    const usuarioActual = await prismadb.usuario.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        rolId: true,
        supervisorTipoId: true
      }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener el ticket actual para excluir al analista asignado
    let usuarioActualmenteAsignadoId: number | null = null;

    if (ticketId) {
      const ticketActual = await prismadb.ticket.findUnique({
        where: { id: parseInt(ticketId) },
        select: {
          usuarioCerradorId: true
        }
      });

      if (ticketActual?.usuarioCerradorId) {
        usuarioActualmenteAsignadoId = ticketActual.usuarioCerradorId;
      }
    }

    // Condición base para excluir usuario actualmente asignado
    const condicionExcluirUsuario = usuarioActualmenteAsignadoId
      ? { id: { not: usuarioActualmenteAsignadoId } }
      : {};

    // MODIFICADO: Obtener TODOS los analistas activos (rolId 4) sin filtrar por tipoAnalistaId
    const analistas = await prismadb.usuario.findMany({
      where: {
        estado: 'Activo',
        rolId: 4, // Solo analistas
        ...condicionExcluirUsuario
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        tipoAnalista: {
          select: {
            tipo: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    // MODIFICADO: Obtener TODOS los supervisores activos (rolId 2) sin filtrar por supervisorTipoId
    const condicionesBaseSupervisores = {
      estado: 'Activo',
      rolId: 2, // Solo supervisores
      ...condicionExcluirUsuario
    };

    // Si el usuario actual es supervisor, excluirlo de la lista
    let condicionesFinalesSupervisores;
    if (usuarioActual.rolId === 2) {
      condicionesFinalesSupervisores = {
        ...condicionesBaseSupervisores,
        id: { not: usuarioActual.id }
      };
    } else {
      condicionesFinalesSupervisores = condicionesBaseSupervisores;
    }

    const supervisores = await prismadb.usuario.findMany({
      where: condicionesFinalesSupervisores,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        supervisorTipo: {
          select: {
            tipo: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return NextResponse.json({
      analistas,
      supervisores
    });

  } catch (error) {
    console.error('Error obteniendo analistas y supervisores:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}