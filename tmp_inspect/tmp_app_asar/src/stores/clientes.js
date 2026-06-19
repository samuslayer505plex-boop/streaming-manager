import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: JSON.parse(localStorage.getItem('clientes') || '[]')
  }),

  actions: {
    async fetchAll() {
      try {
        const headers = {}
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API}/api/clientes`, { headers })
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        this.clientes = data
        localStorage.setItem('clientes', JSON.stringify(this.clientes))
      } catch (err) {
        // keep local
        console.warn('Fetch clientes failed, using localStorage')
      }
    },

    async agregar(cliente) {
      try {
        const headers = { 'Content-Type': 'application/json' }
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API}/api/clientes`, { method: 'POST', headers, body: JSON.stringify(cliente) })
        if (!res.ok) throw new Error('API error')
        const body = await res.json()
        // server returns id
        const newItem = { id: body.id, ...cliente }
        this.clientes.unshift(newItem)
        localStorage.setItem('clientes', JSON.stringify(this.clientes))
      } catch (err) {
        this.clientes.unshift(cliente)
        localStorage.setItem('clientes', JSON.stringify(this.clientes))
      }
    },

    async eliminarByIndex(index) {
      const item = this.clientes[index]
      if (!item) return
      if (item.id) {
        try {
          const token = localStorage.getItem('token')
          const headers = token ? { Authorization: `Bearer ${token}` } : undefined
          await fetch(`${API}/api/clientes/${item.id}`, { method: 'DELETE', headers })
          this.clientes.splice(index, 1)
          localStorage.setItem('clientes', JSON.stringify(this.clientes))
          return
        } catch (err) {
          console.warn('API delete failed, falling back to local')
        }
      }
      this.clientes.splice(index, 1)
      localStorage.setItem('clientes', JSON.stringify(this.clientes))
    },

    async actualizarById(id, data) {
      try {
        const headers = { 'Content-Type': 'application/json' }
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        await fetch(`${API}/api/clientes/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
        const idx = this.clientes.findIndex(c => c.id === id)
        if (idx !== -1) this.clientes[idx] = { ...this.clientes[idx], ...data }
        localStorage.setItem('clientes', JSON.stringify(this.clientes))
      } catch (err) {
        console.warn('API update failed')
      }
    },

    clear() {
      this.clientes = []
      localStorage.removeItem('clientes')
    }
  }
})

export default useClientesStore
