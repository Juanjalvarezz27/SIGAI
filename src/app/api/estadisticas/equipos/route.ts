import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'

interface EquipoConEspecificaciones {
  tipoEquipoId: number
  usuario: {
    direccion: {
      direccion: string
      piso: {
        piso: string
      }
    }
    area: {
      nombre: string
    } | null
  } | null
  especificaciones: {
    memoriaRam?: string | null
    modulosRam?: string | null
    capacidadDisco?: string | null
    tipoDisco?: string | null
    procesador?: string | null
  } | null
}

interface ConteoEspecificaciones {
  valor: string
  cantidad: number
}

interface ProcesadorPorUbicacion {
  piso: string
  direccion: string
  procesador: string
  cantidad: number
}

interface GamaPorUbicacion {
  piso: string
  direccion: string
  gama: string
  cantidad: number
}

interface GamaProcesador {
  gama: 'Alta' | 'Media' | 'Baja'
  procesadores: string[]
}

export async function GET() {
  try {
    // Obtener todos los equipos con sus relaciones
    const equipos = await prismadb.equipos.findMany({
      include: {
        tipoEquipo: true,
        status: true,
        estado: true,
        usuario: {
          include: {
            direccion: {
              include: {
                piso: true
              }
            },
            area: true
          }
        },
        modelo: {
          include: {
            marca: true
          }
        },
        especificaciones: true
      }
    })

    // Filtrar equipos que tienen especificaciones adicionales (tipos 1, 2, 3)
    const equiposConEspecificaciones = equipos.filter(equipo => 
      equipo.especificacionesId !== null && 
      [1, 2, 3].includes(equipo.tipoEquipoId)
    ) as EquipoConEspecificaciones[]

    // Definir gamas de procesadores
    const gamasProcesadores: GamaProcesador[] = [
      {
        gama: 'Alta',
        procesadores: ['i7', 'i9', 'Ryzen 7', 'Ryzen 9', 'Xeon', 'Core i7', 'Core i9', 'AMD Ryzen 7', 'AMD Ryzen 9']
      },
      {
        gama: 'Media', 
        procesadores: ['i5', 'Ryzen 5', 'Core i5', 'Core i3', 'Ryzen 3', 'AMD Ryzen 5']
      },
      {
        gama: 'Baja',
        procesadores: ['i3', 'Celeron', 'Pentium', 'Athlon', 'Sempron', 'Atom']
      }
    ]

    // Función para determinar la gama del procesador
    function determinarGamaProcesador(procesador: string): string {
      if (!procesador) return 'Sin procesador'
      
      const procLower = procesador.toLowerCase()
      for (const gama of gamasProcesadores) {
        for (const proc of gama.procesadores) {
          if (procLower.includes(proc.toLowerCase())) {
            return gama.gama
          }
        }
      }
      return 'No identificada'
    }

    // Estadísticas de procesadores por ubicación
    const procesadoresPorUbicacion: ProcesadorPorUbicacion[] = []
    const conteoProcesadoresUbicacion = new Map<string, number>()

    // Estadísticas de gamas por ubicación
    const gamasPorUbicacion: GamaPorUbicacion[] = []
    const conteoGamasUbicacion = new Map<string, number>()

    equiposConEspecificaciones.forEach(equipo => {
      const procesador = equipo.especificaciones?.procesador
      const piso = equipo.usuario?.direccion.piso.piso
      const direccion = equipo.usuario?.direccion.direccion

      if (piso && direccion) {
        // Conteo de procesadores por ubicación
        if (procesador) {
          const claveProcesador = `${piso}-${direccion}-${procesador}`
          conteoProcesadoresUbicacion.set(claveProcesador, (conteoProcesadoresUbicacion.get(claveProcesador) || 0) + 1)
        }

        // Conteo de gamas por ubicación
        const gama = procesador ? determinarGamaProcesador(procesador) : 'Sin procesador'
        const claveGama = `${piso}-${direccion}-${gama}`
        conteoGamasUbicacion.set(claveGama, (conteoGamasUbicacion.get(claveGama) || 0) + 1)
      }
    })

    // Procesar procesadores por ubicación
    conteoProcesadoresUbicacion.forEach((cantidad, clave) => {
      const [piso, direccion, procesador] = clave.split('-')
      procesadoresPorUbicacion.push({
        piso,
        direccion,
        procesador,
        cantidad
      })
    })

    // Procesar gamas por ubicación
    conteoGamasUbicacion.forEach((cantidad, clave) => {
      const [piso, direccion, gama] = clave.split('-')
      gamasPorUbicacion.push({
        piso,
        direccion,
        gama,
        cantidad
      })
    })

    // Estadísticas de gamas de procesadores (CORREGIDO)
    const equiposPorGama = {
      'Alta': 0,
      'Media': 0,
      'Baja': 0,
      'No identificada': 0,
      'Sin procesador': 0
    }

    equiposConEspecificaciones.forEach(equipo => {
      const procesador = equipo.especificaciones?.procesador
      const gama = determinarGamaProcesador(procesador || '')
      equiposPorGama[gama as keyof typeof equiposPorGama]++
    })

    // Función helper para contar valores únicos
    function contarValoresUnicos(equipos: EquipoConEspecificaciones[], campo: keyof NonNullable<EquipoConEspecificaciones['especificaciones']>): ConteoEspecificaciones[] {
      const conteo = new Map<string, number>()
      
      equipos.forEach(equipo => {
        const valor = equipo.especificaciones?.[campo]
        if (valor && valor.trim() !== '') {
          const valorNormalizado = valor.trim()
          conteo.set(valorNormalizado, (conteo.get(valorNormalizado) || 0) + 1)
        }
      })

      return Array.from(conteo, ([valor, cantidad]) => ({
        valor,
        cantidad
      }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 20)
    }

    // Estadísticas detalladas de especificaciones
    const memoriaRamStats = contarValoresUnicos(equiposConEspecificaciones, 'memoriaRam')
    const modulosRamStats = contarValoresUnicos(equiposConEspecificaciones, 'modulosRam')
    const capacidadDiscoStats = contarValoresUnicos(equiposConEspecificaciones, 'capacidadDisco')
    const tipoDiscoStats = contarValoresUnicos(equiposConEspecificaciones, 'tipoDisco')
    const procesadorStats = contarValoresUnicos(equiposConEspecificaciones, 'procesador')

    // Calcular especificaciones completas (CORREGIDO)
    const equiposConEspecificacionesCompletas = equiposConEspecificaciones.filter(equipo => {
      const especs = equipo.especificaciones
      return especs?.memoriaRam && especs?.procesador && especs?.capacidadDisco && especs?.tipoDisco
    }).length

    const equiposConEspecificacionesParciales = equiposConEspecificaciones.filter(equipo => {
      const especs = equipo.especificaciones
      return especs?.memoriaRam || especs?.procesador || especs?.capacidadDisco || especs?.tipoDisco || especs?.modulosRam
    }).length

    // Totales de especificaciones
    const totalEquiposConEspecificaciones = equiposConEspecificaciones.length
    const totalEquiposSinEspecificaciones = equipos.filter(equipo => 
      equipo.especificacionesId === null && 
      [1, 2, 3].includes(equipo.tipoEquipoId)
    ).length

    // Estadísticas básicas
    const totalEquipos = equipos.length

    // Equipos por status
    const equiposPorStatus = await prismadb.status.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por estado
    const equiposPorEstado = await prismadb.estados.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por tipo
    const equiposPorTipo = await prismadb.tipoEquipo.findMany({
      include: {
        equipos: true
      }
    })

    // Equipos por marca
    const equiposPorMarca = await prismadb.marca.findMany({
      include: {
        modelos: {
          include: {
            equipos: true
          }
        }
      }
    })

    // Procesar datos para estadísticas básicas
    const equiposAsignados = equipos.filter(equipo => equipo.usuarioId !== null).length
    const equiposNoAsignados = totalEquipos - equiposAsignados

    const equiposEnUsoOperativos = equipos.filter(equipo =>
      equipo.estado?.id === 1 && equipo.status?.id === 1
    ).length

    const equiposDesincorporados = equipos.filter(equipo =>
      equipo.status?.id === 3
    ).length

    const equiposSinEspecificaciones = equipos.filter(equipo => !equipo.especificacionesId).length
    const equiposConObservaciones = equipos.filter(equipo => equipo.observaciones && equipo.observaciones.length > 0).length

    // Procesar equipos por piso
    const equiposConUsuarios = equipos.filter(equipo => equipo.usuario !== null)
    const equiposPorPisoMap = new Map<string, number>()

    equiposConUsuarios.forEach(equipo => {
      const piso = equipo.usuario?.direccion.piso.piso
      if (piso) {
        equiposPorPisoMap.set(piso, (equiposPorPisoMap.get(piso) || 0) + 1)
      }
    })

    const equiposPorPiso = Array.from(equiposPorPisoMap, ([piso, cantidad]) => ({
      piso,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por dirección
    const equiposPorDireccionMap = new Map<string, number>()

    equiposConUsuarios.forEach(equipo => {
      const direccion = equipo.usuario?.direccion.direccion
      if (direccion) {
        equiposPorDireccionMap.set(direccion, (equiposPorDireccionMap.get(direccion) || 0) + 1)
      }
    })

    const equiposPorDireccion = Array.from(equiposPorDireccionMap, ([direccion, cantidad]) => ({
      direccion,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por área
    const equiposPorAreaMap = new Map<string, number>()

    equiposConUsuarios.forEach(equipo => {
      const area = equipo.usuario?.area?.nombre
      if (area) {
        equiposPorAreaMap.set(area, (equiposPorAreaMap.get(area) || 0) + 1)
      }
    })

    const equiposPorArea = Array.from(equiposPorAreaMap, ([area, cantidad]) => ({
      area,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por marca
    const equiposPorMarcaProcesado = equiposPorMarca.map(marca => ({
      marca: marca.nombre,
      cantidad: marca.modelos.reduce((acc, modelo) => acc + modelo.equipos.length, 0)
    })).filter(item => item.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)

    // Procesar equipos por tipo
    const equiposPorTipoProcesado = equiposPorTipo.map(tipo => ({
      tipo: tipo.nombre,
      cantidad: tipo.equipos.length
    })).filter(item => item.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)

    const estadisticas = {
      // Estadísticas generales
      totalEquipos,
      equiposAsignados,
      equiposNoAsignados,
      porcentajeAsignados: totalEquipos > 0 ? (equiposAsignados / totalEquipos) * 100 : 0,
      equiposEnUsoOperativos,
      equiposDesincorporados,
      porcentajeEnUsoOperativos: totalEquipos > 0 ? (equiposEnUsoOperativos / totalEquipos) * 100 : 0,
      porcentajeDesincorporados: totalEquipos > 0 ? (equiposDesincorporados / totalEquipos) * 100 : 0,

      // Estadísticas de especificaciones
      especificaciones: {
        totalEquiposConEspecificaciones,
        totalEquiposSinEspecificaciones,
        porcentajeConEspecificaciones: totalEquipos > 0 ? (totalEquiposConEspecificaciones / totalEquipos) * 100 : 0,
        equiposConEspecificacionesCompletas,
        equiposConEspecificacionesParciales,
        porcentajeCompletitud: totalEquiposConEspecificaciones > 0 ? 
          (equiposConEspecificacionesCompletas / totalEquiposConEspecificaciones) * 100 : 0,
        
        // Estadísticas detalladas
        memoriaRam: memoriaRamStats,
        modulosRam: modulosRamStats,
        capacidadDisco: capacidadDiscoStats,
        tipoDisco: tipoDiscoStats,
        procesadores: procesadorStats,
        
        // Gamas de procesadores (CORREGIDO)
        gamasProcesadores: equiposPorGama,
        
        // Procesadores por ubicación
        procesadoresPorUbicacion: procesadoresPorUbicacion
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 30),
        
        // Gamas por ubicación (NUEVO)
        gamasPorUbicacion: gamasPorUbicacion
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 30)
      },

      // Estadísticas existentes
      equiposPorStatus: equiposPorStatus.map(status => ({
        status: status.estado,
        cantidad: status.equipos.length
      })).filter(item => item.cantidad > 0),

      equiposPorEstado: equiposPorEstado.map(estado => ({
        estado: estado.nombre,
        cantidad: estado.equipos.length
      })).filter(item => item.cantidad > 0),

      equiposPorTipo: equiposPorTipoProcesado,
      equiposPorPiso,
      equiposPorDireccion,
      equiposPorArea,
      equiposPorMarca: equiposPorMarcaProcesado,
      equiposSinEspecificaciones,
      equiposConObservaciones
    }

    return NextResponse.json(estadisticas)
  } catch (error) {
    console.error('Error al cargar estadísticas de equipos:', error)
    return NextResponse.json(
      { error: 'Error al cargar estadísticas de equipos' },
      { status: 500 }
    )
  }
}