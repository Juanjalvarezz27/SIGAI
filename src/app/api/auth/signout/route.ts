import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout exitoso" },
      { status: 200 }
    )

    // Limpiar todas las cookies de next-auth de manera explícita
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url', 
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.callback-url',
      '__Secure-next-auth.csrf-token'
    ]

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    return response
    
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    )
  }
}