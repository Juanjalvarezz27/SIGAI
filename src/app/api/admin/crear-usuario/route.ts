import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

interface CrearUsuarioRequest {
  cedula: string
  nombre: string
  apellido: string
  email: string
  password: string
  rolId: number
  pisoId: number
  direccionId: number
  areaId?: number
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

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: CrearUsuarioRequest = await request.json()
    const { cedula, nombre, apellido, email, password, rolId, direccionId, areaId } = body

    // Validaciones
    if (!cedula || !nombre || !email || !password || !rolId || !direccionId) {
      return NextResponse.json({ error: 'Todos los campos obligatorios son requeridos' }, { status: 400 })
    }

    // Validar fortaleza de la contraseña
    const validacionContraseña = validarFortalezaContraseña(password)
    if (!validacionContraseña.valida) {
      return NextResponse.json({
        error: 'La contraseña no cumple con los requisitos de seguridad',
        detalles: validacionContraseña.errores
      }, { status: 400 })
    }

    // Verificar que el email no esté en uso
    const emailExistente = await prismadb.usuario.findUnique({
      where: { email }
    })

    if (emailExistente) {
      return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
    }

    // Verificar que la dirección existe
    const direccionExistente = await prismadb.direcciones.findUnique({
      where: { id: direccionId }
    })

    if (!direccionExistente) {
      return NextResponse.json({ error: 'La dirección seleccionada no existe' }, { status: 400 })
    }

    // Verificar que el área existe si se proporciona
    if (areaId) {
      const areaExistente = await prismadb.area.findUnique({
        where: { id: areaId }
      })

      if (!areaExistente) {
        return NextResponse.json({ error: 'El área seleccionada no existe' }, { status: 400 })
      }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    await prismadb.usuario.create({
      data: {
        cedula,
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rolId,
        direccionId,
        areaId: areaId || null
      }
    })

    return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201 })

  } catch (error: unknown) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}