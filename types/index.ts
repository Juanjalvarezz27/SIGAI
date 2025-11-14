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
    id: number
    direccion: string
    piso: {
      id: number
      piso: string
    }
  }
  area: {
    nombre: string
  } | null
  equipos: Equipo[]
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export interface BarraBusquedaProps {
  onUsuarioSeleccionado: (usuario: Usuario) => void
  loading?: boolean
  placeholder?: string
  label?: string
  esSolicitante?: boolean 
}
