import { useState, useEffect } from 'react'
import axios from 'axios'

interface UserRol {
  rolId: number
  rol: string
  supervisorTipoId?: number
  supervisorTipo?: {
    id: number
    tipo: string
  }
}

export function useUserRol() {
  const [userRol, setUserRol] = useState<UserRol | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRol = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/auth/usuarioRol')
        setUserRol(response.data)
      } catch (err) {
        console.error('Error obteniendo rol:', err)
        setError('Error al obtener el rol del usuario')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRol()
  }, [])

  return {
    userRol,
    loading,
    error
  }
}