"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

import {
  LucideIcon,
  LogOut,
  Package,
  Users,
  Ticket,
  Calendar,
  BarChart3,
  User,
  UserCheck,
  House,
  Bell,
} from "lucide-react";

import Logo from "@/assets/logo.png";
import ConfirmLogoutModal from "@/components/ConfirmLogoutModal";

// Definir tipos para los botones
interface NavButton {
  path: string;
  label: string;
  icon: LucideIcon | null;
  roles: string[]; // Roles que pueden acceder a esta ruta
  supervisorTipoId?: number; // SupervisorTipoId específico requerido (opcional)
}

// Interface para la información del usuario
interface UsuarioInfo {
  rolId: number;
  rol: string;
  supervisorTipoId: number | null;
  supervisorTipo: {
    id: number;
    tipo: string;
  } | null;
}

// Interface para las notificaciones
interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedId?: number;
  createdAt: string;
}

// Componente de Campana de Notificaciones - VERSIÓN CORREGIDA
function NotificationBell() {
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

  // Polling cada 30 segundos solo si está autenticado
  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(loadNotifications, 30000);
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
    
    // SOLO REDIRIGIR A /home/tickets
    router.push('/home/tickets');
    setIsOpen(false);
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
    
    return date.toLocaleDateString('es-ES');
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative p-2 text-white hover:bg-[#4c678a] rounded-full transition-colors duration-200"
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
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg z-50 border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
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
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
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
            <div className="p-2 border-t">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioInfo | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  // Efecto para marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener información del usuario al cargar
  useEffect(() => {
    const obtenerInfoUsuario = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          setLoadingUserInfo(true);
          const response = await axios.get("/api/auth/usuarioRol");
          setUsuarioInfo(response.data);
        } catch (error) {
          console.error("Error obteniendo información del usuario:", error);
        } finally {
          setLoadingUserInfo(false);
        }
      }
    };

    obtenerInfoUsuario();
  }, [status, session]);

  // Definir todas las rutas disponibles con sus roles permitidos
  const allRoutes: NavButton[] = [
    {
      path: "/home",
      label: "Inicio",
      icon: House,
      roles: ["admin", "supervisor", "solicitante", "analista"],
    },
    {
      path: "/home/personal",
      label: "Personal",
      icon: Users,
      roles: ["admin"],
    },
    {
      path: "/home/inventarioEquipos",
      label: "Inventario de equipos",
      icon: Package,
      roles: ["admin", "supervisor", "analista"],
    },
    {
      path: "/home/solicitantes",
      label: "Personal",
      icon: UserCheck,
      roles: ["supervisor"],
    },
    {
      path: "/home/tickets",
      label: "Tickets",
      icon: Ticket,
      roles: ["admin", "supervisor", "solicitante", "analista"],
    },
    {
      path: "/home/eventosExternos",
      label: "Eventos Externos",
      icon: Calendar,
      roles: ["admin", "supervisor", "solicitante"],
      supervisorTipoId: 1,
    },
    {
      path: "/home/estadisticas",
      label: "Estadísticas",
      icon: BarChart3,
      roles: ["admin", "supervisor"],
    },
    {
      path: "/home/perfil",
      label: "Perfil",
      icon: User,
      roles: ["admin", "supervisor", "solicitante", "analista"],
    },
  ];

  // Función para verificar si estamos en la ruta /home
  const isHomeRoute = () => {
    return pathname === "/home";
  };

  // Función para verificar si un usuario puede ver una ruta específica
  const puedeVerRuta = (route: NavButton): boolean => {
    const userRole = session?.user?.rol || "";
    const userRolId = usuarioInfo?.rolId;

    // Verificar si el rol del usuario está en los roles permitidos
    if (!route.roles.includes(userRole)) {
      return false;
    }

    // Verificación especial para eventos externos
    if (route.path === "/home/eventosExternos") {
      if (
        userRole === "admin" ||
        userRolId === 3 ||
        (userRolId === 2 && usuarioInfo?.supervisorTipoId === 1)
      ) {
        return true;
      }
      return false;
    }

    return true;
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/signout");

      if (typeof window !== "undefined") {
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name =
            eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

          if (name.includes("auth") || name.includes("next")) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        });

        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if (typeof window !== "undefined") {
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0].trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        window.location.href = "/";
      }
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    closeLogoutModal();
    handleLogout();
  };

  // Botones para usuarios no autenticados
  const unauthenticatedButtons: Omit<NavButton, "roles">[] = [
    { path: "/docs/manualDeUso", label: "Más Info", icon: null },
    { path: "/", label: "Iniciar Sesión", icon: null },
  ];

  // Obtener botones filtrados por rol del usuario
  const getRoleButtons = (): NavButton[] => {
    const userRole = session?.user?.rol || "";

    if (!userRole) return [];

    return allRoutes.filter((route) => puedeVerRuta(route));
  };

  // Si no hay sesión
  if (status === "unauthenticated") {
    return (
      <nav className="bg-[#001f3f] opacity-90 w-11/12 mt-10 mx-auto rounded-2xl">
        <div className="py-3 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Image src={Logo} alt="Logo del INHRR" className="w-16" />
              <h1 className="text-white text-xl font-bold ml-2">OTIC</h1>
            </div>

            <div className="flex items-center gap-8">
              {unauthenticatedButtons.map((button) => {
                const isActive = pathname === button.path;
                return (
                  <button
                    key={button.path}
                    onClick={() => handleNavigation(button.path)}
                    className={`cursor-pointer text-white text-md font-medium p-4 rounded-3xl transform transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? "bg-[#4c678a]"
                        : "transform transition-all duration-200 hover:scale-112"
                    }`}
                  >
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Si hay sesión
  const roleButtons = getRoleButtons();

  // Mostrar loading mientras se obtiene la información del usuario
  if (loadingUserInfo) {
    return (
      <nav className="bg-[#001f3f] opacity-90 w-11/12 mt-10 mx-auto rounded-2xl">
        <div className="py-3 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Image src={Logo} alt="Logo del INHRR" className="w-16" />
              <h1 className="text-white text-xl font-bold ml-2">OTIC</h1>
            </div>
            <div className="text-white">Cargando...</div>
          </div>
        </div>
      </nav>
    );
  }

  // Renderizar una versión simple en el servidor, completa en el cliente
  return (
    <>
      <nav className="bg-[#001f3f] opacity-90 w-11/12 mt-10 mx-auto rounded-2xl">
        <div className="py-3 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Image src={Logo} alt="Logo del INHRR" className="w-16" />
              <h1 className="text-white text-xl font-bold ml-2">OTIC</h1>
            </div>

            <div className="flex items-center gap-2">
              {isClient &&
                !isHomeRoute() &&
                roleButtons.map((button) => {
                  const isActive = pathname === button.path;
                  const IconComponent = button.icon;

                  return (
                    <button
                      key={`${button.path}-${button.label}`}
                      onClick={() => handleNavigation(button.path)}
                      className={`cursor-pointer flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-2xl transform transition-all duration-200 hover:scale-105 ${
                        isActive
                          ? "bg-[#4c678a]"
                          : "transform transition-all duration-200 hover:scale-112"
                      }`}
                    >
                      {IconComponent && <IconComponent size={18} />}
                      {button.label}
                    </button>
                  );
                })}

              <div className="flex items-center gap-4">
                {isClient && isHomeRoute() && session?.user && (
                  <h1 className="text-white text-lg">
                    Bienvenido, {session.user.nombre} {session.user.apellido}
                  </h1>
                )}

                <NotificationBell />

                <button
                  onClick={openLogoutModal}
                  className="flex items-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <LogOut size={18} />
                  {isClient && isHomeRoute() && <span>Cerrar Sesión</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de confirmación */}
      {isClient && (
        <ConfirmLogoutModal
          isOpen={showLogoutModal}
          onClose={closeLogoutModal}
          onConfirm={confirmLogout}
        />
      )}
    </>
  );
}