import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export const useVentasStore = defineStore('ventas', {
  state: () => ({
    ventas: JSON.parse(localStorage.getItem('ventas') || '[]')
  }),

  actions: {
    async fetchAll() {
      try {
        const headers = {}
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API}/api/ventas`, { headers })
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        this.ventas = data
        localStorage.setItem('ventas', JSON.stringify(this.ventas))
      } catch (err) {
        console.warn('Fetch ventas failed, using localStorage')
      }
    },

    async agregar(venta) {
      venta.valor = Number(venta.valor) || 0
      venta.fecha = venta.fecha || new Date().toISOString()
      try {
        const headers = { 'Content-Type': 'application/json' }
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API}/api/ventas`, { method: 'POST', headers, body: JSON.stringify(venta) })
        if (!res.ok) throw new Error('API error')
        const body = await res.json()
        const newItem = { id: body.id, ...venta }
        this.ventas.unshift(newItem)
        localStorage.setItem('ventas', JSON.stringify(this.ventas))
      } catch (err) {
        this.ventas.unshift(venta)
        localStorage.setItem('ventas', JSON.stringify(this.ventas))
      }
    },

    async eliminarByIndex(index) {
      const item = this.ventas[index]
      if (!item) return
      if (item.id) {
        try {
          const token = localStorage.getItem('token')
          const headers = token ? { Authorization: `Bearer ${token}` } : undefined
          await fetch(`${API}/api/ventas/${item.id}`, { method: 'DELETE', headers })
          this.ventas.splice(index, 1)
          localStorage.setItem('ventas', JSON.stringify(this.ventas))
          return
        } catch (err) {
          console.warn('API delete failed, falling back to local')
        }
      }
      this.ventas.splice(index, 1)
      localStorage.setItem('ventas', JSON.stringify(this.ventas))
    },

    actualizar(index, data) {
      if (index < 0 || index >= this.ventas.length) return
      const item = this.ventas[index]
      if (item.id) {
        try {
          const headers = { 'Content-Type': 'application/json' }
          const token = localStorage.getItem('token')
          if (token) headers['Authorization'] = `Bearer ${token}`
          fetch(`${API}/api/ventas/${item.id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
            .catch(err => console.warn('API update failed'))
        } catch (err) {
          console.warn('API update failed')
        }
      }
      this.ventas[index] = { ...this.ventas[index], ...data }
      localStorage.setItem('ventas', JSON.stringify(this.ventas))
    },

    async actualizarById(id, data) {
      try {
        const headers = { 'Content-Type': 'application/json' }
        const token = localStorage.getItem('token')
        if (token) headers['Authorization'] = `Bearer ${token}`
        await fetch(`${API}/api/ventas/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
        const idx = this.ventas.findIndex(v => v.id === id)
        if (idx !== -1) this.ventas[idx] = { ...this.ventas[idx], ...data }
        localStorage.setItem('ventas', JSON.stringify(this.ventas))
      } catch (err) {
        console.warn('API update failed')
      }
    },

    clear() {
      this.ventas = []
      localStorage.removeItem('ventas')
    }
  },

  getters: {
    totalIngresos: (state) => state.ventas.reduce((acc, v) => acc + (Number(v.valor) || 0), 0)
  }
})

export default useVentasStore
