import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: {
          select: {
            rol: true
          }
        },
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
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol.rol,
      direccion: usuario.direccion.direccion,
      piso: usuario.direccion.piso.piso,
      area: usuario.area?.nombre || 'Sin área asignada'
    });
  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}