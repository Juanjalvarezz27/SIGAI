export interface TicketReasignacionFormData {
  analistaNuevoId: string
  motivo?: string
}

export interface TicketReasignacion {
  id: number
  ticketId: number
  analistaAnteriorId: number
  analistaNuevoId: number
  supervisorId: number
  motivo?: string
  fechaReasignacion: string
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
}