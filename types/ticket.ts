export interface TicketEstado {
  id: number; 
  estado: string;
}

export interface TipoTicket {
  id: number;
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
export interface TicketsListProps {
  tickets: Ticket[]
  loading?: boolean
  error?: string
  onTicketClosed?: () => void
  onTicketReasigned?: () => void
  puedeReasignar?: boolean 
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
export interface TicketReasignacionHistorial {
  id: number
  analistaAnterior?: {
    nombre: string
    apellido?: string
  }
  analistaNuevo?: {
    nombre: string
    apellido?: string
  }
  supervisor?: {
    nombre: string
    apellido?: string
  }
  motivo?: string
  fechaReasignacion: string
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
  ticketReasignaciones?: TicketReasignacionHistorial[];
  reasignaciones?: TicketReasignacionHistorial[];
}

export interface TicketFormData {
  titulo: string
  descripcion: string
  tipoTicketId: string
  usuarioAfectadoId?: string
  equiposSeleccionados?: number[]
  sistemaId?: string
  fallaId?: string
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
