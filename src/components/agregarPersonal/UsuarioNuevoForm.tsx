"use client"

import { useState } from "react"

export default function UsuarioNuevoForm() {
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Lógica para crear usuario nuevo
    console.log('Creando usuario nuevo...')
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Funcionalidad en desarrollo</h3>
      <p className="text-gray-500 mb-6">
        El formulario para agregar usuarios nuevos estará disponible próximamente.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Aquí irán los campos del formulario cuando se implemente */}
        <div className="space-y-4 opacity-50 pointer-events-none">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              placeholder="Nombre del usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              placeholder="Apellido del usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              placeholder="email@ejemplo.com"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={true}
            className="w-full bg-gray-400 text-white px-6 py-2 rounded-md font-medium cursor-not-allowed opacity-50"
          >
            Funcionalidad en desarrollo
          </button>
        </div>
      </form>
    </div>
  )
}