export interface TicketCierreFormData {
  condicion: 'Finalizado' | 'Rechazado' | 'Cancelado'
  memoFinalizacion: string
  observaciones?: string
}

export interface TicketCierre {
  id: number
  ticketId: number
  usuarioCerradorId: number
  fechaCierre: string
  condicion: string
  memoFinalizacion: string
  observaciones?: string
  usuarioCerrador?: {
    nombre: string
    apellido?: string
  }
}