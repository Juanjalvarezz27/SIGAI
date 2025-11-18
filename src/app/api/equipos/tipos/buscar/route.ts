import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Si la consulta está vacía, retornar array vacío
    if (!query.trim()) {
      return NextResponse.json({ tipos: [] });
    }

    // Buscar tipos de equipo que coincidan con el nombre
    const tipos = await prisma.tipoEquipo.findMany({
      where: {
        nombre: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        nombre: 'asc'
      },
      take: 20 // Limitar resultados
    });

    return NextResponse.json({ 
      tipos,
      total: tipos.length 
    });

  } catch (error) {
    console.error('Error buscando tipos de equipo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}