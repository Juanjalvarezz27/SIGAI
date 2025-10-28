export interface TicketEstado {
  id: number; 
  estado: string;
}

export interface TipoTicket {
  tipo: string;
}

export interface UsuarioBasico {
  id: number;
  nombre: string;
  apellido?: string | null;
  cedula?: string | null;
  email?: string | null;
  direccion?: {
    id: number; 
    direccion: string;
    piso: {
      id: number; 
      piso: string;
    };
  };
  area?: {
    nombre: string;
  } | null;
}

export interface Equipo {
  id: number;
  bienNacional?: string | null;
  serial?: string | null;
  tipoEquipo: {
    nombre: string;
  };
  modelo: {
    nombre: string;
    marca: {
      nombre: string;
    };
  };
  status?: {
    estado: string;
  } | null;
  estado?: {
    nombre: string;
  } | null;
  especificaciones?: {
    memoriaRam?: string | null;
    capacidadDisco?: string | null;
    tipoDisco?: string | null;
    procesador?: string | null;
  } | null;
}

export interface TicketEquipo {
  id: number;
  equipo: Equipo;
}

export interface AnalistaAsignado extends UsuarioBasico {
  tipoAnalista?: {
    tipo: string;
  };
}
export interface TicketCierre {
  id: number;
  ticketId: number;
  usuarioCerradorId: number;
  fechaCierre: string;
  condicion: string;
  memoFinalizacion: string;
  observaciones?: string;
  tiempoEjecucionMinutos?: number;
  usuarioCerrador?: {
    nombre: string;
    apellido?: string;
  };
}
export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_cierre?: string | null;
  estadoId: number;
  estado: TicketEstado;
  tipoTicket: TipoTicket;
  usuarioCreador: UsuarioBasico;
  usuarioCerrador?: AnalistaAsignado | null;
  usuarioAfectado?: UsuarioBasico | null;
  ticketEquipos?: TicketEquipo[];
  ticketCierre?: TicketCierre;
  tiempoEjecucion?: string;
}

export interface TicketFormData {
  titulo: string
  descripcion: string
  tipoTicketId: string
  usuarioAfectadoId?: string
  equiposSeleccionados?: number[]
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
export interface TicketCierreFormData {
  condicion: 'Finalizado' | 'Rechazado' | 'Cancelado'
  memoFinalizacion: string
  observaciones?: string
}