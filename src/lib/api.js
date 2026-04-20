import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

// ── Supabase (pour le realtime) ───────────────
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Client API REST ───────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

// Intercepteur : injecter le token JWT automatiquement
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mf_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur : gérer l'expiration du token
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403) {
      localStorage.removeItem('mf_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID
