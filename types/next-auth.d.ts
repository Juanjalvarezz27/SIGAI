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
    direccion: {
      id: number
      direccion: string
      pisoId: number
      piso: {
        id: number
        piso: string
      }
    }
    area?: {
      id: number
      nombre: string
      direccionId: number
    }
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