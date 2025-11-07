import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el usuario actual
    const usuarioActual = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener notificaciones del usuario
    const notifications = await prisma.notification.findMany({
      where: {
        userId: usuarioActual.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Últimas 20 notificaciones
    });

    // Contar notificaciones no leídas
    const unreadCount = await prisma.notification.count({
      where: {
        userId: usuarioActual.id,
        read: false
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notificación requerido' }, { status: 400 });
    }

    // Obtener el usuario actual
    const usuarioActual = await prisma.usuario.findUnique({
      where: { email: session.user.email }
    });

    if (!usuarioActual) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Marcar notificación como leída
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: usuarioActual.id // Asegurar que solo puede marcar sus propias notificaciones
      },
      data: {
        read: true
      }
    });

    return NextResponse.json(updatedNotification);

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}