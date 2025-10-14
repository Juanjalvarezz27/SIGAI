import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

interface CambiarPasswordRequest {
  contraseñaActual: string
  nuevaContraseña: string
  confirmarContraseña: string
}

// Función para validar fortaleza de contraseña
function validarFortalezaContraseña(contraseña: string): { valida: boolean; errores: string[] } {
  const errores: string[] = []

  if (contraseña.length < 8) {
    errores.push('Mínimo 8 caracteres')
  }

  if (!/(?=.*[a-z])/.test(contraseña)) {
    errores.push('Al menos una letra minúscula')
  }

  if (!/(?=.*\d)/.test(contraseña)) {
    errores.push('Al menos un número')
  }

  if (!/(?=.*[@$!%*?&])/.test(contraseña)) {
    errores.push('Al menos un carácter especial (@$!%*?&)')
  }

  return {
    valida: errores.length === 0,
    errores
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos del body
    const body: CambiarPasswordRequest = await request.json()
    const { contraseñaActual, nuevaContraseña, confirmarContraseña } = body

    // Validaciones básicas
    if (!contraseñaActual || !nuevaContraseña || !confirmarContraseña) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (nuevaContraseña !== confirmarContraseña) {
      return NextResponse.json({ error: 'Las contraseñas nuevas no coinciden' }, { status: 400 })
    }

    // Validar que la nueva contraseña no sea igual a la actual
    if (contraseñaActual === nuevaContraseña) {
      return NextResponse.json({ error: 'La nueva contraseña no puede ser igual a la actual' }, { status: 400 })
    }

    // Validar fortaleza de la contraseña
    const validacionContraseña = validarFortalezaContraseña(nuevaContraseña)
    if (!validacionContraseña.valida) {
      return NextResponse.json({ 
        error: 'La contraseña no cumple con los requisitos de seguridad',
        detalles: validacionContraseña.errores 
      }, { status: 400 })
    }

    // Obtener usuario actual
    const usuario = await prismadb.usuario.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar contraseña actual
    if (!usuario.password) {
      return NextResponse.json({ error: 'No se puede verificar la contraseña actual' }, { status: 400 })
    }

    const esContraseñaValida = await bcrypt.compare(contraseñaActual, usuario.password)
    if (!esContraseñaValida) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 12)

    // Actualizar contraseña
    await prismadb.usuario.update({
      where: { id: usuario.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' })

  } catch (error: unknown) {
    console.error('Error al cambiar contraseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}