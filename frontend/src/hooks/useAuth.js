import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    getProfile()
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  return { user, setUser, loading }
}
