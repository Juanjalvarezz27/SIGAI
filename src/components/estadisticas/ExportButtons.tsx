"use client"

import { FileText, Sheet } from "lucide-react"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"

interface ExportButtonsProps {
  tipoEstadistica: "personal" | "equipos" | "tickets" | "eventos"
}

interface EstadisticasPersonal {
  totalUsuarios: number
  usuariosActivos: number
  usuariosDeshabilitados: number
  usuariosConEquipos: number
  usuariosSinEquipos: number
  totalEquiposAsignados: number
  usuariosPorRol: Array<{
    rol: string
    cantidad: number
  }>
  usuariosPorPiso: Array<{
    piso: string
    cantidad: number
  }>
}

interface EstadisticasEquipos {
  totalEquipos: number
  equiposAsignados: number
  equiposNoAsignados: number
  equiposEnUsoOperativos: number
  equiposDesincorporados: number
  equiposConObservaciones: number
  equiposPorStatus: Array<{
    status: string
    cantidad: number
  }>
  equiposPorTipo: Array<{
    tipo: string
    cantidad: number
  }>
  equiposPorDireccion: Array<{
    direccion: string
    cantidad: number
  }>
}

interface EstadisticasTickets {
  totalTickets: number
  ticketsAbiertos: number
  ticketsCerrados: number
  ticketsEnProgreso: number
  ticketsPorTipo: Array<{
    tipo: string
    cantidad: number
    porcentaje: number
  }>
  tiempoPromedioCierreHoras: number
  ticketsResueltosEn24Horas: number
  ticketsResueltosEn72Horas: number
  ticketsPendientesMas7Dias: number
  ticketsPorAnalista: Array<{
    analista: string
    cantidad: number
    tipo: string
  }>
  ticketsPorSistema: Array<{
    sistema: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorFalla: Array<{
    falla: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorPiso: Array<{
    piso: string
    cantidad: number
    porcentaje: number
  }>
  ticketsPorArea: Array<{
    area: string
    cantidad: number
    porcentaje: number
  }>
  totalReasignaciones: number
  ticketsReasignados: number
  ticketsPorCondicionCierre: Array<{
    condicion: string
    cantidad: number
    porcentaje: number
  }>
  ticketsUltimos30Dias: number
  ticketsUltimos7Dias: number
  ticketsHoy: number
  equiposMasReportados: Array<{
    equipo: string
    tipo: string
    cantidadTickets: number
  }>
  usuariosMasAfectados: Array<{
    usuario: string
    area: string
    cantidadTickets: number
  }>
  tiempoPromedioPorTipo: Array<{
    tipo: string
    tiempoPromedioHoras: number
  }>
}

interface EstadisticasEventos {
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

interface SeccionPDF {
  titulo: string
  tipo: 'tabla' | 'texto'
  datos: Array<Record<string, string | number>>
  columnas?: string[]
  esDireccion?: boolean
}

interface ConfiguracionExportacion {
  titulo: string
  nombreArchivo: string
  secciones?: SeccionPDF[]
  datosExcel?: Array<Record<string, string | number>>
}

type ExcelRow = Record<string, string | number>

// Imágenes en Base64 hardcodeadas como fallback
const CINTILLO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function ExportButtons({ tipoEstadistica }: ExportButtonsProps) {
  
  const cargarDatos = async (): Promise<EstadisticasPersonal | EstadisticasEquipos | EstadisticasTickets | EstadisticasEventos | null> => {
    try {
      let endpoint = ""
      
      switch (tipoEstadistica) {
        case "personal":
          endpoint = "/api/estadisticas/personal"
          break
        case "equipos":
          endpoint = "/api/estadisticas/equipos"
          break
        case "tickets":
          endpoint = "/api/estadisticas/tickets"
          break
        case "eventos":
          endpoint = "/api/estadisticas/eventos"
          break
        default:
          return null
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error(`Error cargando datos de ${tipoEstadistica}:`, error)
      return null
    }
  }

  const exportToExcel = async () => {
    const datos = await cargarDatos()
    if (!datos) return

    const config = prepararConfiguracionExcel(tipoEstadistica, datos)
    
    if (config.datosExcel) {
      // Crear workbook
      const workbook = XLSX.utils.book_new()
      
      // Crear hoja principal con datos organizados
      const worksheet = XLSX.utils.json_to_sheet(config.datosExcel)
      
      // Ajustar anchos de columnas
      const colWidths = [
        { wch: 40 }, // Columna Descripción/Métrica
        { wch: 20 }, // Columna Cantidad/Valor
      ]
      worksheet['!cols'] = colWidths
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estadísticas")
      XLSX.writeFile(workbook, `${config.nombreArchivo}.xlsx`)
    }
  }

  const exportToPDF = async () => {
    const datos = await cargarDatos()
    if (!datos) return

    const config = prepararConfiguracionPDF(tipoEstadistica, datos)
    
    const doc = new jsPDF()
    
    // Configuración inicial
    const margin = 15
    const cintilloHeight = 35 // Altura fija del cintillo
    let yPosition = margin // Comenzar en el margen normal
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let currentPage = 1
    let primeraPagina = true // Bandera para identificar la primera página
    
    // Color azul corporativo
    const colorAzul = [0, 51, 102]
    const colorGrisClaro = [245, 245, 245]
    const colorGrisMedio = [220, 220, 220]
    
    // Variables para almacenar las imágenes
    let cintilloBase64: string | null = null
    let logoBase64: string | null = null

    // Función para cargar imagen como Base64 desde URL pública
    const cargarImagenComoBase64 = async (url: string): Promise<string> => {
      try {
        // Para imágenes en la carpeta public
        const publicUrl = url.startsWith('/') ? url : `/${url}`
        const response = await fetch(publicUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result as string)
            } else {
              reject(new Error('Failed to convert image to Base64'))
            }
          }
          reader.onerror = () => reject(new Error('Failed to read image'))
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error(`Error cargando imagen ${url}:`, error)
        // Devolver imagen placeholder en Base64 según el tipo
        if (url.includes('Cintillo')) {
          return CINTILLO_BASE64
        } else {
          return LOGO_BASE64
        }
      }
    }

    // Función para cargar el cintillo una sola vez
    const cargarCintillo = async (): Promise<string> => {
      if (cintilloBase64) return cintilloBase64
      
      try {
        cintilloBase64 = await cargarImagenComoBase64('/Cintillo.png')
      } catch (error) {
        console.error('Error cargando cintillo:', error)
        cintilloBase64 = CINTILLO_BASE64
      }
      return cintilloBase64
    }

    // Función para cargar el logo una sola vez
    const cargarLogo = async (): Promise<string> => {
      if (logoBase64) return logoBase64
      
      try {
        logoBase64 = await cargarImagenComoBase64('/logo.png')
      } catch (error) {
        console.error('Error cargando logo:', error)
        logoBase64 = LOGO_BASE64
      }
      return logoBase64
    }

    // Función para agregar cintillo SOLO en la primera página
    const agregarCintillo = async () => {
      if (!primeraPagina) return // Solo agregar en primera página
      
      try {
        const cintilloImg = await cargarCintillo()
        
        // Agregar cintillo con altura fija de 35px
        doc.addImage(cintilloImg, 'PNG', 0, 0, pageWidth, cintilloHeight)
        
        // Línea separadora más delgada
        doc.setFillColor(200, 200, 200)
        doc.rect(0, cintilloHeight, pageWidth, 1, 'F')
        
        // Ajustar posición Y para que el contenido empiece después del cintillo
        yPosition = cintilloHeight + 10
        
      } catch (error) {
        console.error('Error agregando cintillo:', error)
        // Fallback: cintillo azul sólido
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(0, 0, pageWidth, cintilloHeight, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('REPORTE DE ESTADÍSTICAS', pageWidth / 2, cintilloHeight / 2 - 3, { align: 'center' })
        
        // Ajustar posición Y para el fallback también
        yPosition = cintilloHeight + 10
      }
    }

    // Función para agregar logo SOLO en la última página
    const agregarLogoUltimaPagina = async () => {
      try {
        const logoImg = await cargarLogo()
        
        // Posicionar el logo y el texto correctamente
        const textoPaginaY = pageHeight - 10 // Texto en la parte más baja
        const logoY = textoPaginaY - 35 // Logo 35px arriba del texto (ajusta este número según necesites)
        
        // Agregar logo centrado
        if (logoImg && logoImg.startsWith('data:image/')) {
          const logoWidth = 20
          const logoHeight = 25
          const logoX = (pageWidth - logoWidth) / 2
          doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight)
        }
        
      } catch (error) {
        console.error('Error agregando logo:', error)
        // Fallback: usar el logo base64
        const textoPaginaY = pageHeight - 10
        const logoY = textoPaginaY - 35
        const logoWidth = 20
        const logoHeight = 25
        const logoX = (pageWidth - logoWidth) / 2
        doc.addImage(LOGO_BASE64, 'PNG', logoX, logoY, logoWidth, logoHeight)
      }
    }
    
    // Función para resetear colores de texto
    const resetTextColor = () => {
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
    }
    
    // Función para agregar pie de página con número de página
    const addFooter = async (esUltimaPagina: boolean = false) => {
      const footerY = pageHeight - 10
      
      // AGREGAR LOGO SOLO EN LA ÚLTIMA PÁGINA
      if (esUltimaPagina) {
        await agregarLogoUltimaPagina()
      }
      
      // Texto de página (siempre se muestra)
      doc.setFontSize(7)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Página ${currentPage} - Generado el ${new Date().toLocaleDateString('es-ES')}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      )
    }
    
    // Función para verificar si necesita nueva página
    const checkPageBreak = async (requiredSpace: number) => {
      // Reservar espacio para el footer
      const footerSpace = 20
      
      if (yPosition + requiredSpace > pageHeight - margin - footerSpace) {
        await addFooter(false) // No es la última página
        doc.addPage()
        currentPage++
        primeraPagina = false // Ya no es la primera página
        yPosition = margin // Reset a margen normal para páginas siguientes
        return true
      }
      return false
    }

    // Función mejorada para calcular altura dinámica de filas
    const calcularAlturaFila = (texto: string, maxWidth: number, fontSize: number = 9): number => {
      const lines = doc.splitTextToSize(texto, maxWidth)
      return Math.max(15, lines.length * 5 + 6) // Mínimo 15px, más padding
    }

    // Función optimizada para agregar sección con mejor manejo de texto
    const agregarSeccion = async (titulo: string, datos: Array<{descripcion: string, valor: string}>) => {
      // Espacio antes de cada sección aumentado para mejor separación
      yPosition += 10
      
      // Título de sección
      await checkPageBreak(25) // Más espacio para el título
      doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
      doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 15, 'F') // Altura aumentada
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11) // Tamaño aumentado para mejor legibilidad
      doc.setFont('helvetica', 'bold')
      doc.text(titulo.toUpperCase(), margin, yPosition + 3)
      yPosition += 12

      // Contenido de la sección optimizado
      resetTextColor()
      doc.setFontSize(9) // Tamaño aumentado para mejor legibilidad

      for (let filaIndex = 0; filaIndex < datos.length; filaIndex++) {
        const fila = datos[filaIndex]
        const maxDescWidth = (pageWidth - margin * 2) * 0.35 // 35% para descripción
        const maxValorWidth = (pageWidth - margin * 2) * 0.55 // 55% para valor (más espacio)
        
        const descLines = doc.splitTextToSize(fila.descripcion, maxDescWidth)
        const valorLines = doc.splitTextToSize(fila.valor, maxValorWidth)
        
        // Calcular altura dinámica basada en el contenido más largo
        const alturaDesc = descLines.length * 4.5
        const alturaValor = valorLines.length * 4.5
        const alturaFila = Math.max(15, Math.max(alturaDesc, alturaValor) + 6) // Mínimo 15px, más padding

        await checkPageBreak(alturaFila + 5)

        // Color de fondo alternado más sutil
        if (filaIndex % 2 === 0) {
          doc.setFillColor(255, 255, 255)
        } else {
          doc.setFillColor(colorGrisClaro[0], colorGrisClaro[1], colorGrisClaro[2])
        }
        doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaFila, 'F')

        // Borde más sutil
        doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
        doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaFila, 'S')

