// app/api/admin/actualizar-personal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

interface ActualizarPersonalRequest {
  usuarioId: number
  cedula: string
  email: string
  password: string
  rolId: number
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
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: ActualizarPersonalRequest = await request.json()
    const { usuarioId, cedula, email, password, rolId } = body

    // Validaciones
    if (!usuarioId || !cedula || !email || !password || !rolId) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Validar que el rol sea válido (2, 3, o 4)
    if (![2, 3, 4].includes(rolId)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 })
    }

    // Validar fortaleza de la contraseña
    const validacionContraseña = validarFortalezaContraseña(password)
    if (!validacionContraseña.valida) {
      return NextResponse.json({
        error: 'La contraseña no cumple con los requisitos de seguridad',
        detalles: validacionContraseña.errores
      }, { status: 400 })
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, email: true, rolId: true }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario no sea ya admin (rolId 1)
    if (usuarioExistente.rolId === 1) {
      return NextResponse.json({ error: 'No se puede modificar un administrador' }, { status: 400 })
    }

    // Verificar que el email no esté en uso por otro usuario
    if (email !== usuarioExistente.email) {
      const emailExistente = await prismadb.usuario.findUnique({
        where: { email }
      })

      if (emailExistente && emailExistente.id !== usuarioId) {
        return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
      }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Actualizar usuario con nuevo rol
    await prismadb.usuario.update({
      where: { id: usuarioId },
      data: {
        cedula,
        email,
        password: hashedPassword,
        rolId: rolId
      }
    })

    return NextResponse.json({ message: 'Usuario actualizado correctamente' })

  } catch (error: unknown) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}