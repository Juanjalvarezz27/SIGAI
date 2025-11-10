import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Función para limpieza automática semanal
async function cleanOldNotifications() {
  try {
    // Eliminar notificaciones mayores a 7 días
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: oneWeekAgo
        }
      }
    });

    console.log(`Limpieza automática: ${result.count} notificaciones eliminadas (mayores a 7 días)`);
    return result.count;
  } catch (error) {
    console.error('Error en limpieza automática de notificaciones:', error);
    return 0;
  }
}

// Ejecutar limpieza automática al cargar el módulo (solo en producción)
if (process.env.NODE_ENV === 'production') {
  // Ejecutar limpieza inmediatamente y luego cada 24 horas
  cleanOldNotifications();
  setInterval(cleanOldNotifications, 24 * 60 * 60 * 1000); // 24 horas
}

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

    // Ejecutar limpieza antes de obtener notificaciones (opcional)
    await cleanOldNotifications();

    // Obtener notificaciones del usuario
    const notifications = await prisma.notification.findMany({
      where: {
        userId: usuarioActual.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Últimas 50 notificaciones
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
        userId: usuarioActual.id
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

export async function DELETE(request: NextRequest) {
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

    // Eliminar todas las notificaciones del usuario
    const deleteResult = await prisma.notification.deleteMany({
      where: {
        userId: usuarioActual.id
      }
    });

    return NextResponse.json({ 
      message: 'Notificaciones eliminadas',
      deletedCount: deleteResult.count
    });

  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// Endpoint adicional para forzar limpieza manual (útil para testing)
export async function POST(request: NextRequest) {
  try {
    // Verificar si es una solicitud de limpieza (podrías agregar autenticación aquí)
    const { action } = await request.json();
    
    if (action === 'cleanup') {
      const cleanedCount = await cleanOldNotifications();
      return NextResponse.json({
        message: 'Limpieza ejecutada',
        cleanedCount
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('Error en limpieza manual:', error);
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}