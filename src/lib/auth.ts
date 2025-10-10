import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prismadb from "./prismadb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials", // Nombre del proveedor de autenticación
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Faltan credenciales") // Validación de campos obligatorios
          return null
        }

        try {
          const user = await prismadb.usuario.findUnique({ // Buscar usuario en BD
            where: {
              email: credentials.email
            },
            include: {
              rol: true // Incluir información del rol
            }
          })

          if (!user) {
            console.log("Usuario no existe") // Usuario no encontrado
            return null
          }

          if (!user.password) {
            console.log("Usuario sin contraseña") // Usuario sin contraseña hash
            return null
          }
          
          const isPasswordValid = await bcrypt.compare( // Verificar contraseña
            credentials.password,
            user.password
          )

          console.log("Contraseña válida:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Contraseña incorrecta") // Contraseña no coincide
            return null
          }

          return { // Retornar objeto usuario para la sesión
            id: user.id.toString(),
            cedula: user.cedula || "",
            nombre: user.nombre,
            apellido: user.apellido || "",
            email: user.email || "",
            rol: user.rol.rol, 
            rolId: user.rolId,
            direccionId: user.direccionId,
            areaId: user.areaId || undefined
          } as User
        } catch (error) {
          console.error("Error en authorize:", error) // Error en proceso de autenticación
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt", // Usar JWT para manejo de sesiones
    maxAge: 4 * 60 * 60, // 4 horas de duración de sesión
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user // Agregar datos de usuario al token JWT
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User // Pasar datos del token a la sesión
      }
      return session
    }
  },
  pages: {
    // signIn: "/", 
  },
  debug: process.env.NODE_ENV === "development", 
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET // Secreto para JWT
}