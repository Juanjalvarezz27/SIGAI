//Obtener las estadisticas de personal
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Total de usuarios
    const totalUsuarios = await prisma.usuario.count()

    // Total de usuarios por rol
    const usuariosPorRol = await prisma.rol.findMany({
      include: {
        usuarios: {
          select: { id: true }
        }
      }
    })

    // Total de usuarios deshabilitados
    const usuariosDeshabilitados = await prisma.usuario.count({
      where: {
        estado: "Deshabilitado"
      }
    })

    // Total de usuarios por piso (todos los pisos)
    const usuariosPorPiso = await prisma.piso.findMany({
      include: {
        direcciones: {
          include: {
            usuarios: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: {
        piso: 'asc'
      }
    })

    // Usuarios con equipos asignados
    const usuariosConEquipos = await prisma.usuario.findMany({
      where: {
        equipos: {
          some: {}
        }
      },
      include: {
        equipos: {
          include: {
            status: true,
            estado: true
          }
        }
      }
    })

    // Estadísticas específicas de equipos
    let usuariosEquiposSinUso = 0
    let usuariosEquiposInoperativos = 0
    let usuariosEquiposDesincorporados = 0
    let usuariosSinEquipos = 0

    usuariosConEquipos.forEach(usuario => {
      const tieneEquiposSinUso = usuario.equipos.some(equipo => 
        equipo.statusId === 2 // Sin uso
      )
      const tieneEquiposInoperativos = usuario.equipos.some(equipo => 
        equipo.statusId === 2 // Inoperativos
      )
      const tieneEquiposDesincorporados = usuario.equipos.some(equipo => 
        equipo.statusId === 3 // Desincorporados
      )

      if (tieneEquiposSinUso) usuariosEquiposSinUso++
      if (tieneEquiposInoperativos) usuariosEquiposInoperativos++
      if (tieneEquiposDesincorporados) usuariosEquiposDesincorporados++
    })

    // Usuarios sin equipos
    usuariosSinEquipos = totalUsuarios - usuariosConEquipos.length

    // Usuarios por estado
    const usuariosActivos = totalUsuarios - usuariosDeshabilitados

    // Procesar datos de pisos
    const pisosConUsuarios = usuariosPorPiso.map(piso => ({
      piso: piso.piso,
      cantidad: piso.direcciones.reduce((total, direccion) => 
        total + direccion.usuarios.length, 0
      )
    }))

    const estadisticas = {
      totalUsuarios,
      usuariosPorRol: usuariosPorRol.map(rol => ({
        rol: rol.rol,
        cantidad: rol.usuarios.length
      })),
      usuariosDeshabilitados,
      usuariosActivos,
      usuariosPorPiso: pisosConUsuarios,
      usuariosEquiposSinUso,
      usuariosEquiposInoperativos,
      usuariosEquiposDesincorporados,
      usuariosConEquipos: usuariosConEquipos.length,
      usuariosSinEquipos,
      totalEquiposAsignados: usuariosConEquipos.reduce((total, usuario) => 
        total + usuario.equipos.length, 0
      )
    }

    return NextResponse.json(estadisticas)
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}