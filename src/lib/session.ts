import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

//Obtiene el usuario actualmente autenticado desde la sesión del servidor
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}