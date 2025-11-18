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

export interface ReasignacionHistorialEquipo {
  id: number
  equipoId: number
  usuarioAnteriorId: number | null
  usuarioNuevoId: number | null
  motivo: string | null
  reasignadoPorId: number
  fechaReasignacion: string
  usuarioAnterior?: {
    id: number
    nombre: string
    apellido: string | null
    email: string | null
    cedula: string | null
  } | null
  usuarioNuevo?: {
    id: number
    nombre: string
    apellido: string | null
    email: string | null
    cedula: string | null
  } | null
  reasignadoPor: {
    id: number
    nombre: string
    apellido: string | null
    email: string | null
  }
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
    id: number 
    direccion: string
    piso: {
      id: number
      piso: string
    }
  }
  area: {
    id?: number 
    nombre: string
  } | null
  equipos: Equipo[]
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