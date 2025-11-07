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
    const margin = 20
    let yPosition = margin // Se actualizará después del cintillo
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let currentPage = 1
    
    // Color azul corporativo
    const colorAzul = [0, 51, 102] // #003366
    const colorGris = [245, 245, 245]
    
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

    // Función para agregar cintillo (SOLO en primera página) - TAMAÑO ESPECÍFICO
    const agregarCintillo = async () => {
      try {
        // Intentar cargar el cintillo
        let cintilloBase64
        try {
          cintilloBase64 = await cargarImagenComoBase64('/Cintillo.png')
        } catch (error) {
          console.log('Usando fallback para cintillo')
          cintilloBase64 = CINTILLO_BASE64
        }
        
        // Verificar que la imagen Base64 sea válida
        if (!cintilloBase64.startsWith('data:image/')) {
          throw new Error('Formato Base64 inválido para cintillo')
        }
        
        // TAMAÑO ESPECÍFICO PARA EL CINTILLO (50 unidades ≈ 3.5cm en A4)
        const cintilloHeight = 50
        
        // Agregar el cintillo en la parte superior
        doc.addImage(cintilloBase64, 'PNG', 0, 0, pageWidth, cintilloHeight)
        
        // Agregar sombra sutil debajo del cintillo
        doc.setFillColor(200, 200, 200)
        doc.rect(0, cintilloHeight, pageWidth, 2, 'F')
        
        // Actualizar yPosition para que el contenido empiece después del cintillo
        yPosition = cintilloHeight + 15
        
      } catch (error) {
        console.error('Error cargando cintillo, usando fallback completo:', error)
        // Fallback completo: rectángulo azul si no carga la imagen
        const cintilloHeight = 50 // Mismo tamaño para el fallback
        
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(0, 0, pageWidth, cintilloHeight, 'F')
        
        // Título en el fallback
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text(config.titulo, pageWidth / 2, cintilloHeight / 2 - 5, { align: 'center' })
        
        // Información de generación en el fallback
        doc.setFontSize(10)
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`, pageWidth / 2, cintilloHeight / 2 + 10, { align: 'center' })
        
        // Actualizar yPosition para el fallback también
        yPosition = cintilloHeight + 15
      }
    }
    
    // Función para agregar logo al final
    const agregarLogoFinal = async () => {
      try {
        // Intentar cargar el logo
        let logoBase64
        try {
          logoBase64 = await cargarImagenComoBase64('/logo.png')
        } catch (error) {
          console.log('Usando fallback para logo')
          logoBase64 = LOGO_BASE64
        }
        
        // Agregar espacio antes del logo
        yPosition += 20
        
        // Agregar línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 15
        
        // Agregar logo centrado (solo si tenemos una imagen válida)
        if (logoBase64 && logoBase64.startsWith('data:image/')) {
          const logoWidth = 40
          const logoHeight = 40
          const logoX = (pageWidth - logoWidth) / 2
          doc.addImage(logoBase64, 'PNG', logoX, yPosition, logoWidth, logoHeight)
          yPosition += logoHeight + 10
        }
        
        // Texto debajo del logo
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.setFont('helvetica', 'normal')
        doc.text('Sistema de Gestión de TI', pageWidth / 2, yPosition, { align: 'center' })
        
      } catch (error) {
        console.error('Error agregando logo:', error)
        // Fallback: texto simple
        yPosition += 20
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text('Sistema de Gestión de TI', pageWidth / 2, yPosition, { align: 'center' })
      }
    }
    
    // Función para resetear colores de texto
    const resetTextColor = () => {
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
    }
    
    // Función para agregar pie de página
    const addFooter = () => {
      const footerY = pageHeight - 15
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Página ${currentPage} - Generado el ${new Date().toLocaleDateString('es-ES')}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      )
    }
    
    // Función para verificar si necesita nueva página (CORREGIDA)
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        addFooter()
        doc.addPage()
        currentPage++
        yPosition = margin // Reset a margen normal para páginas siguientes
        return true
      }
      return false
    }
    
    try {
      // Agregar cintillo SOLO en la primera página
      await agregarCintillo()
      
      // Contenido de las secciones
      config.secciones?.forEach((seccion: SeccionPDF, seccionIndex: number) => {
        // Espacio antes de cada sección (excepto la primera)
        if (seccionIndex > 0) {
          yPosition += 15
        }
        
        // Título de sección (mejorado)
        checkPageBreak(25)
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(margin - 2, yPosition - 8, pageWidth - (margin * 2) + 4, 16, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(seccion.titulo.toUpperCase(), margin, yPosition + 2)
        yPosition += 12
        
        if (seccion.tipo === 'tabla') {
          resetTextColor()
          doc.setFontSize(9)
          
          seccion.datos.forEach((fila: Record<string, string | number>, filaIndex: number) => {
            checkPageBreak(18)
            
            // Color de fondo alternado mejorado
            if (filaIndex % 2 === 0) {
              doc.setFillColor(255, 255, 255)
            } else {
              doc.setFillColor(colorGris[0], colorGris[1], colorGris[2])
            }
            doc.rect(margin, yPosition, pageWidth - (margin * 2), 15, 'F')
            
            // Borde sutil
            doc.setDrawColor(220, 220, 220)
            doc.rect(margin, yPosition, pageWidth - (margin * 2), 15, 'S')
            
            // Texto/descripción a la izquierda
            const texto = String(fila[Object.keys(fila)[0]])
            const valor = String(fila[Object.keys(fila)[1]])
            
            // Dividir texto en múltiples líneas si es necesario
            const textoLines = doc.splitTextToSize(texto, pageWidth - margin - 80)
            
            // Texto (negro)
            resetTextColor()
            doc.setFont('helvetica', 'normal')
            textoLines.forEach((line: string, lineIndex: number) => {
              doc.text(line, margin + 5, yPosition + 6 + (lineIndex * 4))
            })
            
            // Valor/Cantidad a la derecha (negro y en negrita)
            resetTextColor()
            doc.setFont('helvetica', 'bold')
            const valorLines = doc.splitTextToSize(valor, 60)
            valorLines.forEach((line: string, lineIndex: number) => {
              doc.text(line, pageWidth - margin - 65, yPosition + 6 + (lineIndex * 4))
            })
            doc.setFont('helvetica', 'normal')
            
            yPosition += Math.max(15, textoLines.length * 4 + 8)
          })
          
          yPosition += 8
          
        } else if (seccion.tipo === 'texto') {
          seccion.datos.forEach((textoObj: Record<string, string | number>) => {
            Object.values(textoObj).forEach((texto: string | number) => {
              checkPageBreak(12)
              doc.setFontSize(10)
              resetTextColor()
              
              // Dividir texto largo en múltiples líneas
              const lines = doc.splitTextToSize(String(texto), pageWidth - (margin * 2))
              lines.forEach((line: string) => {
                checkPageBreak(6)
                doc.text(line, margin, yPosition)
                yPosition += 5
              })
              
              yPosition += 3
            })
          })
        }
      })
      
      // Agregar logo al final del documento
      checkPageBreak(80) // Espacio suficiente para el logo
      await agregarLogoFinal()
      
      // Agregar pie de página final
      addFooter()
      
      doc.save(`${config.nombreArchivo}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intente nuevamente.')
    }
  }

  // ... (las funciones prepararConfiguracionExcel y prepararConfiguracionPDF permanecen igual)

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