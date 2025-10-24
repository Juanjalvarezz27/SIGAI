"use client"

interface FiltroRolesProps {
  rolSeleccionado: string
  onRolChange: (rol: string) => void
  loading?: boolean
  esSupervisor?: boolean
}

export default function FiltroRoles({
  rolSeleccionado,
  onRolChange,
  loading = false,
  esSupervisor = false
}: FiltroRolesProps) {
  // Roles para admin (completo)
  const rolesAdmin = [
    { id: 'todos', nombre: 'Todos', valor: 'todos' },
    { id: 'personal', nombre: 'Personal', valor: '5' },
    { id: 'supervisor', nombre: 'Supervisor', valor: '2' },
    { id: 'solicitante', nombre: 'Solicitante', valor: '3' },
    { id: 'analista', nombre: 'Analista', valor: '4' },
    { id: 'deshabilitados', nombre: 'Deshabilitados', valor: 'deshabilitados' }
  ]

  // Roles para supervisor (limitado)
  const rolesSupervisor = [
    { id: 'todos', nombre: 'Todos', valor: 'todos' },
    { id: 'solicitante', nombre: 'Solicitante', valor: '3' },
    { id: 'analista', nombre: 'Analista', valor: '4' },
    { id: 'deshabilitados', nombre: 'Deshabilitados', valor: 'deshabilitados' }
  ]

  // Elegir los roles según el tipo de usuario
  const roles = esSupervisor ? rolesSupervisor : rolesAdmin

  return (
    <div className="flex flex-col items-center mb-3 -mt-6">
      <div className="bg-gray-200 rounded-lg p-2 flex flex-wrap justify-center gap-1">
        {roles.map((rol) => (
          <button
            key={rol.id}
            type="button"
            onClick={() => onRolChange(rol.valor)}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
              rolSeleccionado === rol.valor
                ? 'bg-white text-[#001F3F] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600`}
          >
            {rol.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}