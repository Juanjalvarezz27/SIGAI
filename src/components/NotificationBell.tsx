// components/NotificationBell.jsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: number;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Cargar notificaciones
  const loadNotifications = async () => {
    if (status !== "authenticated" || !session?.user?.email) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }
      
      const data = await response.json();
      
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones al montar el componente solo si está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [status]);

  // Polling cada 5 minutos solo si está autenticado
  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(loadNotifications, 300000);
    return () => clearInterval(interval);
  }, [status]);

  const handleClick = () => {
    if (status !== "authenticated") {
      return;
    }
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications();
    }
  };

  // Cerrar modal cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-bell-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        // Marcar como leída
        await fetch('/api/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId: notification.id }),
        });
        
        // Actualizar estado local
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // 🔔 REDIRECCIÓN SEGÚN TIPO DE NOTIFICACIÓN
    switch (notification.type) {
      case 'EVENTO_SOLICITADO':
      case 'EVENTO_ACEPTADO':
      case 'EVENTO_RECHAZADO':
        router.push('/home/eventosExternos');
        break;
      case 'TICKET_ASSIGNED':
      case 'TICKET_REASSIGNED':
      case 'TICKET_CLOSED':
      default:
        router.push('/home/tickets');
        break;
    }
    
    setIsOpen(false);
  };

  // Función para limpiar todas las notificaciones
  const handleClearAll = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
        setIsOpen(false);
      } else {
        console.error('Error clearing notifications');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    
    return date.toLocaleDateString('es-ES');
  };

  // Ocultar componente si no hay sesión
  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="relative notification-bell-container">
      <button
        onClick={handleClick}
        className="relative cursor-pointer p-2 text-white hover:bg-[#4c678a] rounded-full transition-colors duration-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Modal de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-2xl border border-gray-300 z-[9999]">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto bg-white">
            {loading ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">Cargando notificaciones...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 flex justify-between bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 font-medium"
              >
                Cerrar
              </button>
              <button 
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 py-1 px-3 font-medium"
              >
                Limpiar todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}