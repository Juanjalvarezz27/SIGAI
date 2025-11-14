'use client'

import NavBar from '@/components/Navbar'
import Title from '@/components/Title'
import { useState } from 'react'
import {
  FileText,
  Target,
  User,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  LogIn,
  Menu,
  Calendar,
  Shield,
  PlayCircle,
  Maximize2
} from 'lucide-react'

export default function ManualDeUso() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const toggleFullscreen = (videoId: string) => {
    setFullscreenVideo(fullscreenVideo === videoId ? null : videoId)
  }

  // Datos de preguntas frecuentes con el nuevo campo 'video'
  const faqItems = [
    { 
      id: 'func-1', 
      question: '¿Cómo inicio sesión?', 
      role: 'Analista / Solicitante', 
      answer: 'Dirígete a la página principal del sistema e ingresa tus datos de sesión (email y contraseña) y luego haz click en el botón de iniciar sesión.', 
      icon: LogIn,
      video: '/manualUsuarios/iniciarSesion.mp4' 
    },
    { 
      id: 'func-2', 
      question: '¿Cómo crear un ticket nuevo?', 
      role: 'Solicitante', 
      answer: 'Después de iniciar sesión, en la página de inicio, haz click en el botón de tickets para redirigir a su vista, ubica el botón de "+ Nuevo Ticket" y rellena el formulario correspondiente.', 
      icon: FileText,
      video: '/manualUsuarios/crearTicket.mp4'
    },
    { 
      id: 'func-3', 
      question: '¿Cómo solicito un evento externo?', 
      role: 'Solicitante', 
      answer: 'Después de iniciar sesión, en la página de inicio, haz click en el botón de eventos externos para redirigir a su vista, ubica el botón de "Solicitar Evento" y completa el formulario.', 
      icon: Calendar,
      video: '/manualUsuarios/eventoExterno.mp4'
    },
    { 
      id: 'func-4', 
      question: '¿Cómo edito mi perfil?', 
      role: 'Analista / Solicitante', 
      answer: 'Después de iniciar sesión, en la página de inicio, haz click en el botón de perfil. Ubica el botón de editar perfil y sigue el proceso de verificación.', 
      icon: Settings,
      video: '/manualUsuarios/editarPerfil.mp4'
    },
    { 
      id: 'func-5', 
      question: '¿Cómo filtro los equipos?', 
      role: 'Analista', 
      answer: 'Puedes filtrar por tipo de equipo, marca o modelo utilizando los botones de filtro disponibles en la sección de inventario.', 
      icon: Filter,
      video: '/manualUsuarios/filtrarEquipos.mp4'
    },
    { 
      id: 'func-6', 
      question: '¿Cómo busco equipos?', 
      role: 'Analista', 
      answer: 'Utiliza la barra de búsqueda con criterios como nombre de usuario, bien nacional o serial del equipo.', 
      icon: Search,
      video: '/manualUsuarios/buscarEquipos.mp4'
    },
    { 
      id: 'func-7', 
      question: '¿Cómo edito un equipo?', 
      role: 'Analista', 
      answer: 'Accede a la vista detallada del equipo y haz click en el botón de editar para modificar la información.', 
      icon: Edit,
      video: '/manualUsuarios/editarEquipo.mp4'
    },
    { 
      id: 'func-8', 
      question: '¿Cómo desincorporo un equipo?', 
      role: 'Analista', 
      answer: 'Desde la vista detallada del equipo, selecciona la opción de desincorporar y proporciona el motivo correspondiente.', 
      icon: Trash2,
      video: '/manualUsuarios/desincorporarEquipo.mp4'
    },
    { 
      id: 'func-9', 
      question: '¿Cómo cierro un ticket?', 
      role: 'Analista', 
      answer: 'En la vista de tickets asignados, selecciona el ticket y completa el proceso de cierre con la condición y observaciones necesarias.', 
      icon: CheckCircle,
      video: '/manualUsuarios/cerrarTicket.mp4'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavBar />

      {/* Modal de video en pantalla completa */}
      {fullscreenVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setFullscreenVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <Maximize2 className="w-6 h-6 rotate-45" />
            </button>
            <video 
              controls 
              autoPlay
              className="w-full h-full rounded-lg shadow-2xl"
            >
              <source src={fullscreenVideo} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <Title text={'Manual de Usuario'} />
          <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
            Guía completa para el uso del Sistema de Gestión de Analistas Informáticos (SIGAI) del Instituto Nacional de Higiene &quot;Rafael Rangel&quot;
          </p>
        </div>

        {/* Descripción del sistema */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Descripción del Sistema</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              El Sistema de gestión de analistas informáticos SIGAI es una plataforma web centralizada desarrollada para el Instituto Nacional de Higiene &quot;Rafael Rangel&quot;, diseñada para digitalizar, automatizar y optimizar los procesos internos de soporte técnico y administración de recursos tecnológicos.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-6 animate-fade-in">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Arquitectura Modular
              </h3>
              <p className="text-blue-700">
                El sistema integra cuatro pilares funcionales que cubren el ciclo completo de gestión de incidencias y activos informáticos.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 mt-6 animate-fade-in">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="py-4 px-6 text-left text-white font-semibold text-lg">Módulo</th>
                  <th className="py-4 px-6 text-left text-white font-semibold text-lg">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-blue-50 transition-colors duration-300">
                  <td className="py-4 px-6 font-medium text-gray-900">Gestión de Tickets</td>
                  <td className="py-4 px-6 text-gray-700">
                    Digitalización completa del flujo de tickets, asignación automática, seguimiento y cierre de incidencias informáticas.
                  </td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors duration-300">
                  <td className="py-4 px-6 font-medium text-gray-900">Administración de Activos</td>
                  <td className="py-4 px-6 text-gray-700">
                    Inventario dinámico con relación uno a uno entre usuarios y equipos, incluyendo registro, actualización y baja de activos.
                  </td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors duration-300">
                  <td className="py-4 px-6 font-medium text-gray-900">Dashboard de Métricas</td>
                  <td className="py-4 px-6 text-gray-700">
                    Panel de control analítico con visualizaciones gráficas automatizadas e indicadores clave de desempeño.
                  </td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors duration-300">
                  <td className="py-4 px-6 font-medium text-gray-900">Préstamo para Eventos</td>
                  <td className="py-4 px-6 text-gray-700">
                    Gestión controlada de préstamos temporales de equipos para eventos externos institucionales.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Objetivo Principal */}
        <div className="mb-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-xl p-8 text-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center mb-6">
            <div className="bg-gray-600 p-3 rounded-xl mr-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Objetivo Principal</h2>
          </div>

          <div className="space-y-4 text-gray-200">
            <p className="text-lg leading-relaxed">
              Proporcionar una plataforma web centralizada, segura y escalable que integre de forma armónica la gestión de soporte técnico, activos informáticos y préstamos temporales.
            </p>
            <p className="text-lg leading-relaxed">
              Optimizar la eficiencia operativa mediante la reducción de tiempos de respuesta, automatización de tareas y generación de métricas confiables para la toma de decisiones estratégicas.
            </p>
          </div>
        </div>

        {/* Flujo del sistema */}
        <div className="mb-12">
          <div className="text-center mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Flujo del Sistema</h2>
            <p className="text-gray-600 text-lg">Guías paso a paso para cada tipo de usuario</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Solicitante */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fade-in-up flex flex-col" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Solicitante</h3>
                  <p className="text-gray-600 text-sm">Personas que reportan fallas o solicitan equipos</p>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                {[
                  { id: 'solicitante-1', title: '1. Inicia sesión', content: 'Accede con tu correo electrónico y contraseña.', screen: 'Login', icon: LogIn },
                  { id: 'solicitante-2', title: '2. Menú principal', content: 'Tienes acceso a: Tickets, Eventos Externos y Perfil.', screen: 'Inicio', icon: Menu },
                  { id: 'solicitante-3', title: '3. Reporta una falla', content: 'Haz clic en "Tickets" y completa el formulario con los detalles del problema.', screen: 'Nuevo Ticket', icon: FileText },
                  { id: 'solicitante-4', title: '4. Historial de tickets', content: 'Consulta el estado de los tickets de tu dirección filtrando por estado.', screen: 'Tickets', icon: Search },
                  { id: 'solicitante-5', title: '5. Solicita equipos', content: 'Solicita equipos para eventos externos completando el formulario correspondiente.', screen: 'Solicitud de Préstamo', icon: Calendar },
                  { id: 'solicitante-6', title: '6. Cambia contraseña', content: 'Actualiza tu contraseña desde la sección de perfil.', screen: 'Perfil', icon: Settings }
                ].map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                    <button
                      className="w-full p-4 text-left font-medium text-gray-800 bg-white hover:bg-blue-50 rounded-xl flex justify-between items-center transition-colors duration-300 cursor-pointer"
                      onClick={() => toggleSection(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openSection === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openSection === item.id && (
                      <div className="animate-slide-down p-4 border-t border-gray-200 bg-blue-50 rounded-b-xl">
                        <p className="text-gray-700 mb-2">{item.content}</p>
                        <p className="text-sm font-medium text-blue-600 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Pantalla: {item.screen}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Resumen: ¿Qué puedes hacer como solicitante?
                </h4>
                <ul className="list-disc ml-6 text-blue-700 space-y-1">
                  <li>Crear tickets de soporte</li>
                  <li>Consultar historial de tickets</li>
                  <li>Solicitar equipos para eventos</li>
                  <li>Gestionar tu perfil y contraseña</li>
                </ul>
              </div>
            </div>

            {/* Analista */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fade-in-up flex flex-col" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-xl mr-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Analista</h3>
                  <p className="text-gray-600 text-sm">Personas que resuelven incidencias y gestionan activos</p>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                {[
                  { id: 'analista-1', title: '1. Inicia sesión', content: 'Accede con tus credenciales de analista.', screen: 'Login', icon: LogIn },
                  { id: 'analista-2', title: '2. Menú principal', content: 'Acceso completo a Equipos, Tickets y Perfil.', screen: 'Inicio del Analista', icon: Menu },
                  { id: 'analista-3', title: '3. Revisa tickets', content: 'Consulta tickets asignados filtrando por estado.', screen: 'Tickets Asignados', icon: Search },
                  { id: 'analista-4', title: '4. Cerrar tickets', content: 'Completa el proceso de cierre con condición y observaciones.', screen: 'Detalle de Ticket', icon: CheckCircle },
                  { id: 'analista-5', title: '5. Gestiona inventario', content: 'Busca y filtra equipos por diferentes criterios.', screen: 'Inventario', icon: Filter },
                  { id: 'analista-7', title: '6. Edita equipos', content: 'Actualiza información de equipos desde la vista detallada.', screen: 'Edita un equipo', icon: Edit },
                  { id: 'analista-8', title: '7. Desincorpora equipos', content: 'Proceso de baja de equipos con justificación.', screen: 'Desincorpora un equipo', icon: Trash2 },
                  { id: 'analista-9', title: '8. Cambia contraseña', content: 'Actualiza tu contraseña de acceso.', screen: 'Perfil', icon: Settings }
                ].map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl hover:border-orange-300 transition-all duration-300 hover:shadow-md">
                    <button
                      className="w-full p-4 text-left font-medium text-gray-800 bg-white hover:bg-orange-50 rounded-xl flex justify-between items-center transition-colors duration-300 cursor-pointer"
                      onClick={() => toggleSection(item.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openSection === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openSection === item.id && (
                      <div className="animate-slide-down p-4 border-t border-gray-200 bg-orange-50 rounded-b-xl">
                        <p className="text-gray-700 mb-2">{item.content}</p>
                        <p className="text-sm font-medium text-orange-600 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Pantalla: {item.screen}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-fade-in">
                <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Resumen: ¿Qué puedes hacer como analista?
                </h4>
                <ul className="list-disc ml-6 text-orange-700 space-y-1">
                  <li>Gestionar tickets asignados</li>
                  <li>Cerrar incidencias resueltas</li>
                  <li>Administrar inventario de equipos</li>
                  <li>Realizar mantenimiento de activos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Funcionalidades - CORREGIDO */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center mb-8">
            <div className="bg-gray-100 p-3 rounded-xl mr-4">
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Preguntas Frecuentes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                <div className="p-5 bg-white rounded-xl">
                  <button
                    className="w-full text-left bg-white hover:bg-gray-50 rounded-xl transition-colors duration-300 cursor-pointer"
                    onClick={() => toggleSection(item.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <item.icon className="w-5 h-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-800 text-lg">{item.question}</h3>
                        </div>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {item.role}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openSection === item.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {openSection === item.id && (
                    <div className="animate-slide-down mt-4 space-y-4">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      
                      {/* Sección del video mejorada - CORREGIDA */}
                      {item.video && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <PlayCircle className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-700">Video demostrativo:</span>
                            </div>
                            <button
                              onClick={() => toggleFullscreen(item.video!)}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors px-3 py-1 rounded-md hover:bg-blue-50"
                            >
                              <Maximize2 className="w-4 h-4 mr-1" />
                              Pantalla completa
                            </button>
                          </div>
                          <div className="flex justify-center bg-black rounded-lg overflow-hidden">
                            <video 
                              controls 
                              className="w-full max-w-lg aspect-video object-contain"
                              preload="metadata"
                              playsInline
                            >
                              <source src={item.video} type="video/mp4" />
                              Tu navegador no soporta el elemento de video.
                            </video>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 animate-fade-in">
          <p className="text-sm">
            Sistema de Gestión de Analistas Informáticos (SIGAI) - Instituto Nacional de Higiene &quot;Rafael Rangel&quot;
          </p>
        </div>
      </div>
    </div>
  )
}