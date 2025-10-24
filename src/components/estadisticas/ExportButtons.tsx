// components/estadisticas/ExportButtons.tsx
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

export default function ExportButtons({ tipoEstadistica }: ExportButtonsProps) {
  
  const cargarDatos = async (): Promise<EstadisticasPersonal | EstadisticasEquipos | null> => {
    try {
      let endpoint = ""
      
      switch (tipoEstadistica) {
        case "personal":
          endpoint = "/api/estadisticas/personal"
          break
        case "equipos":
          endpoint = "/api/estadisticas/equipos"
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
    let yPosition = margin
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let currentPage = 1
    
    // Color azul corporativo
    const colorAzul = [0, 51, 102] // #003366
    
    // Función para resetear colores de texto
    const resetTextColor = () => {
      doc.setTextColor(0, 0, 0) // Negro siempre
      doc.setFont('helvetica', 'normal')
    }
    
    // Función para agregar pie de página
    const addFooter = () => {
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.text(
        `Página ${currentPage}`,
        pageWidth / 2,
        pageHeight - 10,
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
    
    // Encabezado
    doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    // Título principal (blanco)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(config.titulo, pageWidth / 2, 25, { align: 'center' })
    
    // Información de generación (blanco)
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, 35, { align: 'center' })
    
    yPosition = 60
    
    // Contenido de las secciones
    config.secciones?.forEach((seccion: SeccionPDF, seccionIndex: number) => {
      // Espacio antes de cada sección (excepto la primera)
      if (seccionIndex > 0) {
        yPosition += 10
      }
      
      // Título de sección (azul con fondo, texto blanco)
      checkPageBreak(20)
      doc.setFillColor(colorAzul[0], colorAzul[1], colorAzul[2])
      doc.rect(margin - 5, yPosition - 5, pageWidth - (margin * 2) + 10, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(seccion.titulo, margin, yPosition + 3)
      yPosition += 15
      
      if (seccion.tipo === 'tabla') {
        // PARA TODAS LAS TABLAS: texto a la izquierda, valores a la derecha
        resetTextColor()
        doc.setFontSize(9)
        
        seccion.datos.forEach((fila: Record<string, string | number>, filaIndex: number) => {
          checkPageBreak(15)
          
          // Color de fondo alternado para filas
          if (filaIndex % 2 === 0) {
            doc.setFillColor(250, 250, 250)
          } else {
            doc.setFillColor(245, 245, 245)
          }
          doc.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F')
          
          // Texto/descripción a la izquierda
          const texto = String(fila[Object.keys(fila)[0]])
          const valor = String(fila[Object.keys(fila)[1]])
          
          // Dividir texto en múltiples líneas si es necesario
          const textoLines = doc.splitTextToSize(texto, pageWidth - margin - 60)
          
          // Texto (negro)
          resetTextColor()
          textoLines.forEach((line: string, lineIndex: number) => {
            doc.text(line, margin + 2, yPosition + 5 + (lineIndex * 4))
          })
          
          // Valor/Cantidad pegada a la derecha (negro)
          resetTextColor()
          doc.setFont('helvetica', 'bold')
          doc.text(valor, pageWidth - margin - 15, yPosition + 5)
          doc.setFont('helvetica', 'normal')
          
          yPosition += Math.max(12, textoLines.length * 4 + 4)
        })
        
        yPosition += 5
        
      } else if (seccion.tipo === 'texto') {
        seccion.datos.forEach((textoObj: Record<string, string | number>) => {
          Object.values(textoObj).forEach((texto: string | number) => {
            checkPageBreak(10)
            doc.setFontSize(10)
            resetTextColor()
            
            // Dividir texto largo en múltiples líneas
            const lines = doc.splitTextToSize(String(texto), pageWidth - (margin * 2))
            lines.forEach((line: string) => {
              checkPageBreak(10)
              doc.text(line, margin, yPosition)
              yPosition += 5
            })
            
            yPosition += 2
          })
        })
      }
    })
    
    // Agregar pie de página final
    addFooter()
    
    doc.save(`${config.nombreArchivo}.pdf`)
  }

  const prepararConfiguracionExcel = (
    tipo: "personal" | "equipos" | "tickets" | "eventos", 
    datos: EstadisticasPersonal | EstadisticasEquipos
  ): ConfiguracionExportacion => {
    const fecha = new Date().toISOString().split('T')[0]

    if (tipo === "personal") {
      const datosPersonal = datos as EstadisticasPersonal
      const datosExcel: ExcelRow[] = [
        // ESTADÍSTICAS PRINCIPALES - Formato organizado
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Usuarios', 'Cantidad': datosPersonal.totalUsuarios },
        { 'Descripción': 'Usuarios Activos', 'Cantidad': datosPersonal.usuariosActivos },
        { 'Descripción': 'Usuarios Deshabilitados', 'Cantidad': datosPersonal.usuariosDeshabilitados },
        { 'Descripción': 'Usuarios con Equipos', 'Cantidad': datosPersonal.usuariosConEquipos },
        { 'Descripción': 'Usuarios sin Equipos', 'Cantidad': datosPersonal.usuariosSinEquipos },
        { 'Descripción': 'Total Equipos Asignados', 'Cantidad': datosPersonal.totalEquiposAsignados },
        { 'Descripción': '', 'Cantidad': '' },
        
        // DISTRIBUCIÓN POR ROLES
        { 'Descripción': 'DISTRIBUCIÓN POR ROLES', 'Cantidad': '' },
        ...datosPersonal.usuariosPorRol.map(rol => ({ 
          'Descripción': rol.rol, 
          'Cantidad': rol.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        
        // DISTRIBUCIÓN POR PISOS
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
        // ESTADÍSTICAS PRINCIPALES
        { 'Descripción': 'ESTADÍSTICAS PRINCIPALES', 'Cantidad': '' },
        { 'Descripción': 'Total de Equipos', 'Cantidad': datosEquipos.totalEquipos },
        { 'Descripción': 'Equipos Asignados', 'Cantidad': datosEquipos.equiposAsignados },
        { 'Descripción': 'Equipos No Asignados', 'Cantidad': datosEquipos.equiposNoAsignados },
        { 'Descripción': 'En Uso y Operativos', 'Cantidad': datosEquipos.equiposEnUsoOperativos },
        { 'Descripción': 'Equipos Desincorporados', 'Cantidad': datosEquipos.equiposDesincorporados },
        { 'Descripción': 'Con Observaciones', 'Cantidad': datosEquipos.equiposConObservaciones },
        { 'Descripción': '', 'Cantidad': '' },
        
        // DISTRIBUCIÓN POR STATUS
        { 'Descripción': 'DISTRIBUCIÓN POR STATUS', 'Cantidad': '' },
        ...datosEquipos.equiposPorStatus.map(status => ({ 
          'Descripción': status.status, 
          'Cantidad': status.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        
        // DISTRIBUCIÓN POR TIPO
        { 'Descripción': 'DISTRIBUCIÓN POR TIPO', 'Cantidad': '' },
        ...datosEquipos.equiposPorTipo.map(tipoItem => ({ 
          'Descripción': tipoItem.tipo, 
          'Cantidad': tipoItem.cantidad 
        })),
        { 'Descripción': '', 'Cantidad': '' },
        
        // DISTRIBUCIÓN POR DIRECCIÓN
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
    }

    // Para tickets y eventos (placeholder)
    return {
      titulo: `Estadísticas de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
      nombreArchivo: `estadisticas_${tipo}_${fecha}`,
      datosExcel: [{ 'Descripción': `Estadísticas de ${tipo} no disponibles aún`, 'Cantidad': '' }]
    }
  }

  const prepararConfiguracionPDF = (
    tipo: "personal" | "equipos" | "tickets" | "eventos", 
    datos: EstadisticasPersonal | EstadisticasEquipos
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
    }

    // Para tickets y eventos (placeholder)
    return {
      titulo: `Estadísticas de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
      nombreArchivo: `estadisticas_${tipo}_${fecha}`,
      secciones: [{
        titulo: 'Información',
        tipo: 'texto',
        datos: [{ 'Mensaje': `Estadísticas de ${tipo} no disponibles aún` }]
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