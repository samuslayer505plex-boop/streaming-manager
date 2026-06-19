import { defineStore } from 'pinia'
import { useClientesStore } from './clientes'
import { useVentasStore } from './ventas'
import { useCuentasStore } from './cuentas'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('user')
  }),

  actions: {
    login(userData) {
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
    },

    async loginWithApi(email, password) {
      try {
        const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
        if (!res.ok) throw new Error('Invalid credentials')
        const body = await res.json()
        this.user = body.user
        this.token = body.token
        this.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(body.user))
        localStorage.setItem('token', body.token)
        return body
      } catch (err) {
        throw err
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})

export default useAuthStore
