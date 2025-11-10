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
      const margin = 15 // Reducido de 20
      let yPosition = margin
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      let currentPage = 1

      // Color azul corporativo
      const colorAzul = [0, 51, 102]
      const colorGrisClaro = [245, 245, 245]
      const colorGrisMedio = [220, 220, 220]

      // Función para agregar cintillo (SOLO en primera página)
      const agregarCintillo = async () => {
        try {
          let cintilloBase64
          try {
            cintilloBase64 = await cargarImagenComoBase64('/Cintillo.png')
          } catch (error) {
            cintilloBase64 = CINTILLO_BASE64
          }

          const cintilloHeight = 40 // Reducido de 50
          doc.addImage(cintilloBase64, 'PNG', 0, 0, pageWidth, cintilloHeight)
          doc.setFillColor(200, 200, 200)
          doc.rect(0, cintilloHeight, pageWidth, 1, 'F') // Línea más delgada
          yPosition = cintilloHeight + 10 // Reducido espacio
        } catch (error) {
          console.error('Error cargando cintillo:', error)
          const cintilloHeight = 40
          doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
          doc.rect(0, 0, pageWidth, cintilloHeight, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(14) // Reducido
          doc.setFont('helvetica', 'bold')
          doc.text('REPORTE DE TICKET', pageWidth / 2, cintilloHeight / 2 - 5, { align: 'center' })
          doc.setFontSize(8) // Reducido
          doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, cintilloHeight / 2 + 8, { align: 'center' })
          yPosition = cintilloHeight + 10
        }
      }

      // Función para agregar logo al final (más compacto)
      const agregarLogoFinal = async () => {
        try {
          let logoBase64
          try {
            logoBase64 = await cargarImagenComoBase64('/logo.png')
          } catch (error) {
            logoBase64 = LOGO_BASE64
          }

          yPosition += 15 // Reducido espacio
          doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
          doc.line(margin, yPosition, pageWidth - margin, yPosition)
          yPosition += 10 // Reducido

          if (logoBase64 && logoBase64.startsWith('data:image/')) {
            const logoWidth = 30 // Reducido
            const logoHeight = 30
            const logoX = (pageWidth - logoWidth) / 2
            doc.addImage(logoBase64, 'PNG', logoX, yPosition, logoWidth, logoHeight)
            yPosition += logoHeight + 5 // Reducido
          }

          doc.setFontSize(8) // Reducido
          doc.setTextColor(100, 100, 100)
          doc.setFont('helvetica', 'normal')
          doc.text('Sistema de Gestión de TI', pageWidth / 2, yPosition, { align: 'center' })
        } catch (error) {
          console.error('Error agregando logo:', error)
          yPosition += 15
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 100)
          doc.text('Sistema de Gestión de TI', pageWidth / 2, yPosition, { align: 'center' })
        }
      }

      // Función para resetear colores de texto
      const resetTextColor = () => {
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
      }

      // Función para agregar pie de página más compacto
      const addFooter = () => {
        const footerY = pageHeight - 10 // Subido
        doc.setFontSize(7) // Reducido
        doc.setTextColor(100, 100, 100)
        doc.text(
          `Página ${currentPage} - ${new Date().toLocaleDateString('es-ES')}`,
          pageWidth / 2,
          footerY,
          { align: 'center' }
        )
      }

      // Función para verificar si necesita nueva página
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          addFooter()
          doc.addPage()
          currentPage++
          yPosition = margin
          return true
        }
        return false
      }

      // Función optimizada para agregar sección
      const agregarSeccion = (titulo: string, datos: Array<{descripcion: string, valor: string}>) => {
        // Espacio antes de cada sección reducido
        yPosition += 5
        
        // Título de sección más compacto
        checkPageBreak(20) // Reducido de 25
        doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
        doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 12, 'F') // Altura reducida
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10) // Reducido
        doc.setFont('helvetica', 'bold')
        doc.text(titulo.toUpperCase(), margin, yPosition + 2)
        yPosition += 8 // Reducido

        // Contenido de la sección optimizado
        resetTextColor()
        doc.setFontSize(8) // Reducido para más contenido

        datos.forEach((fila, filaIndex) => {
          checkPageBreak(12) // Reducido de 18

          // Color de fondo alternado más sutil
          if (filaIndex % 2 === 0) {
            doc.setFillColor(255, 255, 255)
          } else {
            doc.setFillColor(colorGrisClaro[0], colorGrisClaro[1], colorGrisClaro[2])
          }
          doc.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F') // Altura reducida

          // Borde más sutil
          doc.setDrawColor(colorGrisMedio[0], colorGrisMedio[1], colorGrisMedio[2])
          doc.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'S')

          // Dividir texto en múltiples líneas si es necesario
          const maxDescWidth = (pageWidth - margin * 2) * 0.4 // 40% para descripción
          const maxValorWidth = (pageWidth - margin * 2) * 0.5 // 50% para valor
          
          const textoLines = doc.splitTextToSize(fila.descripcion, maxDescWidth)
          const valorLines = doc.splitTextToSize(fila.valor, maxValorWidth)

          // Texto (más compacto)
          resetTextColor()
          doc.setFont('helvetica', 'normal')
          textoLines.forEach((line: string, lineIndex: number) => {
            doc.text(line, margin + 3, yPosition + 4 + (lineIndex * 3)) // Espaciado reducido
          })

          // Valor (negrita y alineado a la derecha)
          resetTextColor()
          doc.setFont('helvetica', 'bold')
          valorLines.forEach((line: string, lineIndex: number) => {
            doc.text(line, pageWidth - margin - maxValorWidth + 5, yPosition + 4 + (lineIndex * 3))
          })
          doc.setFont('helvetica', 'normal')

          yPosition += Math.max(12, Math.max(textoLines.length, valorLines.length) * 3 + 4) // Cálculo optimizado
        })

        yPosition += 5 // Espacio reducido entre secciones
      }

      // Agregar cintillo SOLO en la primera página
      await agregarCintillo()

      // Título principal más compacto
      checkPageBreak(25) // Reducido
      doc.setFontSize(14) // Reducido
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(colorAzul[0], colorAzul[1], colorAzul[2])
      doc.text(`TICKET #${ticket.id}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6 // Reducido
      
      doc.setFontSize(10) // Reducido
      const tituloLines = doc.splitTextToSize(ticket.titulo, pageWidth - margin * 2)
      tituloLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 4
      })
      yPosition += 8 // Reducido

      // Información básica optimizada
      const infoBasica = [
        { descripcion: 'Título', valor: ticket.titulo },
        { descripcion: 'Estado', valor: ticket.estado.estado },
        { descripcion: 'Tipo', valor: ticket.tipoTicket.tipo },
        { descripcion: 'Creación', valor: `${new Date(ticket.fecha_creacion).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_creacion).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}` },
        ...(ticket.fecha_cierre ? [
          { descripcion: 'Cierre', valor: `${new Date(ticket.fecha_cierre).toLocaleDateString('es-ES')} ${new Date(ticket.fecha_cierre).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}` }
        ] : [])
      ]
      agregarSeccion('Información Básica', infoBasica)

      // Información de asignación optimizada
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
        agregarSeccion('Asignación', infoAsignacion)
      }

      // Descripción optimizada
      checkPageBreak(20)
      doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
      doc.rect(margin - 2, yPosition - 5, pageWidth - (margin * 2) + 4, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('DESCRIPCIÓN', margin, yPosition + 2)
      yPosition += 10

      resetTextColor()
      doc.setFontSize(8)
      const descripcionLines = doc.splitTextToSize(ticket.descripcion, pageWidth - (margin * 2))
      descripcionLines.forEach((line: string) => {
        checkPageBreak(4) // Reducido
        doc.text(line, margin, yPosition)
        yPosition += 3.5 // Reducido
      })
      yPosition += 5

      // Usuario afectado optimizado
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
        agregarSeccion('Usuario Afectado', usuarioAfectado)
      }

      // Equipos afectados optimizados (formato compacto)
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
        agregarSeccion('Equipos Afectados', equiposData)
      }

      // Información de sistemas optimizada
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
        agregarSeccion('Sistemas', sistemasData)
      }

      // Información de cierre optimizada
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
        agregarSeccion('Cierre', cierreData)
      }

      // Reasignaciones optimizadas (formato compacto)
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
        agregarSeccion('Reasignaciones', reasignacionesData)
      }

      // Agregar logo al final del documento
      checkPageBreak(60) // Reducido
      await agregarLogoFinal()

      // Agregar pie de página final
      addFooter()

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