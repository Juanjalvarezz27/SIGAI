import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = parseInt(id);

    const equipos = await prisma.equipos.findMany({
      where: {
        usuarioId: usuarioId
      },
      include: {
        tipoEquipo: {
          select: { nombre: true }
        },
        modelo: {
          include: {
            marca: {
              select: { nombre: true }
            }
          }
        },
        status: {
          select: { estado: true }
        },
        estado: {
          select: { nombre: true }
        },
        especificaciones: {
          select: {
            memoriaRam: true,
            capacidadDisco: true,
            tipoDisco: true,
            procesador: true
          }
        }
      }
    });

    // Transformar los datos para asegurar que no haya undefined
    const equiposTransformados = equipos.map(equipo => ({
      id: equipo.id,
      bienNacional: equipo.bienNacional || null,
      serial: equipo.serial || null,
      tipoEquipo: equipo.tipoEquipo || { nombre: 'No especificado' },
      modelo: {
        nombre: equipo.modelo?.nombre || 'No especificado',
        marca: {
          nombre: equipo.modelo?.marca?.nombre || 'No especificado'
        }
      },
      status: equipo.status ? { estado: equipo.status.estado } : null,
      estado: equipo.estado ? { nombre: equipo.estado.nombre } : null,
      especificaciones: equipo.especificaciones ? {
        memoriaRam: equipo.especificaciones.memoriaRam || null,
        capacidadDisco: equipo.especificaciones.capacidadDisco || null,
        tipoDisco: equipo.especificaciones.tipoDisco || null,
        procesador: equipo.especificaciones.procesador || null
      } : null
    }));

    return NextResponse.json(equiposTransformados);
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}