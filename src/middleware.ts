import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Definición de rutas y roles permitidos - estructura más específica
const roleRoutes: Record<string, string[]> = {
  "/home/personal": ["admin"],
  "/home/solicitantes": ["supervisor"],
  "/home/inventarioEquipos": ["admin", "supervisor", "analista"],
  "/home/tickets": ["admin", "supervisor", "solicitante", "analista"],
  "/home/eventosExternos": ["admin", "supervisor", "solicitante"],
  "/home/estadisticas": ["admin", "supervisor"],
  "/home/perfil": ["admin", "supervisor", "solicitante", "analista"],
  "/home/trabajos": ["analista"],
};

// Rutas públicas sin verificación
const publicRoutes = [
  "/",
  "/home/noAutorizado",
  "/docs/manualDeUso"
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Middleware ejecutándose para:", pathname);

  // Rutas públicas sin verificación
  if (publicRoutes.includes(pathname) || pathname.startsWith("/home/noAutorizado")) {
    return NextResponse.next();
  }

  // Obtener token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  console.log("Token encontrado:", !!token);

  // Bloqueo de sin sesión en rutas protegidas
  if (!token && pathname.startsWith("/home")) {
    console.log("No hay sesión, redirigiendo a noAutorizado");
    return NextResponse.redirect(new URL("/home/noAutorizado", request.url));
  }

  // Verificación de roles para usuarios autenticados
  if (token) {
    const userRole = token.user?.rol;
    console.log("Rol del usuario:", userRole);

    // Buscar si la ruta actual tiene restricciones de rol
    let hasAccess = false;
    let routeFound = false;

    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        routeFound = true;
        if (allowedRoles.includes(userRole)) {
          hasAccess = true;
          console.log(`Rol ${userRole} tiene acceso a ${route}`);
          break;
        } else {
          console.log(`Rol ${userRole} no tiene acceso a ${route}, requiere uno de: ${allowedRoles.join(', ')}`);
          break;
        }
      }
    }

    // Si la ruta no está en roleRoutes, permitir acceso (rutas compartidas sin restricción específica)
    if (!routeFound) {
      console.log(`Ruta ${pathname} no tiene restricciones específicas, acceso permitido`);
      hasAccess = true;
    }

    // Si no tiene acceso, redirigir
    if (!hasAccess) {
      // Encontrar la primera ruta disponible para el rol del usuario
      const userAccessibleRoute = Object.entries(roleRoutes).find(
        ([, roles]) => roles.includes(userRole)
      );
      
      if (userAccessibleRoute) {
        console.log(`Redirigiendo a su ruta: ${userAccessibleRoute[0]}`);
        return NextResponse.redirect(new URL(userAccessibleRoute[0], request.url));
      } else {
        console.log("No se encontró ruta accesible, redirigiendo a noAutorizado");
        return NextResponse.redirect(new URL("/home/noAutorizado", request.url));
      }
    }
  }

  console.log("Acceso permitido");
  return NextResponse.next();
}

// Configuración de rutas que activan el middleware
export const config = {
  matcher: ["/home/:path*"],
};