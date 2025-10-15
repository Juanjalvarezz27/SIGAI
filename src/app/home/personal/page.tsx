"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/Navbar"
import Title from "@/components/Title"
import { ChevronLeft, ChevronRight, User, Mail, IdCard, MapPin, Briefcase } from "lucide-react"
import axios from "axios"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  cedula: string | null
  email: string | null
  rol: {
    id: number
    rol: string
  }
  direccion: {
    direccion: string
  }
  area: {
    nombre: string
  } | null
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export default function Personal() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [error, setError] = useState<string>('')

  // Función para cargar usuarios
  const cargarUsuarios = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get(`/api/usuario/obtenerUsuarios?page=${page}&limit=50`)
      
      if (response.status === 200) {
        setUsuarios(response.data.usuarios)
        setPagination(response.data.pagination)
      }
    } catch (error: unknown) {
      console.error('Error cargando usuarios:', error)
      setError('Error al cargar los usuarios')
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar usuarios cuando cambia la página
  useEffect(() => {
    cargarUsuarios(currentPage)
  }, [currentPage, cargarUsuarios])

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= (pagination?.totalPages || 1)) {
      setCurrentPage(nuevaPagina)
    }
  }

  // Función para formatear texto (capitalizar primera letra)
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <>
      <Navbar />
      <Title text={"Personal"} />

      <div className="container mx-auto px-4 py-8">
        
        {/* Información de paginación */}
        {pagination && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, pagination.totalCount)}</span> de <span className="font-semibold">{pagination.totalCount}</span> usuarios
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cambiarPagina(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => cambiarPagina(pageNum)}
                        disabled={loading}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === pageNum
                            ? 'bg-[#001F3F] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  {pagination.totalPages > 5 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </div>

                <button
                  onClick={() => cambiarPagina(currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de usuarios */}
        {!loading && !error && usuarios.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#A0C4FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#001F3F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {usuario.nombre} {usuario.apellido}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {capitalizeFirstLetter(usuario.rol.rol)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Cédula */}
                  <div className="flex items-center gap-2 text-sm">
                    <IdCard size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      {usuario.cedula || 'No registrada'}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 truncate">
                      {usuario.email || 'No registrado'}
                    </span>
                  </div>

                  {/* Dirección */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      {usuario.direccion.direccion}
                    </span>
                  </div>

                  {/* Área */}
                  {usuario.area && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">
                        {usuario.area.nombre}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay usuarios */}
        {!loading && !error && usuarios.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
            <p className="text-gray-500">No se encontraron usuarios en el sistema.</p>
          </div>
        )}

        {/* Paginación inferior */}
        {pagination && pagination.totalPages > 1 && !loading && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() => cambiarPagina(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}