        // Texto de descripción (alineado a la izquierda)
        resetTextColor()
        doc.setFont('helvetica', 'normal')
        descLines.forEach((line: string, lineIndex: number) => {
          doc.text(line, margin + 4, yPosition + 6 + (lineIndex * 4.5))
        })

        // Texto de valor (negrita y alineado a la izquierda con margen)
        resetTextColor()
        doc.setFont('helvetica', 'bold')
        const valorX = margin + maxDescWidth + 8 // Espacio entre columnas aumentado
        valorLines.forEach((line: string, lineIndex: number) => {
          doc.text(line, valorX, yPosition + 6 + (lineIndex * 4.5))
        })
        doc.setFont('helvetica', 'normal')

        yPosition += alturaFila + 2 // Espacio entre filas aumentado
      }

      yPosition += 8 // Espacio aumentado entre secciones
    }
    
    try {
      // AGREGAR CINTILLO SOLO EN LA PRIMERA PÁGINA
      await agregarCintillo()

      // Título principal - Solo en primera página
      if (primeraPagina) {
        await checkPageBreak(30)
        doc.setFontSize(16) // Tamaño aumentado
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.text(config.titulo.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 8
        
        doc.setFontSize(11) // Tamaño aumentado
        const fechaGeneracion = `Generado el ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        })}`
        doc.text(fechaGeneracion, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 12
      }

      // Contenido de las secciones
      for (const seccion of config.secciones || []) {
        // Convertir datos de la sección al formato esperado
        const datosSeccion = seccion.datos.map(fila => {
          const keys = Object.keys(fila)
          return {
            descripcion: String(fila[keys[0]]),
            valor: String(fila[keys[1]])
          }
        })

        // Usar la función mejorada agregarSeccion
        await agregarSeccion(seccion.titulo, datosSeccion)
      }
      
      // AGREGAR FOOTER FINAL CON LOGO (SOLO EN LA ÚLTIMA PÁGINA)
      await addFooter(true) // true indica que es la última página
      
      doc.save(`${config.nombreArchivo}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intente nuevamente.')
    }
  }

  const prepararConfiguracionExcel = (
    tipo: "personal" | "equipos" | "tickets" | "eventos", 
    datos: EstadisticasPersonal | EstadisticasEquipos | EstadisticasTickets | EstadisticasEventos
  ): ConfiguracionExportacion => {
    const fecha = new Date().toISOString().split('T')[0]

    if (tipo === "personal") {
      const datosPersonal = datos as EstadisticasPersonal
      const datosExcel: ExcelRow[] = [
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Usuarios', 'Cantidad': datosPersonal.totalUsuarios },
        { 'Descripción': 'Usuarios Activos', 'Cantidad': datosPersonal.usuariosActivos },
        { 'Descripción': 'Usuarios Deshabilitados', 'Cantidad': datosPersonal.usuariosDeshabilitados },
        { 'Descripción': 'Usuarios con Equipos', 'Cantidad': datosPersonal.usuariosConEquipos },
        { 'Descripción': 'Usuarios sin Equipos', 'Cantidad': datosPersonal.usuariosSinEquipos },
        { 'Descripción': 'Total Equipos Asignados', 'Cantidad': datosPersonal.totalEquiposAsignados },
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR ROLES', 'Cantidad': '' },
        ...datosPersonal.usuariosPorRol.map(rol => ({ 
          'Descripción': rol.rol, 
          'Cantidad': rol.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR PISOS', 'Cantidad': '' },
        ...datosPersonal.usuariosPorPiso.map(piso => ({ 
          'Descripción': piso.piso, 
          'Cantidad': piso.cantidad 
        }))
      ]

      return {
        titulo: "Estadísticas de Personal",
        nombreArchivo: `estadisticas_personal_${fecha}`,
        datosExcel
      }
    } else if (tipo === "equipos") {
      const datosEquipos = datos as EstadisticasEquipos
      const datosExcel: ExcelRow[] = [
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Equipos', 'Cantidad': datosEquipos.totalEquipos },
        { 'Descripción': 'Equipos Asignados', 'Cantidad': datosEquipos.equiposAsignados },
        { 'Descripción': 'Equipos No Asignados', 'Cantidad': datosEquipos.equiposNoAsignados },
        { 'Descripción': 'En Uso y Operativos', 'Cantidad': datosEquipos.equiposEnUsoOperativos },
        { 'Descripción': 'Equipos Desincorporados', 'Cantidad': datosEquipos.equiposDesincorporados },
        { 'Descripción': 'Con Observaciones', 'Cantidad': datosEquipos.equiposConObservaciones },
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR STATUS', 'Cantidad': '' },
        ...datosEquipos.equiposPorStatus.map(status => ({ 
          'Descripción': status.status, 
          'Cantidad': status.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR TIPO', 'Cantidad': '' },
        ...datosEquipos.equiposPorTipo.map(tipoItem => ({ 
          'Descripción': tipoItem.tipo, 
          'Cantidad': tipoItem.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR DIRECCIÓN', 'Cantidad': '' },
        ...datosEquipos.equiposPorDireccion.map(direccion => ({ 
          'Descripción': direccion.direccion, 
          'Cantidad': direccion.cantidad 
        }))
      ]

      return {
        titulo: "Estadísticas de Equipos",
        nombreArchivo: `estadisticas_equipos_${fecha}`,
        datosExcel
      }
    } else if (tipo === "tickets") {
      const datosTickets = datos as EstadisticasTickets
      
      const porcentajeAbiertos = datosTickets.totalTickets > 0 ? (datosTickets.ticketsAbiertos / datosTickets.totalTickets) * 100 : 0
      const porcentajeCerrados = datosTickets.totalTickets > 0 ? (datosTickets.ticketsCerrados / datosTickets.totalTickets) * 100 : 0
      const porcentajeEnProgreso = datosTickets.totalTickets > 0 ? (datosTickets.ticketsEnProgreso / datosTickets.totalTickets) * 100 : 0
      const porcentajeReasignados = datosTickets.totalTickets > 0 ? (datosTickets.ticketsReasignados / datosTickets.totalTickets) * 100 : 0
      const porcentajeResueltos24h = datosTickets.ticketsCerrados > 0 ? (datosTickets.ticketsResueltosEn24Horas / datosTickets.ticketsCerrados) * 100 : 0
      const porcentajeResueltos72h = datosTickets.ticketsCerrados > 0 ? (datosTickets.ticketsResueltosEn72Horas / datosTickets.ticketsCerrados) * 100 : 0

      const datosExcel: ExcelRow[] = [
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Tickets', 'Cantidad': datosTickets.totalTickets },
        { 'Descripción': 'Tickets Abiertos', 'Cantidad': `${datosTickets.ticketsAbiertos} (${porcentajeAbiertos.toFixed(1)}%)` },
        { 'Descripción': 'Tickets Cerrados', 'Cantidad': `${datosTickets.ticketsCerrados} (${porcentajeCerrados.toFixed(1)}%)` },
        { 'Descripción': 'Tickets en Progreso', 'Cantidad': `${datosTickets.ticketsEnProgreso} (${porcentajeEnProgreso.toFixed(1)}%)` },
        { 'Descripción': 'Tiempo Promedio de Cierre (horas)', 'Cantidad': datosTickets.tiempoPromedioCierreHoras },
        { 'Descripción': 'Tickets Resueltos en 24h', 'Cantidad': `${datosTickets.ticketsResueltosEn24Horas} (${porcentajeResueltos24h.toFixed(1)}% de cerrados)` },
        { 'Descripción': 'Tickets Resueltos en 72h', 'Cantidad': `${datosTickets.ticketsResueltosEn72Horas} (${porcentajeResueltos72h.toFixed(1)}% de cerrados)` },
        { 'Descripción': 'Tickets Pendientes +7 días', 'Cantidad': datosTickets.ticketsPendientesMas7Dias },
        { 'Descripción': 'Total Reasignaciones', 'Cantidad': datosTickets.totalReasignaciones },
        { 'Descripción': 'Tickets Reasignados', 'Cantidad': `${datosTickets.ticketsReasignados} (${porcentajeReasignados.toFixed(1)}%)` },
        { 'Descripción': 'Tickets Hoy', 'Cantidad': datosTickets.ticketsHoy },
        { 'Descripción': 'Tickets Últimos 7 Días', 'Cantidad': datosTickets.ticketsUltimos7Dias },
        { 'Descripción': 'Tickets Últimos 30 Días', 'Cantidad': datosTickets.ticketsUltimos30Dias },
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR TIPO DE TICKET', 'Cantidad': '' },
        ...datosTickets.ticketsPorTipo.map(tipo => ({ 
          'Descripción': tipo.tipo, 
          'Cantidad': `${tipo.cantidad} (${tipo.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'CONDICIONES DE CIERRE', 'Cantidad': '' },
        ...datosTickets.ticketsPorCondicionCierre.map(condicion => ({ 
          'Descripción': condicion.condicion, 
          'Cantidad': `${condicion.cantidad} (${condicion.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'SISTEMAS MÁS AFECTADOS', 'Cantidad': '' },
        ...datosTickets.ticketsPorSistema.map(sistema => ({ 
          'Descripción': sistema.sistema, 
          'Cantidad': `${sistema.cantidad} (${sistema.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'FALLAS MÁS COMUNES', 'Cantidad': '' },
        ...datosTickets.ticketsPorFalla.map(falla => ({ 
          'Descripción': falla.falla, 
          'Cantidad': `${falla.cantidad} (${falla.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR PISOS', 'Cantidad': '' },
        ...datosTickets.ticketsPorPiso.map(piso => ({ 
          'Descripción': `Piso ${piso.piso}`, 
          'Cantidad': `${piso.cantidad} (${piso.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR ÁREAS', 'Cantidad': '' },
        ...datosTickets.ticketsPorArea.map(area => ({ 
          'Descripción': area.area, 
          'Cantidad': `${area.cantidad} (${area.porcentaje.toFixed(1)}%)` 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'ANALISTAS CON MÁS TICKETS ASIGNADOS', 'Cantidad': '' },
        ...datosTickets.ticketsPorAnalista.map(analista => ({ 
          'Descripción': `${analista.analista} (${analista.tipo})`, 
          'Cantidad': analista.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'EQUIPOS MÁS REPORTADOS', 'Cantidad': '' },
        ...datosTickets.equiposMasReportados.map(equipo => ({ 
          'Descripción': `${equipo.equipo} (${equipo.tipo})`, 
          'Cantidad': equipo.cantidadTickets 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'USUARIOS MÁS AFECTADOS', 'Cantidad': '' },
        ...datosTickets.usuariosMasAfectados.map(usuario => ({ 
          'Descripción': `${usuario.usuario} (${usuario.area})`, 
          'Cantidad': usuario.cantidadTickets 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'TIEMPO PROMEDIO DE RESOLUCIÓN POR TIPO', 'Cantidad': '' },
        ...datosTickets.tiempoPromedioPorTipo.map(tipo => ({ 
          'Descripción': tipo.tipo, 
          'Cantidad': `${tipo.tiempoPromedioHoras.toFixed(1)} horas` 
        }))
      ]

      return {
        titulo: "Estadísticas de Tickets",
        nombreArchivo: `estadisticas_tickets_${fecha}`,
        datosExcel
      }
    } else if (tipo === "eventos") {
      const datosEventos = datos as EstadisticasEventos
      const datosExcel: ExcelRow[] = [
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Eventos', 'Cantidad': datosEventos.totalEventos },
        { 'Descripción': 'Eventos Activos', 'Cantidad': datosEventos.eventosActivos },
        { 'Descripción': 'Eventos Completados', 'Cantidad': datosEventos.eventosCompletados },
        { 'Descripción': 'Eventos Rechazados', 'Cantidad': datosEventos.eventosRechazados },
        { 'Descripción': 'Duración Promedio (días)', 'Cantidad': datosEventos.duracionPromedioDias },
        { 'Descripción': 'Eventos Este Mes', 'Cantidad': datosEventos.eventosEsteMes },
        { 'Descripción': 'Eventos Esta Semana', 'Cantidad': datosEventos.eventosEstaSemana },
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR ESTADO', 'Cantidad': '' },
        ...datosEventos.eventosPorEstado.map(estado => ({ 
          'Descripción': estado.estado, 
          'Cantidad': estado.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'DISTRIBUCIÓN POR PISOS', 'Cantidad': '' },
        ...datosEventos.eventosPorPiso.map(piso => ({ 
          'Descripción': `Piso ${piso.piso}`, 
          'Cantidad': piso.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'TOP SOLICITANTES', 'Cantidad': '' },
        ...datosEventos.topSolicitantes.map(solicitante => ({ 
          'Descripción': solicitante.usuario, 
          'Cantidad': solicitante.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        { 'Descripción': 'EQUIPOS MÁS SOLICITADOS', 'Cantidad': '' },
        ...datosEventos.equiposMasSolicitados.map(equipo => ({ 
          'Descripción': equipo.equipo, 
          'Cantidad': equipo.cantidad 
        }))
      ]

      return {
        titulo: "Estadísticas de Eventos",
        nombreArchivo: `estadisticas_eventos_${fecha}`,
        datosExcel
      }
    }

    return {
      titulo: `Estadísticas de ${tipo}`,
      nombreArchivo: `estadisticas_${tipo}_${fecha}`,
      datosExcel: [{ 'Descripción': `Estadísticas de ${tipo} no disponibles`, 'Cantidad': '' }]
    }
  }

  const prepararConfiguracionPDF = (
    tipo: "personal" | "equipos" | "tickets" | "eventos", 
    datos: EstadisticasPersonal | EstadisticasEquipos | EstadisticasTickets | EstadisticasEventos
  ): ConfiguracionExportacion => {
    const fecha = new Date().toISOString().split('T')[0]

    if (tipo === "personal") {
      const datosPersonal = datos as EstadisticasPersonal
      const secciones: SeccionPDF[] = [
        {
          titulo: 'Estadísticas Principales',
          tipo: 'tabla',
          datos: [
            { 'Descripción': 'Total de Usuarios', 'Cantidad': datosPersonal.totalUsuarios },
            { 'Descripción': 'Usuarios Activos', 'Cantidad': datosPersonal.usuariosActivos },
            { 'Descripción': 'Usuarios Deshabilitados', 'Cantidad': datosPersonal.usuariosDeshabilitados },
            { 'Descripción': 'Usuarios con Equipos', 'Cantidad': datosPersonal.usuariosConEquipos },
            { 'Descripción': 'Usuarios sin Equipos', 'Cantidad': datosPersonal.usuariosSinEquipos },
            { 'Descripción': 'Total Equipos Asignados', 'Cantidad': datosPersonal.totalEquiposAsignados }
          ]
        },
        {
          titulo: 'Distribución por Roles',
          tipo: 'tabla',
          datos: datosPersonal.usuariosPorRol.map(rol => ({
            'Descripción': rol.rol,
            'Cantidad': rol.cantidad
          }))
        },
        {
          titulo: 'Distribución por Pisos',
          tipo: 'tabla',
          datos: datosPersonal.usuariosPorPiso.map(piso => ({
            'Descripción': piso.piso,
            'Cantidad': piso.cantidad
          }))
        }
      ]

      return {
        titulo: "Estadísticas de Personal",
        nombreArchivo: `estadisticas_personal_${fecha}`,
        secciones
      }
    } else if (tipo === "equipos") {
      const datosEquipos = datos as EstadisticasEquipos
      const secciones: SeccionPDF[] = [
        {
          titulo: 'Estadísticas Principales',
          tipo: 'tabla',
          datos: [
            { 'Descripción': 'Total de Equipos', 'Cantidad': datosEquipos.totalEquipos },
            { 'Descripción': 'Equipos Asignados', 'Cantidad': datosEquipos.equiposAsignados },
            { 'Descripción': 'Equipos No Asignados', 'Cantidad': datosEquipos.equiposNoAsignados },
            { 'Descripción': 'En Uso y Operativos', 'Cantidad': datosEquipos.equiposEnUsoOperativos },
            { 'Descripción': 'Equipos Desincorporados', 'Cantidad': datosEquipos.equiposDesincorporados },
            { 'Descripción': 'Con Observaciones', 'Cantidad': datosEquipos.equiposConObservaciones }
          ]
        },
        {
          titulo: 'Distribución por Status',
          tipo: 'tabla',
          datos: datosEquipos.equiposPorStatus.map(status => ({
            'Descripción': status.status,
            'Cantidad': status.cantidad
          }))
        },
        {
          titulo: 'Distribución por Tipo',
          tipo: 'tabla',
          datos: datosEquipos.equiposPorTipo.map(tipoItem => ({
            'Descripción': tipoItem.tipo,
            'Cantidad': tipoItem.cantidad
          }))
        },
        {
          titulo: 'Distribución por Dirección',
          tipo: 'tabla',
          datos: datosEquipos.equiposPorDireccion.map(direccion => ({
            'Descripción': direccion.direccion,
            'Cantidad': direccion.cantidad
          }))
        }
      ]

      return {
        titulo: "Estadísticas de Equipos",
        nombreArchivo: `estadisticas_equipos_${fecha}`,
        secciones
      }
    } else if (tipo === "tickets") {
      const datosTickets = datos as EstadisticasTickets
      const secciones: SeccionPDF[] = [
        {
          titulo: 'Estadísticas Principales',
          tipo: 'tabla',
          datos: [
            { 'Descripción': 'Total de Tickets', 'Cantidad': datosTickets.totalTickets },
            { 'Descripción': 'Tickets Abiertos', 'Cantidad': datosTickets.ticketsAbiertos },
            { 'Descripción': 'Tickets Cerrados', 'Cantidad': datosTickets.ticketsCerrados },
            { 'Descripción': 'Tickets en Progreso', 'Cantidad': datosTickets.ticketsEnProgreso },
            { 'Descripción': 'Tiempo Promedio (horas)', 'Cantidad': datosTickets.tiempoPromedioCierreHoras },
            { 'Descripción': 'Resueltos en 24h', 'Cantidad': datosTickets.ticketsResueltosEn24Horas },
            { 'Descripción': 'Resueltos en 72h', 'Cantidad': datosTickets.ticketsResueltosEn72Horas },
            { 'Descripción': 'Pendientes +7 días', 'Cantidad': datosTickets.ticketsPendientesMas7Dias },
            { 'Descripción': 'Total Reasignaciones', 'Cantidad': datosTickets.totalReasignaciones },
            { 'Descripción': 'Tickets Reasignados', 'Cantidad': datosTickets.ticketsReasignados },
            { 'Descripción': 'Tickets Hoy', 'Cantidad': datosTickets.ticketsHoy },
            { 'Descripción': 'Últimos 7 Días', 'Cantidad': datosTickets.ticketsUltimos7Dias },
            { 'Descripción': 'Últimos 30 Días', 'Cantidad': datosTickets.ticketsUltimos30Dias }
          ]
        },
        {
          titulo: 'Distribución por Tipo de Ticket',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorTipo.map(tipo => ({
            'Descripción': tipo.tipo,
            'Cantidad': tipo.cantidad
          }))
        },
        {
          titulo: 'Condiciones de Cierre',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorCondicionCierre.map(condicion => ({
            'Descripción': condicion.condicion,
            'Cantidad': condicion.cantidad
          }))
        },
        {
          titulo: 'Sistemas Más Afectados',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorSistema.map(sistema => ({
            'Descripción': sistema.sistema,
            'Cantidad': sistema.cantidad
          }))
        },
        {
          titulo: 'Fallas Más Comunes',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorFalla.map(falla => ({
            'Descripción': falla.falla,
            'Cantidad': falla.cantidad
          }))
        },
        {
          titulo: 'Distribución por Pisos',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorPiso.map(piso => ({
            'Descripción': `Piso ${piso.piso}`,
            'Cantidad': piso.cantidad
          }))
        },
        {
          titulo: 'Distribución por Áreas',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorArea.map(area => ({
            'Descripción': area.area,
            'Cantidad': area.cantidad
          }))
        },
        {
          titulo: 'Analistas con Más Tickets',
          tipo: 'tabla',
          datos: datosTickets.ticketsPorAnalista.map(analista => ({
            'Descripción': `${analista.analista} (${analista.tipo})`,
            'Cantidad': analista.cantidad
          }))
        },
        {
          titulo: 'Equipos Más Reportados',
          tipo: 'tabla',
          datos: datosTickets.equiposMasReportados.map(equipo => ({
            'Descripción': `${equipo.equipo} (${equipo.tipo})`,
            'Cantidad': equipo.cantidadTickets
          }))
        },
        {
          titulo: 'Usuarios Más Afectados',
          tipo: 'tabla',
          datos: datosTickets.usuariosMasAfectados.map(usuario => ({
            'Descripción': `${usuario.usuario} (${usuario.area})`,
            'Cantidad': usuario.cantidadTickets
          }))
        },
        {
          titulo: 'Tiempo Promedio por Tipo',
          tipo: 'tabla',
          datos: datosTickets.tiempoPromedioPorTipo.map(tipo => ({
            'Descripción': tipo.tipo,
            'Cantidad': `${tipo.tiempoPromedioHoras.toFixed(1)} horas`
          }))
        }
      ]

      return {
        titulo: "Estadísticas de Tickets",
        nombreArchivo: `estadisticas_tickets_${fecha}`,
        secciones
      }
    } else if (tipo === "eventos") {
      const datosEventos = datos as EstadisticasEventos
      const secciones: SeccionPDF[] = [
        {
          titulo: 'Estadísticas Principales',
          tipo: 'tabla',
          datos: [
            { 'Descripción': 'Total de Eventos', 'Cantidad': datosEventos.totalEventos },
            { 'Descripción': 'Eventos Activos', 'Cantidad': datosEventos.eventosActivos },
            { 'Descripción': 'Eventos Completados', 'Cantidad': datosEventos.eventosCompletados },
            { 'Descripción': 'Eventos Rechazados', 'Cantidad': datosEventos.eventosRechazados },
            { 'Descripción': 'Duración Promedio (días)', 'Cantidad': datosEventos.duracionPromedioDias },
            { 'Descripción': 'Eventos Este Mes', 'Cantidad': datosEventos.eventosEsteMes },
            { 'Descripción': 'Eventos Esta Semana', 'Cantidad': datosEventos.eventosEstaSemana }
          ]
        },
        {
          titulo: 'Distribución por Estado',
          tipo: 'tabla',
          datos: datosEventos.eventosPorEstado.map(estado => ({
            'Descripción': estado.estado,
            'Cantidad': estado.cantidad
          }))
        },
        {
          titulo: 'Distribución por Pisos',
          tipo: 'tabla',
          datos: datosEventos.eventosPorPiso.map(piso => ({
            'Descripción': `Piso ${piso.piso}`,
            'Cantidad': piso.cantidad
          }))
        },
        {
          titulo: 'Top Solicitantes',
          tipo: 'tabla',
          datos: datosEventos.topSolicitantes.map(solicitante => ({
            'Descripción': solicitante.usuario,
            'Cantidad': solicitante.cantidad
          }))
        },
        {
          titulo: 'Equipos Más Solicitados',
          tipo: 'tabla',
          datos: datosEventos.equiposMasSolicitados.map(equipo => ({
            'Descripción': equipo.equipo,
            'Cantidad': equipo.cantidad
          }))
        }
      ]

      return {
        titulo: "Estadísticas de Eventos",
        nombreArchivo: `estadisticas_eventos_${fecha}`,
        secciones
      }
    }

    return {
      titulo: `Estadísticas de ${tipo}`,
      nombreArchivo: `estadisticas_${tipo}_${fecha}`,
      secciones: [{
        titulo: 'Información',
        tipo: 'texto',
        datos: [{ 'Mensaje': `Estadísticas de ${tipo} no disponibles` }]
      }]
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={exportToExcel}
        className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all  transform hover:scale-105 duration-200 text-sm font-medium shadow-md"
      >
        <Sheet className="w-4 h-4" />
        Excel
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-md"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
    </div>
  )
}