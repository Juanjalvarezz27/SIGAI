import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prismadb from "./prismadb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Faltan credenciales")
          return null
        }

        try {
          const user = await prismadb.usuario.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              rol: true
            }
          })

          if (!user) {
            console.log("Usuario no existe")
            return null
          }

          if (!user.password) {
            console.log("Usuario sin contraseña")
            return null
          }
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log("Contraseña válida:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Contraseña incorrecta")
            return null
          }

          return {
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
          console.error("Error en authorize:", error)
          return null
        }
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 horas
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User
      }
      return session
    }
  },
  
  pages: {
    signIn: "/",
  },
  
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
}