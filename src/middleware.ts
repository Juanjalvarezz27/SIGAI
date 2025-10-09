// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Definición de rutas y roles permitidos
const roleRoutes: Record<string, string> = {
  "/home/inventarioEquipos": "admin",
  "/home/inventarioArea": "supervisor", 
  "/home/trabajos": "analista",
  "/home/tickets": "solicitante",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('Middleware ejecutándose para:', pathname);

  // Rutas públicas sin verificación
  if (pathname === '/' || pathname.startsWith('/home/noAutorizado')) {
    return NextResponse.next();
  }

  // Obtener token de sesión
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });

  console.log('Token encontrado:', !!token);

  // Bloqueo de sin sesión en rutas protegidas
  if (!token && pathname.startsWith('/home')) {
    console.log('No hay sesión, redirigiendo a noAutorizado');
    return NextResponse.redirect(new URL('/home/noAutorizado', request.url));
  }

  // Bloqueo de verificación de roles
  if (token) {
    const userRole = token.user?.rol;
    console.log('Rol del usuario:', userRole);

    // Verificar acceso por rol
    for (const [route, requiredRole] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (userRole !== requiredRole) {
          console.log(`Rol ${userRole} no tiene acceso a ${route}, requiere ${requiredRole}`);
          
          // Redirigir a la ruta correspondiente del usuario
        const userRoute = Object.entries(roleRoutes).find(([, role]) => role === userRole);
          if (userRoute) {
            console.log(`Redirigiendo a su ruta: ${userRoute[0]}`);
            return NextResponse.redirect(new URL(userRoute[0], request.url));
          } else {
            return NextResponse.redirect(new URL('/home/noAutorizado', request.url));
          }
        }
        console.log(`Rol ${userRole} tiene acceso a ${route}`);
        break;
      }
    }
  }

  console.log('Acceso permitido');
  return NextResponse.next();
}

// Configuración de rutas que activan el middleware
export const config = {
  matcher: [
    '/home/:path*',
    '/'
  ]
};