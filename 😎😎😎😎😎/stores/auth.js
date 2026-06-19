import { defineStore } from 'pinia'
import { useClientesStore } from './clientes'
import { useVentasStore } from './ventas'
import { useCuentasStore } from './cuentas'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    panelType: localStorage.getItem('panelType') || 'streaming',
    isAuthenticated: !!localStorage.getItem('user')
  }),

  actions: {
    login(userData) {
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
    },

    async loginWithApi(email, password, moduleName) {
      try {
        const url = (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/auth/login'
        const payload = { email, password }
        if (moduleName) payload.module = moduleName
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const body = await res.json().catch(() => null)
        if (!res.ok) {
          const msg = (body && body.error) ? body.error : 'Invalid credentials'
          throw new Error(msg)
        }
        this.user = body.user
        this.token = body.token
        this.panelType = moduleName || 'streaming'
        this.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(body.user))
        localStorage.setItem('token', body.token)
        localStorage.setItem('panelType', this.panelType)
        return body
      } catch (err) {
        throw err
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.panelType = 'streaming'
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('panelType')
    }
  }
})

export default useAuthStore
