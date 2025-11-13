//editar equipo 
import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

interface EspecificacionesPayload {
  memoriaRam?: string
  modulosRam?: string
  capacidadDisco?: string
  tipoDisco?: string
  procesador?: string
}

interface EquipoPayload {
  bienNacional: string
  serial: string
  observaciones: string
  tipoEquipoId: number
  modelo: string
  marca: string
  statusId: number
  estadoId: number
  especificaciones?: EspecificacionesPayload
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. CORREGIR: Await params antes de usarlos
    const { id } = await params
    const equipoId = parseInt(id)

    if (isNaN(equipoId)) {
      return NextResponse.json({ error: 'ID de equipo inválido' }, { status: 400 })
    }

    // 2. CORREGIR: Verificar que el body no esté vacío antes de parsear
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400 }
      )
    }

    // Verificar que hay contenido en el body
    const contentLength = request.headers.get('content-length')
    if (contentLength === '0') {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud no puede estar vacío' },
        { status: 400 }
      )
    }

    let body;
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('Error parseando JSON:', jsonError)
      return NextResponse.json(
        { error: 'JSON inválido en el cuerpo de la solicitud' },
        { status: 400 }
      )
    }

    const {
      bienNacional,
      serial,
      observaciones,
      tipoEquipoId,
      modelo,
      marca,
      statusId,
      estadoId,
      especificaciones
    }: EquipoPayload = body

    // Verificar campos requeridos
    if (!bienNacional?.trim() || !serial?.trim() || !tipoEquipoId || !modelo?.trim() || !marca?.trim()) {
      return NextResponse.json(
        { error: 'Campos requeridos: bienNacional, serial, tipoEquipoId, modelo, marca' },
        { status: 400 }
      )
    }

    // Verificar si el equipo existe
    const equipoExistente = await prismadb.equipos.findUnique({
      where: { id: equipoId },
      include: {
        especificaciones: true
      }
    })

    if (!equipoExistente) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    // Buscar o crear marca
    let marcaExistente = await prismadb.marca.findFirst({
      where: {
        nombre: {
          equals: marca,
          mode: 'insensitive'
        }
      }
    })

    if (!marcaExistente) {
      marcaExistente = await prismadb.marca.create({
        data: { nombre: marca }
      })
    }

    // Buscar o crear modelo
    let modeloExistente = await prismadb.modelo.findFirst({
      where: {
        AND: [
          {
            nombre: {
              equals: modelo,
              mode: 'insensitive'
            }
          },
          {
            marcaId: marcaExistente.id
          }
        ]
      }
    })

    if (!modeloExistente) {
      modeloExistente = await prismadb.modelo.create({
        data: {
          nombre: modelo,
          marcaId: marcaExistente.id
        }
      })
    }

    // Manejar especificaciones
    let especificacionesId: number | undefined

    if (especificaciones && tieneEspecificacionesValidas(especificaciones)) {
      if (equipoExistente.especificacionesId) {
        // Actualizar especificaciones existentes
        await prismadb.especificacionesAdicionales.update({
          where: { id: equipoExistente.especificacionesId },
          data: {
            memoriaRam: especificaciones.memoriaRam?.trim() || null,
            modulosRam: especificaciones.modulosRam?.trim() || null,
            capacidadDisco: especificaciones.capacidadDisco?.trim() || null,
            tipoDisco: especificaciones.tipoDisco?.trim() || null,
            procesador: especificaciones.procesador?.trim() || null
          }
        })
        especificacionesId = equipoExistente.especificacionesId
      } else {
        // Crear nuevas especificaciones
        const nuevasEspecificaciones = await prismadb.especificacionesAdicionales.create({
          data: {
            memoriaRam: especificaciones.memoriaRam?.trim() || null,
            modulosRam: especificaciones.modulosRam?.trim() || null,
            capacidadDisco: especificaciones.capacidadDisco?.trim() || null,
            tipoDisco: especificaciones.tipoDisco?.trim() || null,
            procesador: especificaciones.procesador?.trim() || null
          }
        })
        especificacionesId = nuevasEspecificaciones.id
      }
    } else if (equipoExistente.especificacionesId) {
      // Eliminar especificaciones si ya no son necesarias
      await prismadb.especificacionesAdicionales.delete({
        where: { id: equipoExistente.especificacionesId }
      })
    }

    // Actualizar el equipo
    const equipoActualizado = await prismadb.equipos.update({
      where: { id: equipoId },
      data: {
        bienNacional: bienNacional?.trim() || null,
        serial: serial?.trim() || null,
        observaciones: observaciones?.trim() || null,
        tipoEquipoId,
        modeloId: modeloExistente.id,
        statusId: statusId || null,
        estadoId: estadoId || null,
        especificacionesId
      },
      include: {
        tipoEquipo: true,
        modelo: {
          include: {
            marca: true
          }
        },
        status: true,
        estado: true,
        especificaciones: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        }
      }
    })

    return NextResponse.json({ equipo: equipoActualizado }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error actualizando equipo:', error)

    // Manejar errores específicos de Prisma
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un registro con los mismos datos' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función helper para verificar si hay especificaciones válidas
function tieneEspecificacionesValidas(especificaciones: EspecificacionesPayload): boolean {
  return Object.values(especificaciones).some(
    valor => valor !== undefined && valor !== null && valor.trim() !== ''
  )
}