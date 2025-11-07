export interface EstadisticasEventosData {
  totalEventos: number
  eventosPorEstado: Array<{
    estado: string
    cantidad: number
  }>
  eventosPorPiso: Array<{
    piso: string
    cantidad: number
  }>
  eventosPorDireccion: Array<{
    direccion: string
    cantidad: number
  }>
  topSolicitantes: Array<{
    usuario: string
    cantidad: number
  }>
  equiposMasSolicitados: Array<{
    equipo: string
    cantidad: number
  }>
  duracionPromedioDias: number
  eventosEsteMes: number
  eventosEstaSemana: number
  eventosActivos: number
  eventosCompletados: number
  eventosRechazados: number
}