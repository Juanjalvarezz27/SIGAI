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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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

    // Verificar si ya existe un equipo con el mismo bien nacional o serial
    if (bienNacional && bienNacional.trim() !== '') {
      const equipoExistente = await prismadb.equipos.findFirst({
        where: {
          OR: [
            { bienNacional },
            { serial }
          ]
        }
      })

      if (equipoExistente) {
        return NextResponse.json(
          { error: 'Ya existe un equipo con el mismo bien nacional o serial' },
          { status: 400 }
        )
      }
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

    // Crear especificaciones si son necesarias
    let especificacionesId: number | undefined

    if (especificaciones && tieneEspecificacionesValidas(especificaciones)) {
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

    // Crear el equipo
    const nuevoEquipo = await prismadb.equipos.create({
      data: {
        bienNacional: bienNacional?.trim() || null,
        serial: serial?.trim() || null,
        observaciones: observaciones?.trim() || null,
        tipoEquipoId,
        modeloId: modeloExistente.id,
        statusId: statusId || null,
        estadoId: estadoId || null,
        especificacionesId,
        usuarioId: null
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
        especificaciones: true
      }
    })

    return NextResponse.json({ equipo: nuevoEquipo }, { status: 201 })

  } catch (error: unknown) {
    console.error('Error creando equipo:', error)
    
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