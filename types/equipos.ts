
export interface Equipo {
  id: number
  bienNacional: string | null
  serial: string | null
  observaciones: string | null
  tipoEquipo: TipoEquipo
  modelo: Modelo
  status: Status | null
  estado: Estados | null
  usuario: UsuarioEquipo | null
  especificaciones: EspecificacionesAdicionales | null
}

export interface UsuarioEquipo {
  id: number
  cedula: string | null
  nombre: string
  apellido: string | null
  email: string | null
  direccion: DireccionEquipo
  area: AreaEquipo | null
}

export interface DireccionEquipo {
  id: number
  direccion: string
  piso: PisoEquipo
}

export interface PisoEquipo {
  id: number
  piso: string
}

export interface AreaEquipo {
  id: number
  nombre: string
}

export interface TipoEquipo {
  id: number
  nombre: string
}

export interface Modelo {
  id: number
  nombre: string
  marca: Marca
}

export interface Marca {
  id: number
  nombre: string
}

export interface Status {
  id: number
  nombre: string
}

export interface Estados {
  id: number
  nombre: string
}

export interface EspecificacionesAdicionales {
  id: number
  ram: string | null
  almacenamiento: string | null
  procesador: string | null
  sistemaOperativo: string | null
  anydesk: string | null
  teamviewer: string | null
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
  totalCount?: number 
  hasNextPage?: boolean
  hasPrevPage?: boolean 
  limit?: number 
}