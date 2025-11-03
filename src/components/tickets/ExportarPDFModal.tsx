"use client"

import { useState } from "react"
import { FileText, X, Download, Loader } from "lucide-react"
import { Ticket } from "../../../types/ticket"

interface ExportarPDFModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
}

export default function ExportarPDFModal({ isOpen, onClose, ticket }: ExportarPDFModalProps) {
  const [loading, setLoading] = useState(false)

  const getNombreCompleto = (usuario: { nombre: string; apellido?: string | null }) => {
    return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre;
  };

  const generarPDF = async () => {
    if (!ticket) return

    setLoading(true)
    try {
      // Importar dinámicamente la librería jsPDF
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.default
      
      // Crear nuevo documento PDF
      const doc = new jsPDF()
      
      // Configuración inicial
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let currentPage = 1
      let yPosition = 20

      // Función para agregar texto con manejo de saltos de página
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false, yIncrement: number = 10, xPosition: number = margin) => {
        if (yPosition > 270) {
          doc.addPage()
          currentPage++
          yPosition = 20
        }
        
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.text(text, xPosition, yPosition)
        yPosition += yIncrement
      }

      // Función para agregar línea separadora
      const addSeparator = () => {
        if (yPosition > 270) {
          doc.addPage()
          currentPage++
          yPosition = 20
        }
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
      }

      // Función para agregar pie de página en la página actual
      const addPageFooter = () => {
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Página ${currentPage}`, pageWidth / 2, 285, { align: 'center' })
        doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, 290, { align: 'center' })
      }

      // Encabezado
      doc.setFillColor(1, 31, 63) // Color #001F3F
      doc.rect(0, 0, pageWidth, 50, 'F')
      
      doc.setFontSize(20)
      doc.setTextColor(255, 255, 255)
      doc.text('REPORTE DE TICKET', pageWidth / 2, 25, { align: 'center' })
      
      doc.setFontSize(14)
      doc.text(`Ticket #${ticket.id} - ${ticket.titulo}`, pageWidth / 2, 35, { align: 'center' })
      
      yPosition = 60

      // Información básica del ticket
      addText('INFORMACIÓN BÁSICA', 16, true, 15)
      
      addText(`Título: ${ticket.titulo}`, 12, false, 8)
      addText(`Estado: ${ticket.estado.estado}`, 12, false, 8)
      addText(`Tipo de Ticket: ${ticket.tipoTicket.tipo}`, 12, false, 8)
      
      const fechaCreacion = new Date(ticket.fecha_creacion)
      addText(`Fecha de creación: ${fechaCreacion.toLocaleDateString('es-ES')}`, 12, false, 8)
      addText(`Hora de creación: ${fechaCreacion.toLocaleTimeString('es-ES')}`, 12, false, 8)
      
      if (ticket.fecha_cierre) {
        const fechaCierre = new Date(ticket.fecha_cierre)
        addText(`Fecha de cierre: ${fechaCierre.toLocaleDateString('es-ES')}`, 12, false, 8)
        addText(`Hora de cierre: ${fechaCierre.toLocaleTimeString('es-ES')}`, 12, false, 8)
      }

      addSeparator()

      // Información de asignación
      addText('INFORMACIÓN DE ASIGNACIÓN', 16, true, 15)
      
      addText(`Creado por: ${getNombreCompleto(ticket.usuarioCreador)}`, 12, false, 8)

      if (ticket.usuarioCerrador) {
        addText(`Asignado a: ${getNombreCompleto(ticket.usuarioCerrador)}`, 12, false, 8)
        if (ticket.usuarioCerrador.tipoAnalista) {
          addText(`Tipo de analista: ${ticket.usuarioCerrador.tipoAnalista.tipo}`, 12, false, 8)
        }
      }

      if (ticket.tiempoEjecucion) {
        addText(`Tiempo de ejecución: ${ticket.tiempoEjecucion}`, 12, false, 8)
      }

      addSeparator()

      // Descripción
      addText('DESCRIPCIÓN', 16, true, 15)
      const descripcionLines = doc.splitTextToSize(ticket.descripcion, pageWidth - 40)
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      descripcionLines.forEach((line: string) => {
        addText(line, 11, false, 6)
      })
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      addSeparator()

      // Usuario afectado
      if (ticket.usuarioAfectado) {
        addText('USUARIO AFECTADO', 16, true, 15)
        addText(`Nombre: ${getNombreCompleto(ticket.usuarioAfectado)}`, 12, false, 8)
        
        if (ticket.usuarioAfectado.cedula) {
          addText(`Cédula: ${ticket.usuarioAfectado.cedula}`, 12, false, 8)
        }
        
        if (ticket.usuarioAfectado.direccion) {
          addText(`Piso: ${ticket.usuarioAfectado.direccion.piso.piso}`, 12, false, 8)
          addText(`Dirección: ${ticket.usuarioAfectado.direccion.direccion}`, 12, false, 8)
        }
        
        if (ticket.usuarioAfectado.area) {
          addText(`Área: ${ticket.usuarioAfectado.area.nombre}`, 12, false, 8)
        }

        addSeparator()
      }

      // Equipos afectados
      if (ticket.ticketEquipos && ticket.ticketEquipos.length > 0) {
        addText('EQUIPOS AFECTADOS', 16, true, 15)
        
        ticket.ticketEquipos.forEach((ticketEquipo, index: number) => {
          const equipo = ticketEquipo.equipo
          const tipo = equipo.tipoEquipo?.nombre || 'Equipo'
          const marca = equipo.modelo?.marca?.nombre || ''
          const modelo = equipo.modelo?.nombre || ''
          
          addText(`Equipo ${index + 1}:`, 12, true, 8)
          addText(`  • Tipo: ${tipo}`, 11, false, 6)
          addText(`  • Marca: ${marca}`, 11, false, 6)
          addText(`  • Modelo: ${modelo}`, 11, false, 6)
          addText(`  • Bien Nacional: ${equipo.bienNacional || 'No asignado'}`, 11, false, 6)
          addText(`  • Serial: ${equipo.serial || 'No asignado'}`, 11, false, 6)
          addText(`  • Status: ${equipo.status?.estado || 'No especificado'}`, 11, false, 8)
        })

        addSeparator()
      }

      // Información de sistemas (si es ticket de sistema)
      if (ticket.TicketSistema && ticket.TicketSistema.length > 0) {
        addText('INFORMACIÓN DE SISTEMAS', 16, true, 15)
        
        ticket.TicketSistema.forEach((ticketSistema, index: number) => {
          addText(`Sistema ${index + 1}:`, 12, true, 8)
          if (ticketSistema.sistema) {
            addText(`  • Sistema: ${ticketSistema.sistema.nombre}`, 11, false, 6)
          }
          if (ticketSistema.falla) {
            addText(`  • Falla: ${ticketSistema.falla.nombre}`, 11, false, 6)
          }
          addText(`  • Descripción: ${ticketSistema.descripcion || 'No especificada'}`, 11, false, 8)
        })

        addSeparator()
      }

      // Información de cierre (solo para tickets cerrados)
      if (ticket.estadoId === 2 && ticket.ticketCierre) {
        addText('INFORMACIÓN DE CIERRE', 16, true, 15)
        
        addText(`Condición: ${ticket.ticketCierre.condicion}`, 12, false, 8)
        
        addText('Memo de Finalización:', 12, true, 8)
        const memoLines = doc.splitTextToSize(ticket.ticketCierre.memoFinalizacion, pageWidth - 40)
        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        memoLines.forEach((line: string) => {
          addText(line, 11, false, 6)
        })
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)

        if (ticket.ticketCierre.observaciones) {
          addText('Observaciones Adicionales:', 12, true, 8)
          const observacionesLines = doc.splitTextToSize(ticket.ticketCierre.observaciones, pageWidth - 40)
          doc.setFontSize(11)
          doc.setTextColor(80, 80, 80)
          observacionesLines.forEach((line: string) => {
            addText(line, 11, false, 6)
          })
          doc.setFontSize(12)
          doc.setTextColor(0, 0, 0)
        }

        if (ticket.ticketCierre.usuarioCerrador) {
          addText(`Cerrado por: ${getNombreCompleto(ticket.ticketCierre.usuarioCerrador)}`, 12, false, 8)
        }

        addSeparator()
      }

      // Reasignaciones
      const reasignaciones = ticket.ticketReasignaciones || ticket.reasignaciones || []
      if (reasignaciones.length > 0) {
        addText('HISTORIAL DE REASIGNACIONES', 16, true, 15)
        
        reasignaciones.forEach((reasignacion, index: number) => {
          addText(`Reasignación ${index + 1}:`, 12, true, 8)
          addText(`  • De: ${reasignacion.analistaAnterior ? getNombreCompleto(reasignacion.analistaAnterior) : 'No especificado'}`, 11, false, 6)
          addText(`  • A: ${reasignacion.analistaNuevo ? getNombreCompleto(reasignacion.analistaNuevo) : 'No especificado'}`, 11, false, 6)
          
          if (reasignacion.motivo) {
            addText(`  • Motivo: ${reasignacion.motivo}`, 11, false, 6)
          }
          
          if (reasignacion.supervisor) {
            addText(`  • Supervisor: ${getNombreCompleto(reasignacion.supervisor)}`, 11, false, 6)
          }
          
          const fechaReasignacion = new Date(reasignacion.fechaReasignacion)
          addText(`  • Fecha: ${fechaReasignacion.toLocaleDateString('es-ES')}`, 11, false, 6)
          addText(`  • Hora: ${fechaReasignacion.toLocaleTimeString('es-ES')}`, 11, false, 8)
        })

        addSeparator()
      }

      // Agregar pie de página a todas las páginas
      const totalPages = currentPage
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, 285, { align: 'center' })
        doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, 290, { align: 'center' })
      }

      // Descargar PDF
      doc.save(`ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.pdf`)
      
      onClose()
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
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
            Exportar a PDF
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
            <p className="text-gray-600 mb-2">
              {ticket.titulo}
            </p>
            <p className="text-sm text-gray-500">
              Se generará un documento PDF con toda la información del ticket.
            </p>
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

          <button
            onClick={generarPDF}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}