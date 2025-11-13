//crear nuevo usaurio
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'
import bcrypt from 'bcrypt'

interface EspecificacionesOrdenador {
  memoriaRam: string
  modulosRam: string
  capacidadDisco: string
  tipoDisco: string
  procesador: string
}

interface EquipoData {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  tipoEquipoNombre?: string
  modelo: string    
  marca: string     
  statusId: number
  estadoId: number
  especificaciones?: EspecificacionesOrdenador
}

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
  equipos?: EquipoData[]
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
    // Verificar autenticación y rol
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userRole = session.user.rol
    
    // Solo admin y supervisor pueden crear usuarios
    if (userRole !== 'admin' && userRole !== 'supervisor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: CrearUsuarioRequest = await request.json()
    const { cedula, nombre, apellido, email, password, rolId, direccionId, areaId, equipos } = body

    // Validaciones
    if (!cedula || !nombre || !email || !password || !rolId || !direccionId) {
      return NextResponse.json({ error: 'Todos los campos obligatorios son requeridos' }, { status: 400 })
    }

    // Si el usuario es supervisor, no puede crear supervisores
    if (userRole === 'supervisor') {
      // Obtener el nombre del rol que está intentando crear
      const rolSeleccionado = await prismadb.rol.findUnique({
        where: { id: rolId }
      })

      if (rolSeleccionado?.rol === 'supervisor') {
        return NextResponse.json({ error: 'No autorizado: un supervisor no puede crear supervisores' }, { status: 401 })
      }
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

    // Crear usuario dentro de una transacción
    const resultado = await prismadb.$transaction(async (tx) => {
      // Crear usuario
      const usuarioCreado = await tx.usuario.create({
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

      // Crear equipos si se proporcionaron
      if (equipos && equipos.length > 0) {
        for (const equipoData of equipos) {
          let especificacionesId = null
          
          // Validar campos obligatorios del equipo
          if (!equipoData.marca || !equipoData.modelo || !equipoData.statusId || !equipoData.estadoId) {
            throw new Error('Todos los campos obligatorios del equipo deben ser completados')
          }

          // Buscar o crear el tipo de equipo
          let tipoEquipoId = equipoData.tipoEquipoId
          if (!tipoEquipoId && equipoData.tipoEquipoNombre) {
            // Buscar si el tipo ya existe
            const tipoExistente = await tx.tipoEquipo.findFirst({
              where: { 
                nombre: {
                  equals: equipoData.tipoEquipoNombre,
                  mode: 'insensitive'
                }
              }
            })

            if (tipoExistente) {
              tipoEquipoId = tipoExistente.id
            } else {
              // Crear nuevo tipo
              const nuevoTipo = await tx.tipoEquipo.create({
                data: { nombre: equipoData.tipoEquipoNombre }
              })
              tipoEquipoId = nuevoTipo.id
            }
          }

          if (!tipoEquipoId) {
            throw new Error('Tipo de equipo es requerido')
          }

          // Verificar que el tipo de equipo existe
          const tipoEquipoExistente = await tx.tipoEquipo.findUnique({
            where: { id: tipoEquipoId }
          })
          if (!tipoEquipoExistente) {
            throw new Error(`El tipo de equipo seleccionado no existe`)
          }

          // Verificar que el status existe
          const statusExistente = await tx.status.findUnique({
            where: { id: equipoData.statusId }
          })
          if (!statusExistente) {
            throw new Error(`El status seleccionado no existe`)
          }

          // Verificar que el estado existe
          const estadoExistente = await tx.estados.findUnique({
            where: { id: equipoData.estadoId }
          })
          if (!estadoExistente) {
            throw new Error(`El estado seleccionado no existe`)
          }

          // Buscar o crear modelo
          let modeloId: number
          const modeloExistente = await tx.modelo.findFirst({
            where: { 
              nombre: equipoData.modelo,
              marca: {
                nombre: equipoData.marca
              }
            },
            include: { marca: true }
          })

          if (modeloExistente) {
            modeloId = modeloExistente.id
          } else {
            // Buscar o crear marca
            let marcaId: number
            const marcaExistente = await tx.marca.findFirst({
              where: { 
                nombre: {
                  equals: equipoData.marca,
                  mode: 'insensitive'
                }
              }
            })

            if (marcaExistente) {
              marcaId = marcaExistente.id
            } else {
              const nuevaMarca = await tx.marca.create({
                data: { nombre: equipoData.marca }
              })
              marcaId = nuevaMarca.id
            }

            // Crear modelo
            const nuevoModelo = await tx.modelo.create({
              data: { 
                nombre: equipoData.modelo,
                marcaId: marcaId
              }
            })
            modeloId = nuevoModelo.id
          }

          // Crear especificaciones si es necesario
          if (equipoData.especificaciones) {
            const especificaciones = await tx.especificacionesAdicionales.create({
              data: equipoData.especificaciones
            })
            especificacionesId = especificaciones.id
          }

          // Crear equipo
          await tx.equipos.create({
            data: {
              bienNacional: equipoData.bienNacional || null,
              serial: equipoData.serial || null,
              observaciones: equipoData.observaciones || null,
              tipoEquipoId: tipoEquipoId,
              modeloId: modeloId,
              statusId: equipoData.statusId,
              estadoId: equipoData.estadoId,
              usuarioId: usuarioCreado.id,
              especificacionesId: especificacionesId
            }
          })
        }
      }

      return usuarioCreado
    })

    return NextResponse.json({ 
      message: 'Usuario creado correctamente',
      equiposAsignados: equipos?.length || 0
    }, { status: 201 })

  } catch (error: unknown) {
    console.error('Error creando usuario:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}