"use client"

import { useState } from "react"
import { FileText, X, Download, Loader, Sheet } from "lucide-react"
import { Ticket } from "../../../types/ticket"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"

interface ExportarPDFModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
}

// Imágenes en Base64 hardcodeadas como fallback
const CINTILLO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function ExportarPDFModal({ isOpen, onClose, ticket }: ExportarPDFModalProps) {
  const [loading, setLoading] = useState(false)
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null)

  const getNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre;
  };

  // Función para cargar imagen como Base64 desde URL pública
  const cargarImagenComoBase64 = async (url: string): Promise<string> => {
    try {
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
      if (url.includes('Cintillo')) {
        return CINTILLO_BASE64
      } else {
        return LOGO_BASE64
      }
    }
  }

  const generarExcel = async () => {
    if (!ticket) return

    setLoading(true)
    setExportType('excel')
    
    try {
      // Crear workbook
      const workbook = XLSX.utils.book_new()

      // Datos principales del ticket (optimizados)
      const datosPrincipales = [
        ['REPORTE DE TICKET', ''],
        [`Ticket #${ticket.id} - ${ticket.titulo}`, ''],
        ['', ''],
        ['INFORMACIÓN BÁSICA', ''],
        ['Título', ticket.titulo],
        ['Estado', ticket.estado.estado],
        ['Tipo de Ticket', ticket.tipoTicket.tipo],
        ['Fecha/Hora creación', `${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_creacion).toLocaleTimeString('es-ES')}`],
        ...(ticket.fecha_cierre ? [
          ['Fecha/Hora cierre', `${new Date(ticket.fecha_cierre).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_cierre).toLocaleTimeString('es-ES')}`]
        ] : []),
        ['', ''],
        ['INFORMACIÓN DE ASIGNACIÓN', ''],
        ['Creado por', getNombreCompleto(ticket.usuarioCreador)],
        ...(ticket.usuarioCerrador ? [
          ['Asignado a', getNombreCompleto(ticket.usuarioCerrador)],
          ...(ticket.usuarioCerrador.tipoAnalista ? [
            ['Tipo de analista', ticket.usuarioCerrador.tipoAnalista.tipo]
          ] : [])
        ] : []),
        ...(ticket.tiempoEjecucion ? [
          ['Tiempo de ejecución', ticket.tiempoEjecucion]
        ] : []),
        ['', ''],
        ['DESCRIPCIÓN', ''],
        [ticket.descripcion, ''],
        ['', '']
      ]

      // Agregar usuario afectado si existe
      if (ticket.usuarioAfectado) {
        datosPrincipales.push(
          ['USUARIO AFECTADO', ''],
          ['Nombre', getNombreCompleto(ticket.usuarioAfectado)],
          ...(ticket.usuarioAfectado.cedula ? [['Cédula', ticket.usuarioAfectado.cedula]] : []),
          ...(ticket.usuarioAfectado.direccion ? [
            ['Ubicación', `${ticket.usuarioAfectado.direccion.piso.piso} - ${ticket.usuarioAfectado.direccion.direccion}`]
          ] : []),
          ...(ticket.usuarioAfectado.area ? [['Área', ticket.usuarioAfectado.area.nombre]] : []),
          ['', '']
        )
      }

      // Agregar equipos afectados si existen (formato compacto)
      if (ticket.ticketEquipos && ticket.ticketEquipos.length > 0) {
        datosPrincipales.push(['EQUIPOS AFECTADOS', ''])
        ticket.ticketEquipos.forEach((ticketEquipo, index) => {
          const equipo = ticketEquipo.equipo
          datosPrincipales.push(
            [`Equipo ${index + 1}`, `${equipo.tipoEquipo?.nombre || 'Equipo'} - ${equipo.modelo?.marca?.nombre || ''} ${equipo.modelo?.nombre || ''}`],
            [`  Bien Nacional/Serial`, `${equipo.bienNacional || 'N/A'} / ${equipo.serial || 'N/A'}`],
            [`  Status`, equipo.status?.estado || 'No especificado'],
            ['', '']
          )
        })
      }

      // Agregar información de sistemas si existe
      if (ticket.TicketSistema && ticket.TicketSistema.length > 0) {
        datosPrincipales.push(['INFORMACIÓN DE SISTEMAS', ''])
        ticket.TicketSistema.forEach((ticketSistema, index) => {
          datosPrincipales.push(
            [`Sistema ${index + 1}`, `${ticketSistema.sistema?.nombre || 'N/A'} - ${ticketSistema.falla?.nombre || 'N/A'}`],
            [`  Descripción`, ticketSistema.descripcion || 'No especificada'],
            ['', '']
          )
        })
      }

      // Agregar información de cierre si existe
      if (ticket.estadoId === 2 && ticket.ticketCierre) {
        datosPrincipales.push(
          ['INFORMACIÓN DE CIERRE', ''],
          ['Condición', ticket.ticketCierre.condicion],
          ['Memo Finalización', ticket.ticketCierre.memoFinalizacion],
          ...(ticket.ticketCierre.observaciones ? [
            ['Observaciones', ticket.ticketCierre.observaciones]
          ] : []),
          ...(ticket.ticketCierre.usuarioCerrador ? [
            ['Cerrado por', getNombreCompleto(ticket.ticketCierre.usuarioCerrador)]
          ] : []),
          ['', '']
        )
      }

      // Agregar reasignaciones si existen (formato compacto)
      const reasignaciones = ticket.ticketReasignaciones || ticket.reasignaciones || []
      if (reasignaciones.length > 0) {
        datosPrincipales.push(['HISTORIAL DE REASIGNACIONES', ''])
        reasignaciones.forEach((reasignacion, index) => {
          datosPrincipales.push(
            [`Reasignación ${index + 1}`, `${reasignacion.analistaAnterior ? getNombreCompleto(reasignacion.analistaAnterior) : 'N/A'} → ${reasignacion.analistaNuevo ? getNombreCompleto(reasignacion.analistaNuevo) : 'N/A'}`],
            [`  Fecha/Hora`, `${new Date(reasignacion.fechaReasignacion).toLocaleDateString('es-ES')} ${new Date(reasignacion.fechaReasignacion).toLocaleTimeString('es-ES')}`],
            ...(reasignacion.motivo ? [['  Motivo', reasignacion.motivo]] : []),
            ...(reasignacion.supervisor ? [['  Supervisor', getNombreCompleto(reasignacion.supervisor)]] : []),
            ['', '']
          )
        })
      }

      const worksheet = XLSX.utils.aoa_to_sheet(datosPrincipales)
      
      // Ajustar anchos de columnas optimizados
      const colWidths = [
        { wch: 25 }, // Columna Descripción
        { wch: 40 }, // Columna Valor
      ]
      worksheet['!cols'] = colWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, `Ticket ${ticket.id}`)
      XLSX.writeFile(workbook, `ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.xlsx`)
      
      onClose()
    } catch (error) {
      console.error('Error generando Excel:', error)
      alert('Error al generar el Excel. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
      setExportType(null)
    }
  }

  const generarPDF = async () => {
    if (!ticket) return

    setLoading(true)
    setExportType('pdf')
    
    try {
      const doc = new jsPDF()

      // Configuración optimizada para mejor uso del espacio
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
          doc.text('REPORTE DE TICKET', pageWidth / 2, cintilloHeight / 2 - 3, { align: 'center' })
          
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
          const logoY = textoPaginaY - 35 // Logo 25px arriba del texto
          
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
          const logoY = textoPaginaY - 25
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
          await agregarLogoUltimaPagina() // ESPERAR a que se cargue y agregue el logo
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

      // FUNCIÓN: Agregar sección con columnas de 2 y contenido centrado
      const agregarSeccionDosColumnas = async (titulo: string, datos: Array<{descripcion: string, valor: string}>) => {
        // Espacio antes de cada sección
        yPosition += 10
        
        // Título de sección CENTRADO
        await checkPageBreak(25)
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 15, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(titulo.toUpperCase(), pageWidth / 2, yPosition + 3, { align: 'center' })
        yPosition += 12

        // Configuración para 2 columnas
        resetTextColor()
        doc.setFontSize(9)
        const anchoColumna = (pageWidth - (margin * 2) - 10) / 2 // -10 para espacio entre columnas
        const espacioEntreColumnas = 10
        
        // Procesar datos en pares para 2 columnas
        for (let i = 0; i < datos.length; i += 2) {
          const fila1 = datos[i]
          const fila2 = datos[i + 1] // Puede ser undefined si hay número impar
          
          // Calcular altura para ambas filas (tomar la más alta)
          const maxDescWidth = anchoColumna * 0.7 // Más espacio para descripción
          const maxValorWidth = anchoColumna * 0.25 // Menos espacio para valor
          
          const alturaFila1 = calcularAlturaFila(fila1.descripcion, maxDescWidth)
          let alturaFila2 = 0
          if (fila2) {
            alturaFila2 = calcularAlturaFila(fila2.descripcion, maxDescWidth)
          }
          const alturaFila = Math.max(alturaFila1, alturaFila2, 15) // Mínimo 15px

          await checkPageBreak(alturaFila + 5)

          // Fondo para ambas celdas
          if (i % 4 === 0 || i % 4 === 1) { // Alternar colores cada 2 filas
            doc.setFillColor(255, 255, 255)
          } else {
            doc.setFillColor(colorGrisClaro[0], colorGrisClaro[1], colorGrisClaro[2])
          }

          // Primera columna
          doc.rect(margin, yPosition, anchoColumna, alturaFila, 'F')
          doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
          doc.rect(margin, yPosition, anchoColumna, alturaFila, 'S')

          // Segunda columna (si existe)
          if (fila2) {
            doc.rect(margin + anchoColumna + espacioEntreColumnas, yPosition, anchoColumna, alturaFila, 'F')
            doc.rect(margin + anchoColumna + espacioEntreColumnas, yPosition, anchoColumna, alturaFila, 'S')
          }

          // CONTENIDO PRIMERA COLUMNA - CENTRADO VERTICALMENTE
          resetTextColor()
          
          // Descripción (izquierda)
          doc.setFont('helvetica', 'normal')
          const descLines1 = doc.splitTextToSize(fila1.descripcion, maxDescWidth)
          const textoY1 = yPosition + (alturaFila / 2) - ((descLines1.length * 4.5) / 2) + 3
          descLines1.forEach((line: string, lineIndex: number) => {
            doc.text(line, margin + 4, textoY1 + (lineIndex * 4.5))
          })

          // Valor (derecha, centrado horizontalmente en su espacio)
          doc.setFont('helvetica', 'bold')
          const valorLines1 = doc.splitTextToSize(fila1.valor, maxValorWidth)
          const valorX1 = margin + maxDescWidth + 4
          const textoValorY1 = yPosition + (alturaFila / 2) - ((valorLines1.length * 4.5) / 2) + 3
          valorLines1.forEach((line: string, lineIndex: number) => {
            // Centrar el valor dentro de su espacio disponible
            const lineWidth = doc.getTextWidth(line)
            const espacioDisponible = anchoColumna - maxDescWidth - 8
            const xCentrado = valorX1 + (espacioDisponible - lineWidth) / 2
            doc.text(line, xCentrado, textoValorY1 + (lineIndex * 4.5))
          })

          // CONTENIDO SEGUNDA COLUMNA - CENTRADO VERTICALMENTE (si existe)
          if (fila2) {
            const col2X = margin + anchoColumna + espacioEntreColumnas
            
            // Descripción (izquierda)
            doc.setFont('helvetica', 'normal')
            const descLines2 = doc.splitTextToSize(fila2.descripcion, maxDescWidth)
            const textoY2 = yPosition + (alturaFila / 2) - ((descLines2.length * 4.5) / 2) + 3
            descLines2.forEach((line: string, lineIndex: number) => {
              doc.text(line, col2X + 4, textoY2 + (lineIndex * 4.5))
            })

            // Valor (derecha, centrado horizontalmente en su espacio)
            doc.setFont('helvetica', 'bold')
            const valorLines2 = doc.splitTextToSize(fila2.valor, maxValorWidth)
            const valorX2 = col2X + maxDescWidth + 4
            const textoValorY2 = yPosition + (alturaFila / 2) - ((valorLines2.length * 4.5) / 2) + 3
            valorLines2.forEach((line: string, lineIndex: number) => {
              const lineWidth = doc.getTextWidth(line)
              const espacioDisponible = anchoColumna - maxDescWidth - 8
              const xCentrado = valorX2 + (espacioDisponible - lineWidth) / 2
              doc.text(line, xCentrado, textoValorY2 + (lineIndex * 4.5))
            })
          }

          doc.setFont('helvetica', 'normal')
          yPosition += alturaFila + 2
        }

        yPosition += 8 // Espacio entre secciones
      }

      // FUNCIÓN: Sección una columna con contenido centrado
      const agregarSeccionUnaColumna = async (titulo: string, datos: Array<{descripcion: string, valor: string}>) => {
        yPosition += 10
        
        // Título CENTRADO
        await checkPageBreak(25)
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 15, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(titulo.toUpperCase(), pageWidth / 2, yPosition + 3, { align: 'center' })
        yPosition += 12

        resetTextColor()
        doc.setFontSize(9)

        for (let filaIndex = 0; filaIndex < datos.length; filaIndex++) {
          const fila = datos[filaIndex]
          const maxDescWidth = (pageWidth - margin * 2) * 0.7 // Más espacio para descripción
          const maxValorWidth = (pageWidth - margin * 2) * 0.25 // Menos espacio para valor
          
          const descLines = doc.splitTextToSize(fila.descripcion, maxDescWidth)
          const valorLines = doc.splitTextToSize(fila.valor, maxValorWidth)
          
          const alturaDesc = descLines.length * 4.5
          const alturaValor = valorLines.length * 4.5
          const alturaFila = Math.max(15, Math.max(alturaDesc, alturaValor) + 6)

          await checkPageBreak(alturaFila + 5)

          // Fondo alternado
          if (filaIndex % 2 === 0) {
            doc.setFillColor(255, 255, 255)
          } else {
            doc.setFillColor(colorGrisClaro[0], colorGrisClaro[1], colorGrisClaro[2])
          }
          doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaFila, 'F')

          // Borde
          doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
          doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaFila, 'S')

          // CONTENIDO CENTRADO VERTICALMENTE
          resetTextColor()
          
          // Descripción (alineada a la izquierda)
          doc.setFont('helvetica', 'normal')
          const textoY = yPosition + (alturaFila / 2) - ((descLines.length * 4.5) / 2) + 3
          descLines.forEach((line: string, lineIndex: number) => {
            doc.text(line, margin + 4, textoY + (lineIndex * 4.5))
          })

          // Valor (centrado horizontalmente en su espacio)
          doc.setFont('helvetica', 'bold')
          const valorX = margin + maxDescWidth + 4
          const textoValorY = yPosition + (alturaFila / 2) - ((valorLines.length * 4.5) / 2) + 3
          valorLines.forEach((line: string, lineIndex: number) => {
            const lineWidth = doc.getTextWidth(line)
            const espacioDisponible = (pageWidth - margin * 2) - maxDescWidth - 8
            const xCentrado = valorX + (espacioDisponible - lineWidth) / 2
            doc.text(line, xCentrado, textoValorY + (lineIndex * 4.5))
          })

          doc.setFont('helvetica', 'normal')
          yPosition += alturaFila + 2
        }

        yPosition += 8
      }

      // AGREGAR CINTILLO SOLO EN LA PRIMERA PÁGINA
      await agregarCintillo()

      // Título principal - Solo en primera página (YA CENTRADO)
      if (primeraPagina) {
        await checkPageBreak(30)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.text(`TICKET #${ticket.id}`, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 8
        
        doc.setFontSize(11)
        const tituloLines = doc.splitTextToSize(ticket.titulo, pageWidth - margin * 2)
        for (const line of tituloLines) {
          await checkPageBreak(5)
          doc.text(line, pageWidth / 2, yPosition, { align: 'center' })
          yPosition += 5
        }
        yPosition += 12 // Espacio aumentado después del título
      }

      // Información básica optimizada - USAR DOS COLUMNAS
      const infoBasica = [
        { descripcion: 'Título', valor: ticket.titulo },
        { descripcion: 'Estado', valor: ticket.estado.estado },
        { descripcion: 'Tipo', valor: ticket.tipoTicket.tipo },
        { descripcion: 'Creación', valor: `${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_creacion).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}` },
        ...(ticket.fecha_cierre ? [
          { descripcion: 'Cierre', valor: `${new Date(ticket.fecha_cierre).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_cierre).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}` }
        ] : [])
      ]
      await agregarSeccionDosColumnas('Información Básica', infoBasica)

      // Información de asignación optimizada - USAR DOS COLUMNAS
      const infoAsignacion = [
        { descripcion: 'Creado por', valor: getNombreCompleto(ticket.usuarioCreador) },
        ...(ticket.usuarioCerrador ? [
          { descripcion: 'Asignado a', valor: getNombreCompleto(ticket.usuarioCerrador) },
          ...(ticket.usuarioCerrador.tipoAnalista ? [
            { descripcion: 'Tipo analista', valor: ticket.usuarioCerrador.tipoAnalista.tipo }
          ] : [])
        ] : []),
        ...(ticket.tiempoEjecucion ? [
          { descripcion: 'Tiempo ejecución', valor: ticket.tiempoEjecucion }
        ] : [])
      ]
      if (infoAsignacion.length > 1) {
        await agregarSeccionDosColumnas('Asignación', infoAsignacion)
      }

      // Descripción - MANTENER UNA COLUMNA (texto largo)
      await checkPageBreak(25)
      doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
      doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('DESCRIPCIÓN', pageWidth / 2, yPosition + 3, { align: 'center' })
      yPosition += 12

      resetTextColor()
      doc.setFontSize(9)
      const descripcionLines = doc.splitTextToSize(ticket.descripcion, pageWidth - (margin * 2))
      
      // Fondo para la descripción
      const alturaDescripcion = descripcionLines.length * 4.5 + 10
      await checkPageBreak(alturaDescripcion)
      
      doc.setFillColor(255, 255, 255)
      doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaDescripcion, 'F')
      doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
      doc.rect(margin, yPosition, pageWidth - (margin * 2), alturaDescripcion, 'S')
      
      // Centrar verticalmente el texto de descripción
      const textoDescY = yPosition + (alturaDescripcion / 2) - ((descripcionLines.length * 4.5) / 2) + 5
      descripcionLines.forEach((line: string, index: number) => {
        doc.text(line, margin + 4, textoDescY + (index * 4.5))
      })
      yPosition += alturaDescripcion + 10

      // Usuario afectado optimizado - USAR UNA COLUMNA (contenido grande)
      if (ticket.usuarioAfectado) {
        const usuarioAfectado = [
          { descripcion: 'Nombre', valor: getNombreCompleto(ticket.usuarioAfectado) },
          ...(ticket.usuarioAfectado.cedula ? [
            { descripcion: 'Cédula', valor: ticket.usuarioAfectado.cedula }
          ] : []),
          ...(ticket.usuarioAfectado.direccion ? [
            { descripcion: 'Ubicación', valor: `${ticket.usuarioAfectado.direccion.piso.piso} - ${ticket.usuarioAfectado.direccion.direccion}` }
          ] : []),
          ...(ticket.usuarioAfectado.area ? [
            { descripcion: 'Área', valor: ticket.usuarioAfectado.area.nombre }
          ] : [])
        ]
        await agregarSeccionUnaColumna('Usuario Afectado', usuarioAfectado)
      }

      // Equipos afectados optimizados - USAR DOS COLUMNAS
      if (ticket.ticketEquipos && ticket.ticketEquipos.length > 0) {
        const equiposData: Array<{descripcion: string, valor: string}> = []
        ticket.ticketEquipos.forEach((ticketEquipo, index) => {
          const equipo = ticketEquipo.equipo
          equiposData.push(
            { 
              descripcion: `Equipo ${index + 1}`, 
              valor: `${equipo.tipoEquipo?.nombre || 'Equipo'} - ${equipo.modelo?.marca?.nombre || ''} ${equipo.modelo?.nombre || ''}` 
            },
            { 
              descripcion: `  BN/Serial`, 
              valor: `${equipo.bienNacional || 'N/A'} / ${equipo.serial || 'N/A'}` 
            },
            { 
              descripcion: `  Status`, 
              valor: equipo.status?.estado || 'No especificado' 
            }
          )
        })
        await agregarSeccionDosColumnas('Equipos Afectados', equiposData)
      }

      // Información de sistemas optimizada - USAR UNA COLUMNA (contenido grande)
      if (ticket.TicketSistema && ticket.TicketSistema.length > 0) {
        const sistemasData: Array<{descripcion: string, valor: string}> = []
        ticket.TicketSistema.forEach((ticketSistema, index) => {
          sistemasData.push(
            { 
              descripcion: `Sistema ${index + 1}`, 
              valor: `${ticketSistema.sistema?.nombre || 'N/A'} - ${ticketSistema.falla?.nombre || 'N/A'}` 
            },
            { 
              descripcion: `  Descripción`, 
              valor: ticketSistema.descripcion || 'No especificada' 
            }
          )
        })
        await agregarSeccionUnaColumna('Sistemas', sistemasData)
      }

      // Información de cierre optimizada - USAR DOS COLUMNAS
      if (ticket.estadoId === 2 && ticket.ticketCierre) {
        const cierreData = [
          { descripcion: 'Condición', valor: ticket.ticketCierre.condicion },
          { descripcion: 'Memo Finalización', valor: ticket.ticketCierre.memoFinalizacion },
          ...(ticket.ticketCierre.observaciones ? [
            { descripcion: 'Observaciones', valor: ticket.ticketCierre.observaciones }
          ] : []),
          ...(ticket.ticketCierre.usuarioCerrador ? [
            { descripcion: 'Cerrado por', valor: getNombreCompleto(ticket.ticketCierre.usuarioCerrador) }
          ] : [])
        ]
        await agregarSeccionDosColumnas('Cierre', cierreData)
      }

      // Reasignaciones optimizadas - USAR DOS COLUMNAS
      const reasignaciones = ticket.ticketReasignaciones || ticket.reasignaciones || []
      if (reasignaciones.length > 0) {
        const reasignacionesData: Array<{descripcion: string, valor: string}> = []
        reasignaciones.forEach((reasignacion, index) => {
          reasignacionesData.push(
            { 
              descripcion: `Reasignación ${index + 1}`, 
              valor: `${reasignacion.analistaAnterior ? getNombreCompleto(reasignacion.analistaAnterior) : 'N/A'} → ${reasignacion.analistaNuevo ? getNombreCompleto(reasignacion.analistaNuevo) : 'N/A'}` 
            },
            { 
              descripcion: `  Fecha/Hora`, 
              valor: `${new Date(reasignacion.fechaReasignacion).toLocaleDateString('es-ES')} ${new Date(reasignacion.fechaReasignacion).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}` 
            },
            ...(reasignacion.motivo ? [
              { descripcion: `  Motivo`, valor: reasignacion.motivo }
            ] : []),
            ...(reasignacion.supervisor ? [
              { descripcion: `  Supervisor`, valor: getNombreCompleto(reasignacion.supervisor) }
            ] : [])
          )
        })
        await agregarSeccionDosColumnas('Reasignaciones', reasignacionesData)
      }

      // AGREGAR FOOTER FINAL CON LOGO (SOLO EN LA ÚLTIMA PÁGINA)
      await addFooter(true) // true indica que es la última página

      doc.save(`ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.pdf`)
      onClose()
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
      setExportType(null)
    }
  }

  if (!isOpen || !ticket) return null

  return (
    <div className="fixed inset-0 bg-black/[0.5] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Exportar Ticket
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ticket #{ticket.id}
            </h4>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {ticket.titulo}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Selecciona el formato de exportación.
            </p>

            {/* Botones de exportación */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={generarExcel}
                disabled={loading}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 duration-200 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Sheet className="w-4 h-4" />
                {exportType === 'excel' && loading ? 'Generando...' : 'Excel'}
              </button>
              <button
                onClick={generarPDF}
                disabled={loading}
                className="flex items-center cursor-pointer transform hover:scale-105 gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FileText className="w-4 h-4" />
                {exportType === 'pdf' && loading ? 'Generando...' : 'PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            Cancelar
          </button>

          <div className="text-sm text-gray-500 flex items-center">
            {loading && (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Generando {exportType?.toUpperCase()}...
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}