import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { UpdateEventoData } from '../../../../../types/eventos';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateEventoData = await request.json();
    const { estado } = body;

    // Validar que el estado sea uno de los permitidos
    const estadosPermitidos = ['En proceso', 'Aceptado', 'Rechazado'];
    if (!estadosPermitidos.includes(estado)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const evento = await prismadb.eventoExterno.update({
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

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error actualizando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}