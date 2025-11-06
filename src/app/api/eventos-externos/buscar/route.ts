import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json({ eventos: [] });
    }

    const eventos = await prisma.eventoExterno.findMany({
      where: {
        OR: [
          {
            usuarioSolicitante: {
              nombre: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            usuarioSolicitante: {
              apellido: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            nombre: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        usuarioSolicitante: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        usuarioAsignado: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        direccion: {
          select: {
            direccion: true,
          },
        },
        piso: {
          select: {
            piso: true,
          },
        },
        equiposEvento: {
          include: {
            tipoEquipo: {
              select: {
                nombre: true,
              },
            },
          },
        },
        estadoDetalle: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
      take: 20, // Limitar resultados
    });

    return NextResponse.json({ eventos });
  } catch (error) {
    console.error('Error buscando eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}