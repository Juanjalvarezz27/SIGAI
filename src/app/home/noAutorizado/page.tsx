"use client"

import { useRouter } from 'next/navigation'; 

export default function NoAutorizado() {
  const router = useRouter();

  //Función de manejo del clic para la redirección.
  const handleRegresarLogin = () => {
    //Redirigir al usuario a la ruta principal ('/') usando router.push().
    router.push('/'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          No Autorizado
        </h1>
        <p className="text-gray-800 mb-4">
          No tienes permisos para acceder a esta página.
        </p>

        {/* Botón de regresar al login que activa la redirección en Next.js. */}
          <div className="flex justify-center ">
            <button
              // 5. Asignar la función de redirección.
              onClick={handleRegresarLogin}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Regresar al Login
            </button>
          </div>
      </div>
    </div>
  )
}