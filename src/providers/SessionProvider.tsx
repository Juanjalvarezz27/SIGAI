"use client"

import { SessionProvider as Provider } from "next-auth/react"

type Props = {
  children: React.ReactNode
}

//Envolvemos el children en el proveedor
export default function SessionProvider({ children }: Props) {
  return <Provider>{children}</Provider>
}