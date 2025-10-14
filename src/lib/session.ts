import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import prismadb from "@/lib/prismadb" 

//Obtiene el usuario actualmente autenticado desde la sesión del servidor
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  // Consulta con relaciones incluidas
  const user = await prismadb.usuario.findUnique({
    where: { 
      email: session.user.email 
    },
    include: {
      direccion: {
        include: {
          piso: true // Incluir el piso relacionado
        }
      },
      area: true, // Incluir el área relacionada
      rol: true   // Incluir el rol relacionado
    }
  })

  return user
}