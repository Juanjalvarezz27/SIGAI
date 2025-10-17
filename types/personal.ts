export interface Equipo {
  id: number
  bienNacional: string | null
  serial: string | null
  tipoEquipo: {
    nombre: string
  }
  modelo: {
    nombre: string
    marca: {
      nombre: string
    }
  }
  status: {
    estado: string
  } | null
  estado: {
    nombre: string
  } | null
  especificaciones: {
    memoriaRam: string | null
    capacidadDisco: string | null
    tipoDisco: string | null
    procesador: string | null
  } | null
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string | null
  cedula: string | null
  email: string | null
  estado: string
  rol: {
    id: number
    rol: string
  }
  direccion: {
    direccion: string
    piso: {
      piso: string
    }
  }
  area: {
    nombre: string
  } | null
  equipos: Equipo[]
  // Agregar información de deshabilitación
  deshabilitacionHistorial?: {
    motivo: string
    fechaDeshabilitacion: string
    deshabilitadoPor: {
      nombre: string
      apellido: string | null
    }
  }[]
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}