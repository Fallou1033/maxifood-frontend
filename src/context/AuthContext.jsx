import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [gerant, setGerant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mf_token')
    if (token) {
      api.get('/auth/me')
        .then(res => setGerant(res.data))
        .catch(() => localStorage.removeItem('mf_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, mot_de_passe) => {
    const res = await api.post('/auth/login', { email, mot_de_passe })
    localStorage.setItem('mf_token', res.data.token)
    setGerant(res.data.gerant)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('mf_token')
    setGerant(null)
  }

  return (
    <AuthContext.Provider value={{ gerant, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
