// app/api/admin/actualizar-personal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

interface ActualizarPersonalRequest {
  usuarioId: number
  cedula: string | null
  email: string | null
  password: string | null 
  rolId: number
}

// Función para validar fortaleza de contraseña (solo si se proporciona)
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

// Interface para los datos de actualización
interface DatosActualizacion {
  rolId: number
  cedula?: string | null
  email?: string | null
  password?: string
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: ActualizarPersonalRequest = await request.json()
    const { usuarioId, cedula, email, password, rolId } = body

    // Validaciones básicas
    if (!usuarioId || !rolId) {
      return NextResponse.json({ error: 'Usuario ID y Rol son requeridos' }, { status: 400 })
    }

    // Validar que el rol sea válido (2, 3, o 4)
    if (![2, 3, 4].includes(rolId)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 })
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId },
      select: { 
        id: true, 
        email: true, 
        rolId: true,
        cedula: true 
      }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario no sea ya admin (rolId 1)
    if (usuarioExistente.rolId === 1) {
      return NextResponse.json({ error: 'No se puede modificar un administrador' }, { status: 400 })
    }

    // Verificar que el email no esté en uso por otro usuario (solo si se está cambiando)
    if (email && email !== usuarioExistente.email) {
      const emailExistente = await prismadb.usuario.findUnique({
        where: { email }
      })

      if (emailExistente && emailExistente.id !== usuarioId) {
        return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
      }
    }

    // Validar fortaleza de la contraseña solo si se proporciona una nueva
    let hashedPassword: string | undefined
    if (password && password.trim() !== '') {
      const validacionContraseña = validarFortalezaContraseña(password)
      if (!validacionContraseña.valida) {
        return NextResponse.json({
          error: 'La contraseña no cumple con los requisitos de seguridad',
          detalles: validacionContraseña.errores
        }, { status: 400 })
      }
      
      // Hashear la nueva contraseña
      hashedPassword = await bcrypt.hash(password, 12)
    }

    // Preparar datos para actualizar
    const datosActualizacion: DatosActualizacion = {
      rolId: rolId
    }

    // Solo actualizar cédula si se proporciona
    if (cedula !== undefined && cedula !== null) {
      datosActualizacion.cedula = cedula
    }

    // Solo actualizar email si se proporciona
    if (email !== undefined && email !== null) {
      datosActualizacion.email = email
    }

    // Solo actualizar contraseña si se proporciona una nueva
    if (hashedPassword) {
      datosActualizacion.password = hashedPassword
    }

    // Actualizar usuario
    await prismadb.usuario.update({
      where: { id: usuarioId },
      data: datosActualizacion
    })

    return NextResponse.json({ 
      message: 'Usuario actualizado correctamente',
      cambios: {
        rol: true,
        cedula: cedula !== undefined && cedula !== null,
        email: email !== undefined && email !== null,
        password: !!hashedPassword
      }
    })

  } catch (error: unknown) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}