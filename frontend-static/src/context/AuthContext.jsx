import { createContext, useContext, useEffect, useState } from 'react'
import { api, tokenStore } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!tokenStore.access) {
      setReady(true)
      return
    }
    api
      .get('/auth/me/', { auth: true })
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setReady(true))
  }, [])

  const login = async (phone, password) => {
    const data = await api.post('/auth/login/', { phone, password })
    tokenStore.set({ access: data.access, refresh: data.refresh })
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const data = await api.post('/auth/register/', payload)
    tokenStore.set({ access: data.access, refresh: data.refresh })
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    tokenStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
