import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    cedula: string
    nombre: string
    apellido: string
    email: string
    rol: string
    rolId: number
    direccionId: number
    areaId?: number
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User
  }
}