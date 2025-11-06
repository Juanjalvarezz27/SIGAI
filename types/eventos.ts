export interface EquipoSeleccionado {
  tipoEquipoId: number;
  nombre: string;
  cantidad: number;
}

export interface TipoEquipo {
  id: number;
  nombre: string;
}

export interface EventoExternoEstado {
  id: number;
  eventoId: number;
  estado: string;
  motivo: string | null;
  usuarioId: number;
  fecha: string;
  usuario: {
    nombre: string;
    apellido: string | null;
  };
}

export interface EventoExterno {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaInicial: string;
  fechaFinal: string;
  estado: string;
  usuarioSolicitanteId: number;
  usuarioAsignadoId: number;
  direccionId: number;
  pisoId: number;
  fechaCreacion: string;
  usuarioSolicitante: {
    nombre: string;
    apellido: string | null;
  };
  usuarioAsignado: {
    nombre: string;
    apellido: string | null;
  };
  direccion: {
    direccion: string;
    piso: {
      piso: string;
    };
  };
  piso: {
    piso: string;
  };
  equiposEvento: {
    cantidad: number;
    tipoEquipo: {
      nombre: string;
    };
  }[];
  estadoDetalle?: EventoExternoEstado;
}

export interface CreateEventoData {
  nombre: string;
  descripcion: string;
  fechaInicial: string;
  fechaFinal: string;
  equipos: EquipoSeleccionado[];
}

export interface UpdateEventoData {
  estado: string;
}

export interface CambioEstadoData {
  estado: string;
  motivo?: string;
}

export interface UsuarioCompleto {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: string;
  direccion: string;
  piso: string;
  area: string;
}
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EventosPaginados {
  eventos: EventoExterno[];
  pagination: PaginationInfo;
}