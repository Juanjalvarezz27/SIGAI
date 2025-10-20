// app/api/admin/actualizar-datos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismadb from '@/lib/prismadb'

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

interface ActualizarDatosRequest {
  usuarioId: number
  cedula?: string | null
  email?: string | null
  equipos?: EquipoData[]
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin o supervisor
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || (session.user.rol !== 'admin' && session.user.rol !== 'supervisor')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: ActualizarDatosRequest = await request.json()
    const { usuarioId, cedula, email, equipos } = body

    // Validaciones
    if (!usuarioId) {
      return NextResponse.json({ error: 'ID de usuario es requerido' }, { status: 400 })
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prismadb.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, email: true, cedula: true }
    })

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Preparar datos para actualizar
    const datosActualizar: {
      cedula?: string | null
      email?: string | null
    } = {}

    // Solo actualizar cédula si se proporciona
    if (cedula !== undefined) {
      datosActualizar.cedula = cedula
    }

    // Solo actualizar email si se proporciona y validar que no esté en uso
    if (email !== undefined) {
      if (email && email !== usuarioExistente.email) {
        const emailExistente = await prismadb.usuario.findUnique({
          where: { email }
        })

        if (emailExistente && emailExistente.id !== usuarioId) {
          return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
        }
      }
      datosActualizar.email = email
    }

    // Si no hay nada que actualizar y no hay equipos para agregar
    if (Object.keys(datosActualizar).length === 0 && (!equipos || equipos.length === 0)) {
      return NextResponse.json({ error: 'No hay datos para actualizar' }, { status: 400 })
    }

    // Actualizar usuario y equipos dentro de una transacción
    const resultado = await prismadb.$transaction(async (tx) => {
      let usuarioActualizado = usuarioExistente

      // Actualizar datos del usuario si hay cambios
      if (Object.keys(datosActualizar).length > 0) {
        usuarioActualizado = await tx.usuario.update({
          where: { id: usuarioId },
          data: datosActualizar
        })
      }

      // Crear equipos si se proporcionaron
      let equiposCreados = 0
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
              usuarioId: usuarioId,
              especificacionesId: especificacionesId
            }
          })
          equiposCreados++
        }
      }

      return {
        usuario: usuarioActualizado,
        equiposCreados
      }
    })

    const mensaje = resultado.equiposCreados > 0 
      ? `Datos actualizados correctamente y ${resultado.equiposCreados} equipo(s) agregado(s)`
      : 'Datos actualizados correctamente'

    return NextResponse.json({ 
      message: mensaje,
      equiposAgregados: resultado.equiposCreados
    })

  } catch (error: unknown) {
    console.error('Error actualizando datos del usuario:', error)
    
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